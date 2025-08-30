import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getUserProgress, 
  saveUserProgress, 
  subscribeToProgress,
  updateStepState as updateFirestoreStepState,
  saveQuizAnswer as saveFirestoreQuizAnswer,
  completeModule as completeFirestoreModule,
  initializeUserProgress
} from '@/firebase/firestore';
import { StepStateManager } from '@/utils/stepStateManager';
import type { Progress, StepState, QuizAnswer, ModuleProgressData } from '@/types/global';

interface UseFirebaseProgressReturn {
  progress: Progress;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  lastSyncTime: number | null;
  
  // Progress operations
  updateStepState: (moduleId: number, stepId: number, state: Partial<StepState>) => Promise<void>;
  saveQuizAnswer: (moduleId: number, stepId: number, answer: QuizAnswer) => Promise<void>;
  completeStep: (moduleId: number, stepId: number) => Promise<void>;
  completeModule: (moduleId: number) => Promise<void>;
  
  // Utility functions
  getStepState: (moduleId: number, stepId: number) => StepState | null;
  isStepAttempted: (moduleId: number, stepId: number) => boolean;
  canNavigateToStep: (moduleId: number, stepId: number) => boolean;
  getModuleProgress: (moduleId: number) => number;
  getCurrentPosition: () => { moduleId: number; stepId: number };
  
  // Sync operations
  forcSync: () => Promise<void>;
  clearError: () => void;
}

const initialProgress: Progress = {
  completedModules: [],
  currentModule: 1,
  currentStep: 1,
  moduleProgress: {},
  lastActiveSession: Date.now()
};

