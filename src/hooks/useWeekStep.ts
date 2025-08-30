import { useEffect, useCallback } from 'react';
import { useProgress } from '@/context/ProgressContext';

export const useWeekStep = (moduleId: number, stepId: number) => {
  const { updateStepState, getStepState } = useProgress();

  useEffect(() => {
    updateStepState(moduleId, stepId, { lastAccessed: Date.now() });
  }, [moduleId, stepId, updateStepState]);

  const markCompleted = useCallback(() => {
    updateStepState(moduleId, stepId, { completed: true, lastAccessed: Date.now() });
  }, [moduleId, stepId, updateStepState]);

  const state = getStepState(moduleId, stepId);

  return { state, markCompleted };
};

export const useQuizSync = (moduleId: number, stepId: number, onQuizStateChange?: () => void) => {
  const { getStepState } = useProgress();

  const notifyQuizChange = useCallback(() => {
    setTimeout(() => {
      onQuizStateChange?.();
    }, 200);
  }, [onQuizStateChange]);

  const stepState = getStepState(moduleId, stepId);

  return { stepState, notifyQuizChange };
};


