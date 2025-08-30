import { useEffect, useState, useCallback } from 'react';
import type { Theme, ThemeContextType } from '@/types/global';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/types';

/**
 * Custom hook for managing theme with localStorage persistence
 * @returns ThemeContextType object with theme state and controls
 */
export const useTheme = (): ThemeContextType => {
  const [theme, setThemeState] = useState<Theme>('light');

  // Get system preference
  const getSystemPreference = (): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme): void => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#1a1a1a' : '#ffffff');
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = storage.get<Theme>(STORAGE_KEYS.THEME);
    const initialTheme = savedTheme || getSystemPreference();
    
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, [applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent): void => {
      const savedTheme = storage.get<Theme>(STORAGE_KEYS.THEME);
      if (!savedTheme) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setThemeState(systemTheme);
        applyTheme(systemTheme);
      }
    };

    // Use addEventListener if available (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [applyTheme]);

  const toggleTheme = useCallback((): void => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme): void => {
    setThemeState(newTheme);
    storage.set(STORAGE_KEYS.THEME, newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  return {
    theme,
    toggleTheme,
    setTheme
  };
};