export const useFirebaseProgress = (userId: string | null): UseFirebaseProgressReturn => {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pendingUpdatesRef = useRef<Array<() => Promise<void>>>([]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize and subscribe to progress
  useEffect(() => {
    if (!userId) {
      setProgress(initialProgress);
      setIsLoading(false);
      return;
    }

    const initializeProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get existing progress
        let userProgress = await getUserProgress(userId);
        
        // If no progress exists, initialize it
        if (!userProgress) {
          await initializeUserProgress(userId);
          userProgress = await getUserProgress(userId);
        }

        if (userProgress) {
          setProgress(userProgress);
          setLastSyncTime(Date.now());
        }

        // Subscribe to real-time updates
        const unsubscribe = subscribeToProgress(userId, (updatedProgress) => {
          if (updatedProgress) {
            setProgress(updatedProgress);
            setLastSyncTime(Date.now());
          }
        });

        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error('Error initializing progress:', error);
        setError('Failed to load progress data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userId]);

  // Process pending updates when back online
  useEffect(() => {
    if (isOnline && pendingUpdatesRef.current.length > 0) {
      const processPendingUpdates = async () => {
        const updates = [...pendingUpdatesRef.current];
        pendingUpdatesRef.current = [];

        for (const update of updates) {
          try {
            await update();
          } catch (error) {
            console.error('Error processing pending update:', error);
          }
        }
      };

      processPendingUpdates();
    }
  }, [isOnline]);

  // Helper function to queue updates when offline
  const queueUpdate = useCallback((updateFn: () => Promise<void>) => {
    if (isOnline) {
      return updateFn();
    } else {
      pendingUpdatesRef.current.push(updateFn);
      return Promise.resolve();
    }
  }, [isOnline]);

  // Update step state
  const updateStepState = useCallback(async (
    moduleId: number, 
    stepId: number, 
    state: Partial<StepState>
  ): Promise<void> => {
    if (!userId) return;

    // Update local state immediately
    setProgress(prev => {
      const newProgress = { ...prev };
      
      if (!newProgress.moduleProgress[moduleId]) {
        newProgress.moduleProgress[moduleId] = {
          completedSteps: [],
          stepStates: {},
          currentStep: 1,
          startedAt: Date.now()
        };
      }
      
      const currentStepState = newProgress.moduleProgress[moduleId]!.stepStates[stepId] || 
        StepStateManager.createStepState(stepId);
      
      const updatedStepState = StepStateManager.updateStepState(currentStepState, state);
      
      newProgress.moduleProgress[moduleId] = StepStateManager.updateModuleProgress(
        newProgress.moduleProgress[moduleId]!,
        stepId,
        updatedStepState
      );
      
      newProgress.lastActiveSession = Date.now();
      return newProgress;
    });

    // Queue Firebase update
    return queueUpdate(async () => {
      await updateFirestoreStepState(userId, moduleId, stepId, state);
    });
  }, [userId, queueUpdate]);

  // Save quiz answer
  const saveQuizAnswer = useCallback(async (
    moduleId: number,
    stepId: number,
    answer: QuizAnswer
  ): Promise<void> => {
    if (!userId) return;

    // Update local state immediately
    await updateStepState(moduleId, stepId, {
      quizAnswer: answer,
      completed: answer.isCorrect
    });

    // Queue Firebase update
    return queueUpdate(async () => {
      await saveFirestoreQuizAnswer(userId, moduleId, stepId, answer);
    });
  }, [userId, updateStepState, queueUpdate]);

  // Complete step
  const completeStep = useCallback(async (moduleId: number, stepId: number): Promise<void> => {
    return updateStepState(moduleId, stepId, { completed: true });
  }, [updateStepState]);

  // Complete module
  const completeModule = useCallback(async (moduleId: number): Promise<void> => {
    if (!userId) return;

    // Update local state immediately
    setProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress.completedModules.includes(moduleId)) {
        newProgress.completedModules.push(moduleId);
      }
      newProgress.lastActiveSession = Date.now();
      return newProgress;
    });

    // Queue Firebase update
    return queueUpdate(async () => {
      await completeFirestoreModule(userId, moduleId);
    });
  }, [userId, queueUpdate]);

  // Utility functions
  const getStepState = useCallback((moduleId: number, stepId: number): StepState | null => {
    const moduleData = progress.moduleProgress[moduleId];
    return moduleData?.stepStates?.[stepId] || null;
  }, [progress]);

  const isStepAttempted = useCallback((moduleId: number, stepId: number): boolean => {
    const stepState = getStepState(moduleId, stepId);
    return StepStateManager.isStepAttempted(stepState);
  }, [getStepState]);

  const canNavigateToStep = useCallback((moduleId: number, stepId: number): boolean => {
    const moduleData = progress.moduleProgress[moduleId];
    return StepStateManager.canNavigateToStep(moduleData || null, stepId);
  }, [progress]);

  const getModuleProgress = useCallback((moduleId: number): number => {
    const moduleData = progress.moduleProgress[moduleId];
    // Get total steps from modules data (you might want to make this dynamic)
    const totalSteps = 4; // Default for now, should be fetched from module data
    return StepStateManager.calculateModuleProgress(moduleData || null, totalSteps);
  }, [progress]);

  const getCurrentPosition = useCallback((): { moduleId: number; stepId: number } => {
    return {
      moduleId: progress.currentModule,
      stepId: progress.currentStep
    };
  }, [progress]);

  // Force sync with Firebase
  const forcSync = useCallback(async (): Promise<void> => {
    if (!userId || !isOnline) return;

    try {
      setError(null);
      await saveUserProgress(userId, progress);
      setLastSyncTime(Date.now());
    } catch (error) {
      console.error('Force sync error:', error);
      setError('Failed to sync progress');
    }
  }, [userId, isOnline, progress]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    progress,
    isLoading,
    error,
    isOnline,
    lastSyncTime,
    updateStepState,
    saveQuizAnswer,
    completeStep,
    completeModule,
    getStepState,
    isStepAttempted,
    canNavigateToStep,
    getModuleProgress,
    getCurrentPosition,
    forcSync,
    clearError
  };
};