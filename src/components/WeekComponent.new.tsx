import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import WeekHeader from './WeekHeader';
import WeekFooter from './WeekFooter';
import ErrorBoundary from './ErrorBoundary';
import useWeekNavigation from '../hooks/useWeekNavigation';
import type { WeekComponentProps, StepComponentProps } from '../types/week.types';

const DEFAULT_NAVIGATION_CONFIG = {
  allowBackNavigation: true,
  allowForwardNavigation: true,
  requireQuizCompletion: true,
  autoAdvanceOnComplete: false
} as const;

const WeekComponentContent: React.FC<WeekComponentProps> = ({
  weekNumber,
  title,
  description,
  children,
  navigationConfig = DEFAULT_NAVIGATION_CONFIG,
  callbacks,
  footerConfig,
  className = '',
  contentClassName = ''
}) => {
  const steps = React.Children.toArray(children);
  
  const {
    currentStep,
    isTransitioning,
    error,
    actions: { goToNextStep, goToPreviousStep, completeCurrentStep },
    stepCount
  } = useWeekNavigation(weekNumber, navigationConfig, callbacks);

  const currentContent = useMemo(() => {
    if (!steps.length) return null;
    const step = steps[Math.min(currentStep - 1, steps.length - 1)];
    return React.isValidElement<StepComponentProps>(step) 
      ? React.cloneElement(step, { onStepComplete: completeCurrentStep })
      : step;
  }, [currentStep, steps, completeCurrentStep]);

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className={`week-component ${className}`}>
      <WeekHeader 
        title={title}
        description={description}
        weekNumber={weekNumber}
        progress={Math.round((currentStep / stepCount) * 100)}
        onBack={callbacks?.onBack}
      />
      
      <motion.div
        key={`week-${weekNumber}-step-${currentStep}`}
        className={`week-content ${contentClassName}`}
        initial={{ opacity: 0, x: isTransitioning ? 50 : 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        {currentContent}
      </motion.div>
      
      <WeekFooter
        currentStep={currentStep}
        totalSteps={stepCount}
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
        onComplete={completeCurrentStep}
        {...footerConfig}
      />
    </div>
  );
};

const WeekComponent: React.FC<WeekComponentProps> = (props) => {
  return (
    <ErrorBoundary>
      <WeekComponentContent {...props} />
    </ErrorBoundary>
  );
};

export default WeekComponent;
