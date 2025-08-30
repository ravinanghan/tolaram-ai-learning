import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Progress, StepState, QuizAnswer, ModuleProgressData } from '@/types/global';

export interface FirebaseProgress extends Omit<Progress, 'lastActiveSession'> {
  lastActiveSession: Timestamp | number;
}

export interface FirebaseStepState extends Omit<StepState, 'lastAccessed'> {
  lastAccessed: Timestamp | number;
}

export interface FirebaseQuizAnswer extends Omit<QuizAnswer, 'timestamp'> {
  timestamp: Timestamp | number;
}

/**
 * Get user progress from Firestore
 */
export const getUserProgress = async (userId: string): Promise<Progress | null> => {
  try {
    const progressDoc = await getDoc(doc(db, 'users', userId, 'progress', 'current'));
    
    if (!progressDoc.exists()) {
      return null;
    }

    const data = progressDoc.data() as FirebaseProgress;
    
    // Convert Firestore timestamps to numbers
    return {
      ...data,
      lastActiveSession: data.lastActiveSession instanceof Timestamp 
        ? data.lastActiveSession.toMillis() 
        : data.lastActiveSession || Date.now()
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw new Error('Failed to load progress data');
  }
};

/**
 * Save user progress to Firestore
 */
export const saveUserProgress = async (userId: string, progress: Progress): Promise<void> => {
  try {
    const progressData: FirebaseProgress = {
      ...progress,
      lastActiveSession: serverTimestamp()
    };

    await setDoc(doc(db, 'users', userId, 'progress', 'current'), progressData, { merge: true });
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw new Error('Failed to save progress data');
  }
};

/**
 * Update specific step state
 */
export const updateStepState = async (
  userId: string, 
  moduleId: number, 
  stepId: number, 
  stepState: Partial<StepState>
): Promise<void> => {
  try {
    const stepData: Partial<FirebaseStepState> = {
      ...stepState,
      lastAccessed: serverTimestamp()
    };

    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    
    // Update the specific step state
    await updateDoc(progressRef, {
      [`moduleProgress.${moduleId}.stepStates.${stepId}`]: stepData,
      lastActiveSession: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating step state:', error);
    throw new Error('Failed to update step progress');
  }
};

/**
 * Save quiz answer
 */
export const saveQuizAnswer = async (
  userId: string,
  moduleId: number,
  stepId: number,
  answer: QuizAnswer
): Promise<void> => {
  try {
    const quizData: FirebaseQuizAnswer = {
      ...answer,
      timestamp: serverTimestamp()
    };

    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    
    await updateDoc(progressRef, {
      [`moduleProgress.${moduleId}.stepStates.${stepId}.quizAnswer`]: quizData,
      [`moduleProgress.${moduleId}.stepStates.${stepId}.completed`]: answer.isCorrect,
      lastActiveSession: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving quiz answer:', error);
    throw new Error('Failed to save quiz answer');
  }
};

/**
 * Complete a module
 */
export const completeModule = async (userId: string, moduleId: number): Promise<void> => {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      const currentProgress = progressDoc.data() as FirebaseProgress;
      const completedModules = currentProgress.completedModules || [];
      
      if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
        
        await updateDoc(progressRef, {
          completedModules,
          [`moduleProgress.${moduleId}.completedAt`]: serverTimestamp(),
          lastActiveSession: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('Error completing module:', error);
    throw new Error('Failed to complete module');
  }
};

/**
 * Initialize user progress (for new users)
 */
export const initializeUserProgress = async (userId: string): Promise<void> => {
  try {
    const initialProgress: FirebaseProgress = {
      completedModules: [],
      currentModule: 1,
      currentStep: 1,
      moduleProgress: {},
      lastActiveSession: serverTimestamp()
    };

    await setDoc(doc(db, 'users', userId, 'progress', 'current'), initialProgress);
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw new Error('Failed to initialize progress');
  }
};

/**
 * Listen to real-time progress updates
 */
export const subscribeToProgress = (
  userId: string,
  callback: (progress: Progress | null) => void
): (() => void) => {
  const progressRef = doc(db, 'users', userId, 'progress', 'current');
  
  return onSnapshot(
    progressRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as FirebaseProgress;
        const progress: Progress = {
          ...data,
          lastActiveSession: data.lastActiveSession instanceof Timestamp 
            ? data.lastActiveSession.toMillis() 
            : data.lastActiveSession || Date.now()
        };
        callback(progress);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error listening to progress updates:', error);
      callback(null);
    }
  );
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to load user profile');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: Partial<any>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
};

/**
 * Batch update progress (for offline sync)
 */
export const batchUpdateProgress = async (
  userId: string,
  updates: Array<{
    moduleId: number;
    stepId: number;
    stepState: Partial<StepState>;
  }>
): Promise<void> => {
  try {
    const progressRef = doc(db, 'users', userId, 'progress', 'current');
    const updateData: any = {
      lastActiveSession: serverTimestamp()
    };

    updates.forEach(({ moduleId, stepId, stepState }) => {
      Object.entries(stepState).forEach(([key, value]) => {
        updateData[`moduleProgress.${moduleId}.stepStates.${stepId}.${key}`] = value;
      });
    });

    await updateDoc(progressRef, updateData);
  } catch (error) {
    console.error('Error batch updating progress:', error);
    throw new Error('Failed to sync progress');
  }
};