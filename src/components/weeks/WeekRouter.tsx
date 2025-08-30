import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { isWeekTimeLocked } from '../../utils/weekLocking';
import Loading from '../Loading';
import WeekLockedComponent from './WeekLockedComponent';

// Types
interface WeekComponentModule {
  default: React.FC;
}

type WeekComponentLoader = () => Promise<WeekComponentModule>;

// Lazy load week components with error handling
const Week1 = lazy(() => 
  import('./Week1').catch((error) => {
    console.error('Failed to load Week1 component:', error);
    throw error;
  })
);

// Add more weeks as they are created:
// const Week2 = lazy(() => 
//   import('./Week2').catch((error) => {
//     console.error('Failed to load Week2 component:', error);
//     throw error;
//   })
// );

// Map of available week components
const WeekComponents: Record<number, React.LazyExoticComponent<React.FC>> = {
  1: Week1,
  // Add more weeks here as they are implemented:
  // 2: Week2,
  // 3: Week3,
};

// Error Boundary Component for Week Loading
class WeekLoadError extends React.Component<
  { children: React.ReactNode; weekNumber: number },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; weekNumber: number }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Week ${this.props.weekNumber} loading error:`, error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Week {this.props.weekNumber}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There was an error loading this week's content. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const WeekRouter: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const { isModuleUnlocked } = useProgress();
  
  // Memoize week number parsing with validation
  const weekNumber = useMemo(() => {
    const parsed = parseInt(weekId || '1', 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [weekId]);

  // Memoize component lookup
  const WeekComponent = useMemo(() => WeekComponents[weekNumber], [weekNumber]);
  
  // Memoize lock status checks
  const isTimeLocked = useMemo(() => isWeekTimeLocked(weekNumber), [weekNumber]);
  const isUnlocked = useMemo(() => isModuleUnlocked(weekNumber), [weekNumber, isModuleUnlocked]);

  // If week doesn't exist, redirect to dashboard
  if (!WeekComponent) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if week is time-locked
  if (isTimeLocked) {
    return <WeekLockedComponent weekId={weekNumber} />;
  }

  // Check if week is unlocked based on completion
  if (!isUnlocked) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <WeekLoadError weekNumber={weekNumber}>
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <Loading fullScreen text={`Loading Week ${weekNumber}...`} />
          </div>
        }
      >
        <WeekComponent />
      </Suspense>
    </WeekLoadError>
  );
};

export default WeekRouter;