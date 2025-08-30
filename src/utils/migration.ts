import { storage } from './storage';
import { STORAGE_KEYS } from '@/types';
import type { Progress, User } from '@/types/global';

/**
 * Migration utility to move data from localStorage to Firebase
 */
export class DataMigration {
  /**
   * Check if user has local data that needs migration
   */
  static hasLocalData(): boolean {
    const localUser = storage.get<User>(STORAGE_KEYS.USER);
    const localProgress = storage.get<Progress>(STORAGE_KEYS.PROGRESS);
    
    return !!(localUser || localProgress);
  }

  /**
   * Get local data for migration
   */
  static getLocalData(): {
    user: User | null;
    progress: Progress | null;
    theme: string | null;
  } {
    return {
      user: storage.get<User>(STORAGE_KEYS.USER),
      progress: storage.get<Progress>(STORAGE_KEYS.PROGRESS),
      theme: storage.get<string>(STORAGE_KEYS.THEME)
    };
  }

  /**
   * Clear local data after successful migration
   */
  static clearLocalData(): void {
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.PROGRESS);
    // Keep theme preference
  }

  /**
   * Create migration prompt for users
   */
  static shouldPromptMigration(): boolean {
    const migrationCompleted = storage.get<boolean>('migration_completed');
    return this.hasLocalData() && !migrationCompleted;
  }

  /**
   * Mark migration as completed
   */
  static markMigrationCompleted(): void {
    storage.set('migration_completed', true);
  }

  /**
   * Convert local progress to Firebase format
   */
  static convertProgressToFirebase(localProgress: Progress): Progress {
    // Ensure all required fields are present
    return {
      completedModules: localProgress.completedModules || [],
      currentModule: localProgress.currentModule || 1,
      currentStep: localProgress.currentStep || 1,
      moduleProgress: localProgress.moduleProgress || {},
      lastActiveSession: localProgress.lastActiveSession || Date.now()
    };
  }
}