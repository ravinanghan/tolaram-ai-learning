import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Button from './Button';

// Types for better type safety and reusability
interface NavigationButton {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger' | 'success';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

interface StepIndicatorProps {
  current: number;
  total: number;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  completedColor?: string;
  currentColor?: string;
  pendingColor?: string;
}

interface WeekFooterProps {
  // Step information
  currentStep: number;
  totalSteps: number;
  
  // Navigation buttons
  previousButton?: NavigationButton;
  nextButton?: NavigationButton;
  
  // Step indicator customization
  stepIndicator?: StepIndicatorProps;
  showStepIndicator?: boolean;
  
  // Layout and styling
  className?: string;
  containerClassName?: string;
  fixed?: boolean;
  
  // Animation preferences
  disableAnimations?: boolean;
  animationDelay?: number;
  
  // Custom content
  customContent?: React.ReactNode;
  centerContent?: React.ReactNode;
}

// Default animation variants
const animationVariants = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  button: {
    initial: { opacity: 0, x: 0 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay: 0.1 }
  },
  stepIndicator: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.2 }
  }
};

// Step Indicator Component
const StepIndicator: React.FC<StepIndicatorProps & { disableAnimations?: boolean }> = ({
  current,
  total,
  showNumbers = false,
  size = 'md',
  completedColor = 'bg-primary-500',
  currentColor = 'bg-primary-300',
  pendingColor = 'bg-gray-300 dark:bg-gray-600',
  disableAnimations = false
}) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const getStepColor = (index: number) => {
    if (index < current) return completedColor;
    if (index === current - 1) return currentColor;
    return pendingColor;
  };

  return (
    <div className="flex items-center gap-2">
      {showNumbers && (
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
          Step {current} of {total}
        </span>
      )}
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, index) => (
          <motion.div
            key={index}
            initial={disableAnimations ? false : { scale: 0 }}
            animate={disableAnimations ? false : { scale: 1 }}
            transition={disableAnimations ? {} : {
              duration: 0.3,
              delay: 0.3 + (index * 0.05),
              ease: [0.4, 0, 0.6, 1]
            }}
            className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${
              getStepColor(index)
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Navigation Button Component
const NavigationButton: React.FC<NavigationButton & { 
  direction: 'previous' | 'next';
  isLastStep?: boolean;
  disableAnimations?: boolean;
}> = ({
  label,
  disabled = false,
  loading = false,
  onClick,
  variant,
  icon,
  iconPosition,
  direction,
  isLastStep = false,
  disableAnimations = false
}) => {
  // Default icons and variants based on direction and step
  const defaultIcon = direction === 'previous' 
    ? <ChevronLeft className="w-4 h-4" />
    : isLastStep 
      ? <Check className="w-4 h-4" />
      : <ChevronRight className="w-4 h-4" />;

  const defaultVariant = isLastStep ? 'success' : (variant || 'primary');
  const defaultLabel = isLastStep ? 'Complete' : label;
  const defaultIconPosition = direction === 'previous' ? 'left' : 'right';

  const animationDirection = direction === 'previous' ? -20 : 20;

  return (
    <motion.div
      initial={disableAnimations ? false : { 
        opacity: 0, 
        x: animationDirection 
      }}
      animate={disableAnimations ? false : { 
        opacity: 1, 
        x: 0 
      }}
      transition={disableAnimations ? {} : animationVariants.button.transition}
    >
      <Button
        variant={direction === 'previous' ? 'outline' : defaultVariant}
        onClick={onClick || (() => {})}
        disabled={disabled}
        loading={loading}
        icon={icon || defaultIcon}
        iconPosition={iconPosition || defaultIconPosition}
        className="flex items-center gap-2 min-w-[120px]"
      >
        {defaultLabel}
      </Button>
    </motion.div>
  );
};

// Main WeekFooter Component
const WeekFooter: React.FC<WeekFooterProps> = ({
  currentStep,
  totalSteps,
  previousButton,
  nextButton,
  stepIndicator,
  showStepIndicator = true,
  className = '',
  containerClassName = '',
  fixed = false,
  disableAnimations = false,
  animationDelay = 0,
  customContent,
  centerContent
}) => {
  // Default button configurations
  const defaultPreviousButton: NavigationButton = {
    label: 'Previous',
    disabled: currentStep <= 1,
    onClick: () => console.warn('Previous button clicked but no handler provided'),
    ...previousButton
  };

  const defaultNextButton: NavigationButton = {
    label: 'Next',
    disabled: false,
    onClick: () => console.warn('Next button clicked but no handler provided'),
    ...nextButton
  };

  // Default step indicator configuration
  const defaultStepIndicator: StepIndicatorProps = {
    current: currentStep,
    total: totalSteps,
    showNumbers: true,
    ...stepIndicator
  };

  // Base classes
  const baseClasses = `bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 ${
    fixed ? 'fixed bottom-0 left-0 right-0 z-50 shadow-lg' : ''
  }`;

  const containerClasses = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${
    containerClassName
  }`;

  // Animation configuration - use proper types
  const containerAnimation = {
    initial: animationVariants.container.initial,
    animate: animationVariants.container.animate,
    transition: {
      ...animationVariants.container.transition,
      delay: animationDelay
    }
  };

  const stepIndicatorAnimation = {
    initial: animationVariants.stepIndicator.initial,
    animate: animationVariants.stepIndicator.animate,
    transition: {
      ...animationVariants.stepIndicator.transition,
      delay: animationDelay + 0.2
    }
  };

  return (
    <>
      {disableAnimations ? (
        <footer className={`${baseClasses} ${className}`}>
          <div className={containerClasses}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous Button */}
              <NavigationButton
                {...defaultPreviousButton}
                direction="previous"
                disableAnimations={disableAnimations}
              />

              {/* Center Content */}
              <div className="flex items-center gap-4">
                {centerContent ? (
                  centerContent
                ) : (
                  showStepIndicator && (
                    <StepIndicator
                      {...defaultStepIndicator}
                      disableAnimations={disableAnimations}
                    />
                  )
                )}
              </div>

              {/* Next Button */}
              <NavigationButton
                {...defaultNextButton}
                direction="next"
                isLastStep={currentStep === totalSteps}
                disableAnimations={disableAnimations}
              />
            </div>

            {/* Custom Content */}
            {customContent && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {customContent}
              </div>
            )}
          </div>
        </footer>
      ) : (
        <motion.footer
          initial={containerAnimation.initial}
          animate={containerAnimation.animate}
          transition={containerAnimation.transition}
          className={`${baseClasses} ${className}`}
        >
          <div className={containerClasses}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous Button */}
              <NavigationButton
                {...defaultPreviousButton}
                direction="previous"
                disableAnimations={disableAnimations}
              />

              {/* Center Content */}
              <motion.div
                initial={stepIndicatorAnimation.initial}
                animate={stepIndicatorAnimation.animate}
                transition={stepIndicatorAnimation.transition}
                className="flex items-center gap-4"
              >
                {centerContent ? (
                  centerContent
                ) : (
                  showStepIndicator && (
                    <StepIndicator
                      {...defaultStepIndicator}
                      disableAnimations={disableAnimations}
                    />
                  )
                )}
              </motion.div>

              {/* Next Button */}
              <NavigationButton
                {...defaultNextButton}
                direction="next"
                isLastStep={currentStep === totalSteps}
                disableAnimations={disableAnimations}
              />
            </div>

            {/* Custom Content */}
            {customContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: animationDelay + 0.4
                }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                {customContent}
              </motion.div>
            )}
          </div>
        </motion.footer>
      )}
    </>
  );
};

export default WeekFooter;

// Export types for external use
export type {
  WeekFooterProps,
  NavigationButton,
  StepIndicatorProps
};