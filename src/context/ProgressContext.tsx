import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Progress, ProgressContextType, ModulesData, StepState, QuizAnswer } from '@/types/global';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/types';
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

const initialProgress: Progress = {
  completedModules: [],
  currentModule: 1,
  currentStep: 1,
  moduleProgress: {},
  lastActiveSession: Date.now()
};

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<Progress>(initialProgress);

  useEffect(() => {
    const initializeProgress = () => {
      try {
        const savedProgress = storage.get<Progress>(STORAGE_KEYS.PROGRESS);
        if (savedProgress) {
          setProgress(savedProgress);
        }
      } catch (error) {
        console.error('Error initializing progress:', error);
      }
    };

    initializeProgress();
  }, []);

  const saveProgress = (newProgress: Progress): void => {
    try {
      setProgress(newProgress);
      storage.set(STORAGE_KEYS.PROGRESS, newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const completeStep = (moduleId: number, stepId: number): void => {
    const newProgress = { ...progress };
    
    if (!newProgress.moduleProgress[moduleId]) {
      newProgress.moduleProgress[moduleId] = {
        completedSteps: [],
        stepStates: {},
        currentStep: 1,
        startedAt: Date.now()
      };
    }
    
    // Update step state to completed
    const currentStepState = newProgress.moduleProgress[moduleId]!.stepStates[stepId] || 
      StepStateManager.createStepState(stepId);
    
    const updatedStepState = StepStateManager.updateStepState(currentStepState, {
      completed: true
    });
    
    newProgress.moduleProgress[moduleId] = StepStateManager.updateModuleProgress(
      newProgress.moduleProgress[moduleId]!,
      stepId,
      updatedStepState
    );

    saveProgress(newProgress);
  };

  const completeModule = (moduleId: number): void => {
    const newProgress = { ...progress };
    
    if (!newProgress.completedModules.includes(moduleId)) {
      newProgress.completedModules.push(moduleId);
    }

    // Stay on Week 1 as the only unlocked module
    newProgress.currentModule = 1;
    newProgress.currentStep = 1;

    saveProgress(newProgress);
  };

  const updateCurrentPosition = (moduleId: number, stepId: number): void => {
    const newProgress = { ...progress };
    newProgress.currentModule = moduleId;
    newProgress.currentStep = stepId;
    saveProgress(newProgress);
  };

  const isModuleUnlocked = (moduleId: number): boolean => {
    // Only Week 1 is unlocked for now
    const unlocked = moduleId === 1;
    console.log(`Module ${moduleId} unlock check (Week1-only mode):`, { unlocked });
    return unlocked;
  };

  const isModuleCompleted = (moduleId: number): boolean => {
    return progress.completedModules.includes(moduleId);
  };

  const getModuleProgress = (moduleId: number): number => {
    const moduleData = progress.moduleProgress[moduleId];
    const totalSteps = getModuleStepCount(moduleId);
    
    return StepStateManager.calculateModuleProgress(moduleData || null, totalSteps);
  };

  const getModuleStepCount = (moduleId: number): number => {
    const typedModulesData = modulesData as ModulesData;
    const module = typedModulesData.modules.find(m => m.id === moduleId);
    return module?.steps?.length || 0;
  };

  const getOverallProgress = (): number => {
    const totalModules = 6;
    const completedModules = progress.completedModules.length;
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  };

  const hasInProgress = (): boolean => {
    return progress.currentStep > 1 || Object.keys(progress.moduleProgress).length > 0;
  };

  // Add function to get week lock information
  const getWeekLockInformation = (moduleId: number) => {
    return getWeekLockInfo(moduleId);
  };

  // Enhanced functionality methods
  const updateStepState = (moduleId: number, stepId: number, state: Partial<StepState>): void => {
    const newProgress = { ...progress };
    
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
    
    // Update current position if progressing forward
    if (stepId > newProgress.currentStep && moduleId === newProgress.currentModule) {
      newProgress.currentStep = stepId;
    }
    
    newProgress.lastActiveSession = Date.now();
    saveProgress(newProgress);
  };

  const getStepState = (moduleId: number, stepId: number): StepState | null => {
    const moduleData = progress.moduleProgress[moduleId];
    return moduleData?.stepStates?.[stepId] || null;
  };

  const isStepAttempted = (moduleId: number, stepId: number): boolean => {
    const stepState = getStepState(moduleId, stepId);
    return StepStateManager.isStepAttempted(stepState);
  };

  const saveQuizAnswer = (moduleId: number, stepId: number, answer: QuizAnswer): void => {
    updateStepState(moduleId, stepId, {
      quizAnswer: answer,
      completed: answer.isCorrect
    });
  };

  const clearQuizAnswer = (moduleId: number, stepId: number): void => {
    // Get current step state
    const currentState = getStepState(moduleId, stepId);
    
    // Create a new state without the quiz answer
    const newState = {
      id: stepId,
      completed: false,
      videoWatched: currentState?.videoWatched || false,
      pdfDownloaded: currentState?.pdfDownloaded || false,
      lastAccessed: Date.now(),
      timeSpent: currentState?.timeSpent || 0
    };
    
    // Update the step state completely
    const newProgress = { ...progress };
    
    if (!newProgress.moduleProgress[moduleId]) {
      newProgress.moduleProgress[moduleId] = {
        completedSteps: [],
        stepStates: {},
        currentStep: 1,
        startedAt: Date.now()
      };
    }
    
    // Replace the step state entirely
    newProgress.moduleProgress[moduleId]!.stepStates[stepId] = newState;
    
    // Update completed steps array
    newProgress.moduleProgress[moduleId] = StepStateManager.updateModuleProgress(
      newProgress.moduleProgress[moduleId]!,
      stepId,
      newState
    );
    
    newProgress.lastActiveSession = Date.now();
    saveProgress(newProgress);
  };

  const getQuizAnswer = (moduleId: number, stepId: number): QuizAnswer | null => {
    const stepState = getStepState(moduleId, stepId);
    return stepState?.quizAnswer || null;
  };

  const canNavigateToStep = (moduleId: number, stepId: number): boolean => {
    if (!isModuleUnlocked(moduleId)) return false;
    
    const moduleData = progress.moduleProgress[moduleId];
    return StepStateManager.canNavigateToStep(moduleData || null, stepId);
  };

  const getNextIncompleteStep = (moduleId: number): number | null => {
    const moduleData = progress.moduleProgress[moduleId];
    const totalSteps = getModuleStepCount(moduleId);
    
    return StepStateManager.getNextIncompleteStep(moduleData || null, totalSteps);
  };

  const getCurrentPosition = (): { moduleId: number; stepId: number } => {
    // Get the actual current position based on progress
    const currentModuleId = progress.currentModule;
    const nextIncompleteStep = getNextIncompleteStep(currentModuleId);
    
    return {
      moduleId: currentModuleId,
      stepId: nextIncompleteStep || progress.currentStep
    };
  };

  const markVideoWatched = (moduleId: number, stepId: number, watched: boolean): void => {
    updateStepState(moduleId, stepId, { videoWatched: watched });
  };

  const markPdfDownloaded = (moduleId: number, stepId: number, downloaded: boolean): void => {
    updateStepState(moduleId, stepId, { pdfDownloaded: downloaded });
  };

  const value: ProgressContextType = {
    progress,
    completeStep,
    completeModule,
    updateCurrentPosition,
    isModuleUnlocked,
    isModuleCompleted,
    getModuleProgress,
    getOverallProgress,
    hasInProgress,
    getWeekLockInformation,
    
    // Enhanced functionality
    updateStepState,
    getStepState,
    isStepAttempted,
    saveQuizAnswer,
    clearQuizAnswer,
    getQuizAnswer,
    canNavigateToStep,
    getNextIncompleteStep,
    getCurrentPosition,
    markVideoWatched,
    markPdfDownloaded
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};