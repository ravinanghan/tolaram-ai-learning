import { useState, useEffect, useCallback } from 'react';
import type { Breakpoint, MediaQueryResult } from '@/types';

/**
 * Custom hook for media query matching
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export const useMediaQuery = (query: string): MediaQueryResult => {
  const [matches, setMatches] = useState<boolean>(false);

  const updateMatches = useCallback((mediaQuery: MediaQueryList): void => {
    setMatches(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    updateMatches(mediaQuery);

    // Create event listener
    const listener = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    // Add listener (with fallback for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(listener);
      }
    };
  }, [query, updateMatches]);

  return matches;
};

// Breakpoint definitions
const breakpoints: Record<Breakpoint, string> = {
  xs: '(max-width: 475px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
};

// Predefined breakpoint hooks with TypeScript support
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)');
export const useIsTablet = (): boolean => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1024px)');
export const useIsLargeScreen = (): boolean => useMediaQuery('(min-width: 1280px)');

// Responsive breakpoint hooks
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  return useMediaQuery(breakpoints[breakpoint]);
};

// Hook to get current breakpoint
export const useCurrentBreakpoint = (): Breakpoint => {
  const isXs = useBreakpoint('xs');
  const isSm = useBreakpoint('sm');
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  const isXl = useBreakpoint('xl');

  if (isXs) return 'xs';
  if (isSm) return 'sm';
  if (isMd) return 'md';
  if (isLg) return 'lg';
  if (isXl) return 'xl';
  return '2xl';
};

// Hook for reduced motion preference
export const usePrefersReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

// Hook for dark mode preference
export const usePrefersDarkMode = (): boolean => {
  return useMediaQuery('(prefers-color-scheme: dark)');
};