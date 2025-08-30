import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WeekNavigationContextType {
  currentStep: number;
  maxSteps: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  isTransitioning: boolean;
}

const WeekNavigationContext = createContext<WeekNavigationContextType | undefined>(undefined);

export const WeekNavigationProvider: React.FC<{ children: ReactNode; maxSteps: number }> = ({ 
  children, 
  maxSteps 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToStep = (step: number) => {
    if (step < 1 || step > maxSteps || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentStep(step);
    
    // Reset transitioning after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNextStep = () => goToStep(currentStep + 1);
  const goToPrevStep = () => goToStep(currentStep - 1);

  return (
    <WeekNavigationContext.Provider
      value={{
        currentStep,
        maxSteps,
        goToNextStep,
        goToPrevStep,
        goToStep,
        isTransitioning,
      }}
    >
      {children}
    </WeekNavigationContext.Provider>
  );
};

export const useWeekNavigation = () => {
  const context = useContext(WeekNavigationContext);
  if (!context) {
    throw new Error('useWeekNavigation must be used within a WeekNavigationProvider');
  }
  return context;
};
