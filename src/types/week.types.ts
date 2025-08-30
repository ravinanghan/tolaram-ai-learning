import { WeekFooterProps } from '@/components/WeekFooter';
import { StepState } from './global';

export interface StepComponentProps {
  onQuizStateChange?: () => void;
  onStepComplete?: () => void;
  onStepAttempt?: () => void;
  [key: string]: any;
}

export interface WeekNavigationConfig {
  allowBackNavigation?: boolean;
  allowForwardNavigation?: boolean;
  requireQuizCompletion?: boolean;
  autoAdvanceOnComplete?: boolean;
}

export interface WeekComponentCallbacks {
  onBack?: () => void;
  onComplete?: (weekNumber: number, finalStep: number) => void;
  onStepChange?: (weekNumber: number, stepNumber: number, direction: 'forward' | 'backward') => void;
  onError?: (error: Error, context: string) => void;
}

export interface WeekComponentProps {
  weekNumber: number;
  title: string;
  description: string;
  children: React.ReactNode[];
  navigationConfig?: WeekNavigationConfig;
  callbacks?: WeekComponentCallbacks;
  footerConfig?: Partial<WeekFooterProps>;
  enableDebugMode?: boolean;
  initialStep?: number;
  validateStepTransition?: (fromStep: number, toStep: number, stepState: StepState | null) => boolean;
  className?: string;
  contentClassName?: string;
}

export interface WeekStepState {
  currentStep: number;
  isTransitioning: boolean;
  error: Error | null;
  isCompleted: boolean;
}

export interface WeekNavigationActions {
  goToStep: (step: number, direction?: 'forward' | 'backward') => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  completeCurrentStep: () => Promise<void>;
}
