import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import WeekHeader from './WeekHeader';
import WeekFooter, { NavigationButton } from './WeekFooter';
import type {
  WeekComponentProps,
  WeekNavigationConfig,
  WeekComponentCallbacks,
  StepComponentProps
} from '../types/week.types';
import { useProgress } from '@/context/ProgressContext';
import { useModuleData } from '@/hooks/useModuleData';









// Default configurations
const DEFAULT_NAVIGATION_CONFIG: WeekNavigationConfig = {
  allowBackNavigation: true,
  allowForwardNavigation: true,
  requireQuizCompletion: true,
  autoAdvanceOnComplete: false
};

// Enhanced error boundary component
class WeekComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WeekComponent Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading this week. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom hook for step navigation logic
const useStepNavigation = (
  weekNumber: number,
  children: React.ReactNode[],
  navigationConfig: WeekNavigationConfig,
  callbacks?: WeekComponentCallbacks,
  enableDebugMode = false
) => {
  const {
    progress,
    getModuleProgress,
    updateCurrentPosition,
    canNavigateToStep,
    getCurrentPosition,
    completeStep,
    completeModule,
    isStepAttempted,
    getStepState,
    updateStepState
  } = useProgress();

  // Get module data
  const { stepCount } = useModuleData(weekNumber);
  const maxSteps = stepCount || React.Children.count(children);

  // State management
  const currentPosition = getCurrentPosition();
  const isCurrentWeek = currentPosition.moduleId === weekNumber;
  const contextCurrentStep = isCurrentWeek ? currentPosition.stepId : 1;

  const [currentStep, setCurrentStep] = useState(contextCurrentStep);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);

  // Ref to track mounted state
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sync with context when position changes
  useEffect(() => {
    if (isCurrentWeek && contextCurrentStep !== currentStep && !isTransitioning) {
      setCurrentStep(contextCurrentStep);
    }
  }, [contextCurrentStep, isCurrentWeek, currentStep, isTransitioning]);

  // Error handling wrapper
  const withErrorHandling = useCallback((fn: Function, context: string) => {
    return (...args: any[]) => {
      try {
        return fn(...args);
      } catch (error) {
        console.error(`Error in ${context}:`, error);
        callbacks?.onError?.(error as Error, context);
      }
    };
  }, [callbacks]);

  // Step transition validation
  const validateStepTransition = useCallback((fromStep: number, toStep: number): boolean => {
    // Basic bounds check
    if (toStep < 1 || toStep > maxSteps) return false;

    // Custom validation if provided
    if (callbacks?.onStepChange) {
      try {
        const stepState = getStepState(weekNumber, fromStep);
        // Custom validation can be added here if needed
        return true;
      } catch (error) {
        console.error('Step validation error:', error);
        return false;
      }
    }

    return true;
  }, [maxSteps, callbacks, getStepState, weekNumber]);

  // Enhanced step change handler
  const handleStepChange = useCallback(withErrorHandling((
    newStep: number,
    direction: 'forward' | 'backward' = 'forward',
    force = false
  ) => {
    if (isTransitioning && !force) return;

    // Validate transition
    if (!validateStepTransition(currentStep, newStep)) {
      console.warn(`Invalid step transition from ${currentStep} to ${newStep}`);
      return;
    }

    setIsTransitioning(true);

    // For backward navigation (review mode)
    if (direction === 'backward' && navigationConfig.allowBackNavigation) {
      if (newStep >= 1 && newStep < currentStep) {
        setCurrentStep(newStep);
        updateCurrentPosition(weekNumber, newStep);
        callbacks?.onStepChange?.(weekNumber, newStep, direction);
      }
    }
    // For forward navigation
    else if (direction === 'forward' && navigationConfig.allowForwardNavigation) {
      if (newStep >= 1 && newStep <= maxSteps && canNavigateToStep(weekNumber, newStep)) {
        setCurrentStep(newStep);
        updateCurrentPosition(weekNumber, newStep);
        callbacks?.onStepChange?.(weekNumber, newStep, direction);
      }
    }

    // Reset transition state after animation
    setTimeout(() => {
      if (isMountedRef.current) {
        setIsTransitioning(false);
      }
    }, 300);
  }, 'handleStepChange'), [currentStep, maxSteps, weekNumber, isTransitioning, navigationConfig, validateStepTransition, canNavigateToStep, updateCurrentPosition, callbacks, withErrorHandling]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (currentStep > 1 && navigationConfig.allowBackNavigation) {
      handleStepChange(currentStep - 1, 'backward');
    }
  }, [currentStep, handleStepChange, navigationConfig.allowBackNavigation]);

  const handleNext = useCallback(withErrorHandling(() => {
    if (currentStep < maxSteps) {
      const stepState = getStepState(weekNumber, currentStep);

      // Check quiz completion requirement
      if (navigationConfig.requireQuizCompletion) {
        // If there's a quiz answer and it's correct, proceed
        if (stepState?.quizAnswer?.isCorrect) {
          completeStep(weekNumber, currentStep);
          handleStepChange(currentStep + 1, 'forward');
        }
        // If there's a quiz answer but it's incorrect, don't proceed
        else if (stepState?.quizAnswer && !stepState.quizAnswer.isCorrect) {
          // Stay on current step, don't advance
          return;
        }
        // If no quiz answer yet but step has been attempted, still don't proceed
        else if (!stepState?.quizAnswer && isStepAttempted(weekNumber, currentStep)) {
          // This handles steps with quizzes that haven't been answered yet
          return;
        }
        // If step hasn't been attempted at all, mark as attempted but don't advance
        else {
          // Mark step as attempted for navigation
          updateStepState(weekNumber, currentStep, { lastAccessed: Date.now() });
          return;
        }
      } else {
        // For non-quiz steps or when quiz completion is not required
        completeStep(weekNumber, currentStep);
        handleStepChange(currentStep + 1, 'forward');
      }
    } else if (currentStep === maxSteps) {
      // Complete the final step and the entire week
      const stepState = getStepState(weekNumber, currentStep);

      // Check if final step has requirements
      if (navigationConfig.requireQuizCompletion) {
        // For quiz-based final steps
        if (stepState?.quizAnswer?.isCorrect) {
          completeStep(weekNumber, currentStep);
          completeModule(weekNumber);
          callbacks?.onComplete?.(weekNumber, currentStep);
        }
        // For activity-based final steps (like Step4 with video/PDF)
        else if (stepState?.completed) {
          completeStep(weekNumber, currentStep);
          completeModule(weekNumber);
          callbacks?.onComplete?.(weekNumber, currentStep);
        }
        else {
          // Don't complete if requirements not met
          return;
        }
      } else {
        // Complete the week without quiz requirements
        completeStep(weekNumber, currentStep);
        completeModule(weekNumber);
        callbacks?.onComplete?.(weekNumber, currentStep);
      }
    }
  }, 'handleNext'), [currentStep, maxSteps, weekNumber, navigationConfig, getStepState, completeStep, completeModule, handleStepChange, isStepAttempted, callbacks, withErrorHandling, updateStepState]);

  // Quiz state change handler with improved synchronization
  const handleQuizStateChange = useCallback(() => {
    if (enableDebugMode) {
      console.log('handleQuizStateChange called for Week', weekNumber, 'Step', currentStep);
    }

    // Force re-render to update button state
    setForceRerender(prev => {
      const newValue = prev + 1;
      if (enableDebugMode) {
        console.log('Force rerender triggered:', newValue);
      }
      return newValue;
    });

    // Small delay to ensure all state updates are processed
    setTimeout(() => {
      const stepState = getStepState(weekNumber, currentStep);
      if (enableDebugMode) {
        console.log('State after quiz change:', {
          stepState,
          currentStep,
          weekNumber,
          autoAdvance: navigationConfig.autoAdvanceOnComplete
        });
      }

      // Auto-advance if configured and quiz was answered correctly
      if (navigationConfig.autoAdvanceOnComplete && stepState?.quizAnswer?.isCorrect) {
        if (enableDebugMode) {
          console.log('Auto-advancing to next step');
        }
        handleNext();
      }
    }, 200); // Increased delay for better state synchronization
  }, [navigationConfig.autoAdvanceOnComplete, getStepState, weekNumber, currentStep, handleNext, enableDebugMode]);

  // Calculate next button state with improved logic
  const nextButtonState = useMemo(() => {
    const stepState = getStepState(weekNumber, currentStep);

    // Debug logging for troubleshooting (only in debug mode)
    if (enableDebugMode) {
      console.log('nextButtonState calculation:', {
        currentStep,
        weekNumber,
        stepState,
        requireQuizCompletion: navigationConfig.requireQuizCompletion,
        isStepAttempted: isStepAttempted(weekNumber, currentStep),
        forceRerender
      });
    }

    // If step is explicitly completed, always enable
    if (stepState?.completed) {
      return { disabled: false, variant: 'primary' as const };
    }

    // Handle quiz-based steps when quiz completion is required
    if (navigationConfig.requireQuizCompletion) {
      // If step has a correct quiz answer, enable navigation
      if (stepState?.quizAnswer?.isCorrect) {
        return { disabled: false, variant: 'primary' as const };
      }

      // If step has an incorrect quiz answer, disable navigation
      if (stepState?.quizAnswer && !stepState.quizAnswer.isCorrect) {
        return { disabled: true, variant: 'outline' as const };
      }

      // If step is activity-based (like Step4) and completed, enable navigation
      if (!stepState?.quizAnswer && stepState?.completed) {
        return { disabled: false, variant: 'primary' as const };
      }

      // If no quiz answer exists and step not completed, disable navigation
      if (!stepState?.quizAnswer && !stepState?.completed) {
        return { disabled: true, variant: 'outline' as const };
      }
    }

    // For steps that don't require quiz completion, always allow navigation
    if (!navigationConfig.requireQuizCompletion) {
      return { disabled: false, variant: 'primary' as const };
    }

    // Default fallback - should not reach here
    return { disabled: true, variant: 'outline' as const };
  }, [currentStep, weekNumber, getStepState, forceRerender, navigationConfig.requireQuizCompletion, isStepAttempted, enableDebugMode]);

  return {
    currentStep,
    maxSteps,
    handlePrevious,
    handleNext,
    handleQuizStateChange,
    nextButtonState,
    isTransitioning,
    weekProgress: getModuleProgress(weekNumber)
  };
};

