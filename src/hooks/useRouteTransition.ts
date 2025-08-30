import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface RouteTransitionState {
  isTransitioning: boolean;
  previousPath: string | null;
  error: string | null;
}

interface UseRouteTransitionOptions {
  onRouteChange?: (newPath: string, previousPath: string | null) => void;
  onError?: (error: Error) => void;
  transitionDelay?: number;
}

export const useRouteTransition = (options: UseRouteTransitionOptions = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    onRouteChange,
    onError,
    transitionDelay = 150
  } = options;

  const [state, setState] = useState<RouteTransitionState>({
    isTransitioning: false,
    previousPath: null,
    error: null
  });

  const previousPathRef = useRef<string | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle route changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const previousPath = previousPathRef.current;

    // Start transition
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      error: null
    }));

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Call route change handler
    if (onRouteChange && previousPath !== currentPath) {
      try {
        onRouteChange(currentPath, previousPath);
      } catch (error) {
        console.error('Route change handler error:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    }

    // End transition after delay
    transitionTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        previousPath: previousPathRef.current
      }));
    }, transitionDelay);

    // Update previous path ref
    previousPathRef.current = currentPath;

    // Cleanup
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [location.pathname, location.search, onRouteChange, onError, transitionDelay]);

  // Safe navigation with error handling
  const navigateWithErrorHandling = (path: string, options?: { replace?: boolean }) => {
    try {
      navigate(path, options);
    } catch (error) {
      console.error('Navigation error:', error);
      setState(prev => ({
        ...prev,
        error: 'Navigation failed. Please try again.'
      }));
      if (onError) {
        onError(error as Error);
      }
    }
  };

  // Clear error
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Generate route key for React reconciliation
  const routeKey = `${location.pathname}${location.search}${location.hash}`;

  return {
    ...state,
    navigate: navigateWithErrorHandling,
    clearError,
    routeKey,
    currentPath: location.pathname,
    fullPath: location.pathname + location.search
  };
};