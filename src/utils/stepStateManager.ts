import type { StepState, ModuleProgressData, QuizAnswer } from '@/types/global';

/**
 * Utility functions for managing step state and progress
 */
export class StepStateManager {
  /**
   * Create a new step state with default values
   */
  static createStepState(stepId: number): StepState {
    return {
      id: stepId,
      completed: false,
      videoWatched: false,
      pdfDownloaded: false,
      lastAccessed: Date.now(),
      timeSpent: 0
    };
  }

  /**
   * Update step state with partial values
   */
  static updateStepState(currentState: StepState | null, updates: Partial<StepState>): StepState {
    const baseState = currentState || this.createStepState(updates.id || 0);
    return {
      ...baseState,
      ...updates,
      lastAccessed: Date.now()
    };
  }

  /**
   * Check if a step can be considered complete or attempted
   */
  static isStepComplete(stepState: StepState | null, requireQuiz: boolean = true): boolean {
    if (!stepState) return false;
    
    // Basic completion check
    if (stepState.completed) return true;
    
    // If requiring quiz, check if quiz is answered correctly
    if (requireQuiz && stepState.quizAnswer) {
      return stepState.quizAnswer.isCorrect;
    }
    
    // For non-quiz steps, check if content is consumed
    return stepState.videoWatched === true || stepState.pdfDownloaded === true;
  }

  /**
   * Check if a step has been attempted (quiz answered or content viewed)
   */
  static isStepAttempted(stepState: StepState | null): boolean {
    if (!stepState) return false;
    
    // Check if step is explicitly completed
    if (stepState.completed) return true;
    
    // Check if quiz has been attempted (regardless of correctness)
    if (stepState.quizAnswer) return true;
    
    // Check if any content has been consumed
    return stepState.videoWatched === true || stepState.pdfDownloaded === true;
  }

  /**
   * Calculate completion percentage for a module
   */
  static calculateModuleProgress(moduleData: ModuleProgressData | null, totalSteps: number): number {
    if (!moduleData || totalSteps === 0) return 0;
    
    const completedCount = Object.values(moduleData.stepStates || {})
      .filter(stepState => this.isStepComplete(stepState)).length;
    
    return Math.round((completedCount / totalSteps) * 100);
  }

  /**
   * Get the next incomplete step in a module
   */
  static getNextIncompleteStep(moduleData: ModuleProgressData | null, totalSteps: number): number | null {
    if (!moduleData) return 1; // Start with first step
    
    for (let i = 1; i <= totalSteps; i++) {
      const stepState = moduleData.stepStates?.[i] || null;
      if (!this.isStepComplete(stepState)) {
        return i;
      }
    }
    
    return null; // All steps complete
  }

  /**
   * Check if user can navigate to a specific step
   */
  static canNavigateToStep(moduleData: ModuleProgressData | null, targetStep: number): boolean {
    if (!moduleData || targetStep === 1) return true; // Always can access first step
    
    // Check if previous step has been attempted (not necessarily completed)
    const previousStep = targetStep - 1;
    const previousStepState = moduleData.stepStates?.[previousStep] || null;
    
    return this.isStepAttempted(previousStepState);
  }

  /**
   * Create a quiz answer object
   */
  static createQuizAnswer(selectedAnswer: number | null, isCorrect: boolean, attempts: number = 1): QuizAnswer {
    return {
      selectedAnswer,
      isCorrect,
      timestamp: Date.now(),
      attempts
    };
  }

  /**
   * Update module progress data with step completion
   */
  static updateModuleProgress(
    moduleData: ModuleProgressData | null, 
    stepId: number, 
    stepState: StepState
  ): ModuleProgressData {
    const baseData: ModuleProgressData = moduleData || {
      completedSteps: [],
      stepStates: {},
      currentStep: 1,
      startedAt: Date.now()
    };

    const updatedStepStates = {
      ...baseData.stepStates,
      [stepId]: stepState
    };

    // Update completed steps array
    const completedSteps = Object.entries(updatedStepStates)
      .filter(([_, state]) => this.isStepComplete(state))
      .map(([id, _]) => parseInt(id))
      .sort((a, b) => a - b);

    const isStepCompleted = this.isStepComplete(stepState);
    const updatedCompletedAt = isStepCompleted && completedSteps.length > 0 ? Date.now() : baseData.completedAt;

    return {
      ...baseData,
      stepStates: updatedStepStates,
      completedSteps,
      currentStep: Math.max(baseData.currentStep, stepId),
      ...(updatedCompletedAt !== undefined && { completedAt: updatedCompletedAt })
    };
  }
}

export default StepStateManager;