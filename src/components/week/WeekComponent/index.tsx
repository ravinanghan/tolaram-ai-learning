import React from 'react';
import { motion } from 'framer-motion';
import { WeekComponentProps } from './types';
import { WeekComponentErrorBoundary } from './components/ErrorBoundary';
import { WeekNavigationProvider, useWeekNavigation } from '../../../contexts/WeekNavigationContext';
import { DEFAULT_NAVIGATION_CONFIG } from './constants';
import WeekHeader from './WeekHeader';
import WeekFooter from './WeekFooter';

const WeekComponent: React.FC<WeekComponentProps> = ({
    weekNumber,
    title,
    description,
    children,
    navigationConfig = DEFAULT_NAVIGATION_CONFIG,
    callbacks,
    footerConfig,
    enableDebugMode = false,
    initialStep,
    validateStepTransition,
    className = '',
    contentClassName = ''
}) => {
    const mergedNavigationConfig = { ...DEFAULT_NAVIGATION_CONFIG, ...navigationConfig };
    const maxSteps = React.Children.count(children);

    // Wrap the component with the provider
    return (
        <WeekNavigationProvider maxSteps={maxSteps}>
            <WeekComponentContent 
                weekNumber={weekNumber}
                title={title}
                description={description}
                children={children}
                navigationConfig={mergedNavigationConfig}
                callbacks={callbacks}
                footerConfig={footerConfig}
                className={className}
                contentClassName={contentClassName}
                maxSteps={maxSteps}
            />
        </WeekNavigationProvider>
    );
};

// Internal component that uses the context
const WeekComponentContent: React.FC<WeekComponentProps & { maxSteps: number }> = ({
    weekNumber,
    title,
    description,
    children,
    navigationConfig,
    callbacks,
    footerConfig,
    className = '',
    contentClassName = '',
    maxSteps
}) => {
    const { currentStep, isTransitioning, goToNextStep, goToPrevStep } = useWeekNavigation();
    
    const handleBack = React.useCallback(() => {
        if (currentStep > 1) {
            goToPrevStep();
        } else {
            callbacks?.onBack?.();
        }
    }, [currentStep, goToPrevStep, callbacks]);
    
    const handleNext = React.useCallback(() => {
        if (currentStep < maxSteps) {
            goToNextStep();
            callbacks?.onStepChange?.(weekNumber, currentStep + 1, 'forward');
        } else {
            callbacks?.onComplete?.(weekNumber, currentStep);
        }
    }, [currentStep, maxSteps, goToNextStep, callbacks, weekNumber]);

    // Current step component
    const currentStepComponent = React.useMemo(() => {
        const component = React.Children.toArray(children)[currentStep - 1];

        if (React.isValidElement(component)) {
            const enhancedProps: any = {
                onStepComplete: () => {
                    callbacks?.onStepChange?.(weekNumber, currentStep, 'forward');
                    if (currentStep < maxSteps) {
                        handleNext();
                    }
                },
                ...component.props
            };

            return React.cloneElement(component, enhancedProps);
        }

        return component;
    }, [children, currentStep, callbacks, weekNumber, maxSteps, handleNext]);

    return (
        <WeekComponentErrorBoundary onError={(error) => {
            console.error('Error in WeekComponent:', error);
            callbacks?.onError?.(error, 'WeekComponent render');
        }}>
            <div className={`week-component ${className}`}>
                <WeekHeader
                    title={title}
                    description={description}
                    currentStep={currentStep}
                    totalSteps={maxSteps}
                    progress={1}
                    weekNumber={weekNumber}
                    onBack={handleBack}
                />

                <div className={`week-content ${contentClassName}`.trim()}>
                    <motion.div
                        key={`step-${currentStep}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.6, 1],
                            delay: isTransitioning ? 0.1 : 0
                        }}
                        className="step-content"
                    >
                        {currentStepComponent}
                    </motion.div>
                </div>

                <WeekFooter
                    currentStep={currentStep}
                    totalSteps={maxSteps}
                    onBack={handleBack}
                    onNext={handleNext}
                    nextButtonState={{
                        disabled: false,
                        variant: 'primary' as const,
                        label: currentStep < maxSteps ? 'Next' : 'Finish'
                    }}
                    navigationConfig={navigationConfig}
                    {...footerConfig}
                />
            </div>
        </WeekComponentErrorBoundary>
    );
};

export default WeekComponent;
