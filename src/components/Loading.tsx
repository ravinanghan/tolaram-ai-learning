import React from 'react';
import { motion } from 'framer-motion';
import type { LoadingProps } from '@/types/global';

// Extended interface for loading component specific props
interface ExtendedLoadingProps extends LoadingProps {
  variant?: 'spinner' | 'pulse' | 'dots' | 'skeleton' | 'bars';
  className?: string;
}

const Loading: React.FC<ExtendedLoadingProps> = ({ 
  variant = 'spinner', 
  size = 'md', 
  className = '',
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  } as const;

  // Loading component renderers
  const renderSpinner = (): JSX.Element => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`border-2 border-gray-300 dark:border-gray-600 border-t-primary-600 dark:border-t-primary-400 rounded-full ${sizes[size]}`}
      role="status"
      aria-label="Loading"
    />
  );

  const renderPulse = (): JSX.Element => (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1]
      }}
      className={`bg-primary-600 dark:bg-primary-400 rounded-full ${sizes[size]}`}
      role="status"
      aria-label="Loading"
    />
  );

  const renderDots = (): JSX.Element => (
    <motion.div
      animate={{}}
      transition={{
        staggerChildren: 0.2
      }}
      className="flex space-x-1"
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: i * 0.2
          }}
          className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
        />
      ))}
    </motion.div>
  );

  const renderBars = (): JSX.Element => (
    <motion.div
      animate={{}}
      transition={{
        staggerChildren: 0.1
      }}
      className="flex space-x-1 items-end"
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [1, 2, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: i * 0.1
          }}
          className="w-1 h-4 bg-primary-600 dark:bg-primary-400 rounded-full"
          style={{ originY: 1 }}
        />
      ))}
    </motion.div>
  );

  const renderSkeleton = (): JSX.Element => (
    <div className="space-y-3 w-full max-w-sm" role="status" aria-label="Loading content">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
    </div>
  );

  const renderLoader = (): JSX.Element => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {renderLoader()}
      {text && variant !== 'skeleton' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 dark:text-gray-400 text-center"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};

export default Loading;