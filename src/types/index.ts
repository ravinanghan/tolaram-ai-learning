// Re-export all types from global.ts for better import organization
export type * from './global';

// Import specific types for use in this file
import type { User, Progress, Theme } from './global';

// Additional specialized types for specific features

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// State Management Types
export interface AppState {
  auth: AuthState;
  progress: ProgressState;
  theme: ThemeState;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProgressState {
  progress: Progress;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeState {
  theme: Theme;
  systemPreference: Theme;
}

// Event Handler Types
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
export type KeyboardHandler = (event: React.KeyboardEvent<HTMLElement>) => void;

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  active?: boolean;
  badge?: string | number;
}

// Timeline Types
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  type: 'milestone' | 'lesson' | 'assessment';
}

export interface TimelineData {
  events: TimelineEvent[];
  currentEventId: string;
}

// Media Query Types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type MediaQueryResult = boolean;

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  PROGRESS: 'progress',
  THEME: 'theme',
  PREFERENCES: 'preferences',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  WEEK: '/week/:weekId',
  AI_TIMELINE: '/ai-timeline',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];