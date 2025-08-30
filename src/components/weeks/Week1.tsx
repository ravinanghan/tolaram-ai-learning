import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import WeekComponent from '../WeekComponent';

// Import step components
import Step1 from '../week1/Step1';
import Step2 from '../week1/Step2';
import Step3 from '../week1/Step3';
import Step4 from '../week1/Step4';

const Week1: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentPosition, getModuleProgress, completeModule, updateCurrentPosition } = useProgress();

  const handleBack = () => {
    console.log('Week1: handleBack called');
    // Persist the user's last position in Week 1 before leaving
    const position = getCurrentPosition();
    console.log('Week1: Current position before back:', position);
    if (position.moduleId === 1) {
      updateCurrentPosition(1, position.stepId);
      // If the week is effectively complete, ensure completion is recorded
      const progress = getModuleProgress(1);
      if (progress >= 100) {
        completeModule(1);
      }
    }
    console.log('Week1: Navigating to dashboard');
    navigate('/dashboard');
  };

  const handleComplete = (weekNumber: number, finalStep: number) => {
    console.log(`Week ${weekNumber} completed on step ${finalStep}`);
    // Module completion is handled by WeekComponent, just navigate
    navigate('/dashboard');
  };

  const handleStepChange = (weekNumber: number, stepNumber: number, direction: 'forward' | 'backward') => {
    console.log(`Step navigation: Week ${weekNumber}, Step ${stepNumber}, Direction: ${direction}`);
  };

  const handleError = (error: Error, context: string) => {
    console.error(`Week1 Error in ${context}:`, error);
  };

  return (
    <DashboardLayout>
      <WeekComponent
        weekNumber={1}
        title="The AI Lexicon"
        description="Establish a common vocabulary for discussing AI, Machine Learning, and Deep Learning."
        callbacks={{
          onBack: handleBack,
          onComplete: handleComplete,
          onStepChange: handleStepChange,
          onError: handleError
        }}
        navigationConfig={{
          allowBackNavigation: true,
          allowForwardNavigation: true,
          requireQuizCompletion: true,
          autoAdvanceOnComplete: false
        }}
        enableDebugMode={false}
      >
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
      </WeekComponent>
    </DashboardLayout>
  );
};

export default Week1;
