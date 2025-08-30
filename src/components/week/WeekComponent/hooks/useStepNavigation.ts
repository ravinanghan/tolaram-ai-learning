import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { 
  WeekNavigationConfig, 
  WeekComponentCallbacks 
} from '../types';

export const useStepNavigation = (
  weekNumber: number,
  children: React.ReactNode[],
  navigationConfig: WeekNavigationConfig,
  callbacks?: WeekComponentCallbacks
) => {
  const { getCurrentPosition } = useProgress();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const currentPosition = getCurrentPosition();
    if (currentPosition.moduleId === weekNumber) {
      setCurrentStep(currentPosition.stepId);
    }
    return () => { isMountedRef.current = false; };
  }, [weekNumber, getCurrentPosition]);

  const maxSteps = React.Children.count(children);

  const handleStepChange = useCallback((newStep: number, direction: 'forward' | 'backward' = 'forward') => {
    if (newStep < 1 || newStep > maxSteps) return;
    
    // Only proceed if not already transitioning
    if (isTransitioning) return;
    
    // Prevent default behavior that might cause page refresh
    const handleClick = (e: MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Add event listener to prevent default behavior during transition
    document.addEventListener('click', handleClick, true);
    
    setIsTransitioning(true);
    
    // Update the current step
    setCurrentStep(newStep);
    
    // Call the step change callback if provided
    callbacks?.onStepChange?.(weekNumber, newStep, direction);
    
    // Reset transitioning state after animation completes
    const transitionTime = 300; // Match this with your CSS transition time
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setIsTransitioning(false);
        // Remove the event listener after transition
        document.removeEventListener('click', handleClick, true);
      }
    }, transitionTime);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClick, true);
    };
  }, [maxSteps, weekNumber, callbacks, isTransitioning]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1, 'backward');
    } else {
      callbacks?.onBack?.();
    }
  }, [currentStep, handleStepChange, callbacks]);

  const handleNext = useCallback(() => {
    console.log('Next clicked. Current step:', currentStep, 'Max steps:', maxSteps);
    
    // If already transitioning, do nothing
    if (isTransitioning) {
      console.log('Transition in progress, ignoring click');
      return;
    }
    
    if (currentStep < maxSteps) {
      console.log('Moving to step:', currentStep + 1);
      handleStepChange(currentStep + 1, 'forward');
    } else {
      console.log('All steps completed');
      callbacks?.onComplete?.(weekNumber, currentStep);
    }
  }, [currentStep, maxSteps, weekNumber, handleStepChange, callbacks, isTransitioning]);

  const nextButtonState = useMemo(() => {
    // If we're on the last step, show a different state
    if (currentStep >= maxSteps) {
      return {
        disabled: false,
        variant: 'primary' as const,
        label: 'Complete'
      };
    }
    
    // Check if we need to validate quiz completion
    if (navigationConfig.requireQuizCompletion) {
      // For now, we'll assume all steps are complete
      // In a real implementation, you would check the actual step completion state here
      return {
        disabled: false, // Temporarily disabled the completion check
        variant: 'primary' as const,
        label: 'Next'
      };
    }
    
    // Default state for next button
    return { 
      disabled: false, 
      variant: 'primary' as const,
      label: currentStep < maxSteps ? 'Next' : 'Finish'
    };
  }, [currentStep, maxSteps, weekNumber, navigationConfig.requireQuizCompletion]);

  return {
    currentStep,
    maxSteps,
    isTransitioning,
    nextButtonState,
    handleBack,
    handleNext,
    handleStepChange,
    handleQuizStateChange: (state: any) => {
      // Implementation for quiz state changes
      console.log('Quiz state changed:', state);
    }
  };
};
