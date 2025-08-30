import type { Variants, Transition } from 'framer-motion';

// Animation Types
export interface AnimationConfig {
  initial?: Record<string, any>;
  animate?: Record<string, any>;
  exit?: Record<string, any>;
  whileHover?: Record<string, any>;
  whileTap?: Record<string, any>;
  transition?: Transition;
}

export interface StaggerAnimationConfig {
  animate: {
    transition: {
      staggerChildren: number;
    };
  };
}

// Design System Constants
export const ANIMATIONS = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  
  // Card animations
  cardAnimation: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -4 },
    transition: { duration: 0.3 }
  },
  
  // Stagger animations for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  } satisfies StaggerAnimationConfig,
  
  staggerItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },
  
  // Button animations
  buttonHover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  
  buttonTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  
  // Progress animations
  progressAnimation: {
    initial: { width: 0 },
    animate: { width: "100%" },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const SPACING = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem'
} as const;

export const COLORS = {
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  }
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
} as const;

export const BORDER_RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem'
} as const;

// Type exports for consumption
export type BreakpointKey = keyof typeof BREAKPOINTS;
export type SpacingKey = keyof typeof SPACING;
export type ColorPalette = keyof typeof COLORS;
export type ShadowLevel = keyof typeof SHADOWS;
export type BorderRadiusSize = keyof typeof BORDER_RADIUS;