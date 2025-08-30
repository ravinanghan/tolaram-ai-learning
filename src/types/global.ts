import type { WeekLockInfo } from '@/utils/weekLocking';

// Core Data Types
export interface User {
  id: string;
  name: string;
  email: string;
  loginTime: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Quiz {
  question: string;
  type: 'multiple' | 'boolean';
  options?: string[];
  correct: number | boolean;
}

export interface Step {
  id: number;
  title: string;
  content: string;
  quiz: Quiz;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  keyLearning: string[];
  totalSteps: number;
  steps: Step[];
}

export interface ModulesData {
  modules: Module[];
}

// Enhanced Progress Types
export interface QuizAnswer {
  selectedAnswer: number | null;
  isCorrect: boolean;
  timestamp: number;
  attempts: number;
}

export interface StepState {
  id: number;
  completed: boolean;
  videoWatched?: boolean;
  pdfDownloaded?: boolean;
  quizAnswer?: QuizAnswer;
  lastAccessed?: number;
  timeSpent?: number;
}

export interface ModuleProgressData {
  completedSteps: number[];
  stepStates: Record<number, StepState>;
  currentStep: number;
  startedAt?: number;
  completedAt?: number;
  totalTimeSpent?: number;
}

export interface Progress {
  completedModules: number[];
  currentModule: number;
  currentStep: number;
  moduleProgress: Record<number, ModuleProgressData>;
  lastActiveSession?: number;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProgressContextType {
  progress: Progress;
  completeStep: (moduleId: number, stepId: number) => void;
  completeModule: (moduleId: number) => void;
  updateCurrentPosition: (moduleId: number, stepId: number) => void;
  isModuleUnlocked: (moduleId: number) => boolean;
  isModuleCompleted: (moduleId: number) => boolean;
  getModuleProgress: (moduleId: number) => number;
  getOverallProgress: () => number;
  hasInProgress: () => boolean;
  getWeekLockInformation: (moduleId: number) => WeekLockInfo;
  
  // Enhanced functionality
  updateStepState: (moduleId: number, stepId: number, state: Partial<StepState>) => void;
  getStepState: (moduleId: number, stepId: number) => StepState | null;
  isStepAttempted: (moduleId: number, stepId: number) => boolean;
  saveQuizAnswer: (moduleId: number, stepId: number, answer: QuizAnswer) => void;
  clearQuizAnswer: (moduleId: number, stepId: number) => void;
  getQuizAnswer: (moduleId: number, stepId: number) => QuizAnswer | null;
  canNavigateToStep: (moduleId: number, stepId: number) => boolean;
  getNextIncompleteStep: (moduleId: number) => number | null;
  getCurrentPosition: () => { moduleId: number; stepId: number };
  markVideoWatched: (moduleId: number, stepId: number, watched: boolean) => void;
  markPdfDownloaded: (moduleId: number, stepId: number, downloaded: boolean) => void;
}

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
  hover?: boolean;
  interactive?: boolean;
}

export interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Storage Types
export interface StorageAPI {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

// Route Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Animation Types
export interface AnimationVariants {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit?: Record<string, any>;
}

// Error Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error: Error}>;
}

// Utility Types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};