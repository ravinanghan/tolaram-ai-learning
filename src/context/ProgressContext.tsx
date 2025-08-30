import React, { createContext, useContext, ReactNode } from 'react';
import type { Progress, ProgressContextType, ModulesData, StepState, QuizAnswer } from '@/types/global';
import { useAuth } from './AuthContext';
import { useFirebaseProgress } from '@/hooks/useFirebaseProgress';
import { isWeekTimeLocked, getWeekLockInfo } from '@/utils/weekLocking';
import { StepStateManager } from '@/utils/stepStateManager';
import modulesData from '@/data/modules.json';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}


export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const firebaseProgress = useFirebaseProgress(user?.id || null);

  const updateCurrentPosition = (moduleId: number, stepId: number): void => {
    // Update current position in Firebase
    firebaseProgress.updateStepState(moduleId, stepId, {
      lastAccessed: Date.now()
    });
  };

  const isModuleUnlocked = (moduleId: number): boolean => {
    // Only Week 1 is unlocked for now
    const unlocked = moduleId === 1;
    return unlocked;
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    return firebaseProgress.progress.completedModules.includes(moduleId);
  };

  const getModuleStepCount = (moduleId: number): number => {
    const typedModulesData = modulesData as ModulesData;
    const module = typedModulesData.modules.find(m => m.id === moduleId);
    return module?.steps?.length || 0;
  };

  const getOverallProgress = (): number => {
    const totalModules = 6;
    const completedModules = firebaseProgress.progress.completedModules.length;
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  };

  const hasInProgress = (): boolean => {
    return firebaseProgress.progress.currentStep > 1 || Object.keys(firebaseProgress.progress.moduleProgress).length > 0;
  };

  // Add function to get week lock information
  const getWeekLockInformation = (moduleId: number) => {
    return getWeekLockInfo(moduleId);
  };

  const clearQuizAnswer = (moduleId: number, stepId: number): void => {
    const currentState = firebaseProgress.getStepState(moduleId, stepId);
    
    // Create a new state without the quiz answer
    const newState: Partial<StepState> = {
      completed: false,
      videoWatched: currentState?.videoWatched || false,
      pdfDownloaded: currentState?.pdfDownloaded || false,
      lastAccessed: Date.now()
    };
    
    // Update via Firebase
    firebaseProgress.updateStepState(moduleId, stepId, newState);
  };

  const getQuizAnswer = (moduleId: number, stepId: number): QuizAnswer | null => {
    const stepState = firebaseProgress.getStepState(moduleId, stepId);
    return stepState?.quizAnswer || null;
  };

  const getNextIncompleteStep = (moduleId: number): number | null => {
    const moduleData = firebaseProgress.progress.moduleProgress[moduleId];
    const totalSteps = getModuleStepCount(moduleId);
    
    return StepStateManager.getNextIncompleteStep(moduleData || null, totalSteps);
  };

  const markVideoWatched = (moduleId: number, stepId: number, watched: boolean): void => {
    firebaseProgress.updateStepState(moduleId, stepId, { videoWatched: watched });
  };

  const markPdfDownloaded = (moduleId: number, stepId: number, downloaded: boolean): void => {
    firebaseProgress.updateStepState(moduleId, stepId, { pdfDownloaded: downloaded });
  };

  const value: ProgressContextType = {
    progress: firebaseProgress.progress,
    completeStep: firebaseProgress.completeStep,
    completeModule: firebaseProgress.completeModule,
    updateCurrentPosition,
    isModuleUnlocked,
    isModuleCompleted,
    getModuleProgress: firebaseProgress.getModuleProgress,
    getOverallProgress,
    hasInProgress,
    getWeekLockInformation,
    
    // Enhanced functionality
    updateStepState: firebaseProgress.updateStepState,
    getStepState: firebaseProgress.getStepState,
    isStepAttempted: firebaseProgress.isStepAttempted,
    saveQuizAnswer: firebaseProgress.saveQuizAnswer,
    clearQuizAnswer,
    getQuizAnswer,
    canNavigateToStep: firebaseProgress.canNavigateToStep,
    getNextIncompleteStep,
    getCurrentPosition: firebaseProgress.getCurrentPosition,
    markVideoWatched,
    markPdfDownloaded
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};