// Main WeekComponent
const WeekComponent: React.FC<WeekComponentProps> = ({
  weekNumber,
  title,
  description,
  children,
  navigationConfig = DEFAULT_NAVIGATION_CONFIG,
  callbacks,
  footerConfig,
  enableDebugMode = false,
  initialStep,
  validateStepTransition,
  className = '',
  contentClassName = ''
}) => {
  const mergedNavigationConfig = { ...DEFAULT_NAVIGATION_CONFIG, ...navigationConfig };

  const {
    currentStep,
    maxSteps,
    handlePrevious,
    handleNext,
    handleQuizStateChange,
    nextButtonState,
    isTransitioning,
    weekProgress
  } = useStepNavigation(weekNumber, children, mergedNavigationConfig, callbacks, enableDebugMode);

  // Initialize step if provided
  useEffect(() => {
    if (initialStep && initialStep !== currentStep && initialStep >= 1 && initialStep <= maxSteps) {
      // Handle initial step setting if needed
    }
  }, [initialStep, currentStep, maxSteps]);

  // Enhanced step component with injected props
  const currentStepComponent = useMemo(() => {
    const component = React.Children.toArray(children)[currentStep - 1];

    if (React.isValidElement(component)) {
      const enhancedProps: StepComponentProps = {
        onQuizStateChange: handleQuizStateChange,
        onStepComplete: () => callbacks?.onStepChange?.(weekNumber, currentStep, 'forward'),
        onStepAttempt: () => {
          // Mark step as attempted
        },
        ...component.props
      };

      return React.cloneElement(component, enhancedProps);
    }

    return component;
  }, [children, currentStep, handleQuizStateChange, callbacks, weekNumber]);

  // Navigation button configurations
  const previousButton: NavigationButton = {
    label: 'Previous',
    disabled: currentStep <= 1 || !mergedNavigationConfig.allowBackNavigation,
    onClick: handlePrevious,
    ...footerConfig?.previousButton
  };

  const nextButton: NavigationButton = {
    label: currentStep === maxSteps ? 'Complete Week' : 'Next Step',
    disabled: nextButtonState.disabled,
    variant: nextButtonState.variant,
    onClick: handleNext,
    ...footerConfig?.nextButton
  };

  // Enhanced debug information for navigation buttons (only in debug mode)
  useEffect(() => {
    if (enableDebugMode) {
      console.log('Navigation Button States:', {
        weekNumber,
        currentStep,
        maxSteps,
        nextButtonState,
        previousButtonDisabled: previousButton.disabled,
        isTransitioning,
        weekProgress
      });
    }
  }, [enableDebugMode, weekNumber, currentStep, maxSteps, nextButtonState, previousButton.disabled, isTransitioning, weekProgress]);

  return (
    <WeekComponentErrorBoundary onError={(error) => callbacks?.onError?.(error, 'WeekComponent')}>
      <div className={`flex flex-col ${className}`}>
        {/* Header */}
        <WeekHeader
          weekNumber={weekNumber}
          title={title}
          description={description}
          progress={weekProgress}
          onBack={callbacks?.onBack}
        />

        {/* Main Content */}
        <main className={`bg-white dark:bg-gray-800 mb-6 ${contentClassName}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.6, 1],
                delay: isTransitioning ? 0.1 : 0
              }}
              className="w-full"
            >
              {currentStepComponent}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <WeekFooter
          currentStep={currentStep}
          totalSteps={maxSteps}
          previousButton={previousButton}
          nextButton={nextButton}
          disableAnimations={isTransitioning}
          {...footerConfig}
        />
      </div>
    </WeekComponentErrorBoundary>
  );
};

export default WeekComponent;

// Export types for external use
export type {
  WeekComponentProps,
  WeekNavigationConfig,
  WeekComponentCallbacks,
  StepComponentProps
};