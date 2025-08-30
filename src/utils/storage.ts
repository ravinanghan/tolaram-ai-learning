import type { StorageAPI } from '@/types/global';

/**
 * Type-safe localStorage wrapper with error handling and data migration
 */
export const storage: StorageAPI = {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage with type safety
   */
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage data
   */
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Get multiple items from localStorage
 */
export const getMultiple = <T extends Record<string, any>>(
  keys: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {};
  
  for (const key of keys) {
    const value = storage.get<T[keyof T]>(key as string);
    if (value !== null) {
      result[key] = value as T[keyof T];
    }
  }
  
  return result;
};

/**
 * Set multiple items in localStorage
 */
export const setMultiple = <T extends Record<string, any>>(
  data: T
): void => {
  for (const [key, value] of Object.entries(data)) {
    storage.set(key, value);
  }
};

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = (): {
  used: number;
  total: number;
  available: number;
  percentage: number;
  keys: string[];
} => {
  try {
    let used = 0;
    const keys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }
    
    // Rough estimate of localStorage limit (usually 5-10MB)
    const total = 5 * 1024 * 1024; // 5MB
    const available = total - used;
    const percentage = (used / total) * 100;
    
    return {
      used,
      total,
      available,
      percentage,
      keys
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      used: 0,
      total: 0,
      available: 0,
      percentage: 0,
      keys: []
    };
  }
};

/**
 * Clean up old or corrupted data
 */
export const cleanupStorage = (keysToKeep: string[] = []): number => {
  try {
    const info = getStorageInfo();
    let cleaned = 0;
    
    for (const key of info.keys) {
      // Skip keys we want to keep
      if (keysToKeep.includes(key)) continue;
      
      try {
        const value = storage.get(key);
        // If value is corrupted or invalid, remove it
        if (value === null && localStorage.getItem(key) !== null) {
          storage.remove(key);
          cleaned++;
        }
      } catch (error) {
        // Remove corrupted keys
        storage.remove(key);
        cleaned++;
      }
    }
    
    return cleaned;
  } catch (error) {
    console.error('Error cleaning up storage:', error);
    return 0;
  }
};

/**
 * Export all data for backup
 */
export const exportData = (): Record<string, any> => {
  try {
    const data: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = storage.get(key);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return {};
  }
};

/**
 * Import data from backup (with safety checks)
 */
export const importData = (data: Record<string, any>, overwrite: boolean = false): boolean => {
  try {
    for (const [key, value] of Object.entries(data)) {
      // Skip if key exists and overwrite is false
      if (!overwrite && localStorage.getItem(key) !== null) {
        continue;
      }
      
      storage.set(key, value);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Migrate data between schema versions
 */
export const migrateData = (migrations: Array<{
  version: string;
  migrate: (data: any) => any;
}>): void => {
  try {
    const currentVersion = storage.get<string>('__data_version__') || '0.0.0';
    
    for (const migration of migrations) {
      if (migration.version > currentVersion) {
        console.log(`Migrating data to version ${migration.version}`);
        
        // Get all data
        const allData = exportData();
        
        // Apply migration
        const migratedData = migration.migrate(allData);
        
        // Clear and reimport
        storage.clear();
        importData(migratedData, true);
        
        // Update version
        storage.set('__data_version__', migration.version);
      }
    }
  } catch (error) {
    console.error('Error migrating data:', error);
  }
};

/**
 * Storage event listener for cross-tab synchronization
 */
export const onStorageChange = (callback: (key: string, newValue: any, oldValue: any) => void): (() => void) => {
  const handler = (event: StorageEvent) => {
    if (event.storageArea === localStorage) {
      const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
      const newValue = event.newValue ? JSON.parse(event.newValue) : null;
      
      if (event.key) {
        callback(event.key, newValue, oldValue);
      }
    }
  };
  
  window.addEventListener('storage', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handler);
  };
};