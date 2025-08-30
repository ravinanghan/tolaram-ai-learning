import { useState, useCallback, useEffect, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useModuleData } from './useModuleData';
import { WeekNavigationConfig, WeekComponentCallbacks, WeekStepState, WeekNavigationActions } from '../types/week.types';

const useWeekNavigation = (
  weekNumber: number,
  navigationConfig: WeekNavigationConfig,
  callbacks?: WeekComponentCallbacks,
  enableDebugMode = false
) => {
  const {
    getCurrentPosition,
    updateCurrentPosition,
    completeStep,
    completeModule,
    getStepState,
  } = useProgress();

  const { stepCount } = useModuleData(weekNumber);
  const isMountedRef = useRef(true);
  
  const [state, setState] = useState<WeekStepState>({
    currentStep: 1,
    isTransitioning: false,
    error: null,
    isCompleted: false
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Sync with global progress
  useEffect(() => {
    try {
      const currentPosition = getCurrentPosition();
      const isCurrentWeek = currentPosition.moduleId === weekNumber;
      
      if (isCurrentWeek && currentPosition.stepId !== state.currentStep) {
        setState(prev => ({
          ...prev,
          currentStep: currentPosition.stepId
        }));
      }
    } catch (error) {
      console.error('Error syncing progress:', error);
      callbacks?.onError?.(error as Error, 'syncProgress');
    }
  }, [weekNumber, getCurrentPosition, callbacks]);

  // Navigation handlers
  const goToStep = useCallback(async (step: number, direction: 'forward' | 'backward' = 'forward') => {
    if (state.isTransitioning) return;
    
    try {
      setState(prev => ({ ...prev, isTransitioning: true }));
      
      // Call the step change callback
      await callbacks?.onStepChange?.(weekNumber, step, direction);
      
      // Update the current position in the global state
      await updateCurrentPosition(weekNumber, step);
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          currentStep: step,
          isTransitioning: false
        }));
      }
    } catch (error) {
      console.error('Error changing step:', error);
      callbacks?.onError?.(error as Error, 'stepChange');
      setState(prev => ({ ...prev, isTransitioning: false }));
    }
  }, [weekNumber, state.isTransitioning, callbacks, updateCurrentPosition]);

  const goToNextStep = useCallback(() => {
    if (state.currentStep < stepCount) {
      return goToStep(state.currentStep + 1, 'forward');
    }
  }, [state.currentStep, stepCount, goToStep]);

  const goToPreviousStep = useCallback(() => {
    if (state.currentStep > 1) {
      return goToStep(state.currentStep - 1, 'backward');
    }
  }, [state.currentStep, goToStep]);

  const completeCurrentStep = useCallback(async () => {
    try {
      await completeStep(weekNumber, state.currentStep);
      
      // If this is the last step, mark the week as completed
      if (state.currentStep === stepCount) {
        await completeModule(weekNumber);
        setState(prev => ({ ...prev, isCompleted: true }));
        callbacks?.onComplete?.(weekNumber, state.currentStep);
      } else if (navigationConfig.autoAdvanceOnComplete) {
        await goToNextStep();
      }
    } catch (error) {
      console.error('Error completing step:', error);
      callbacks?.onError?.(error as Error, 'completeStep');
    }
  }, [
    weekNumber,
    state.currentStep,
    stepCount,
    navigationConfig.autoAdvanceOnComplete,
    callbacks,
    completeStep,
    completeModule,
    goToNextStep
  ]);

  return {
    ...state,
    actions: {
      goToStep,
      goToNextStep,
      goToPreviousStep,
      completeCurrentStep,
    } as WeekNavigationActions,
    stepCount,
    currentStepState: getStepState(weekNumber, state.currentStep),
  };
};

export default useWeekNavigation;
