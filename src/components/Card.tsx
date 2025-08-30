import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATIONS } from '@/constants/design';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'p-6',
  variant = 'default',
  elevation = 'md',
  interactive = true,
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200';
  
  const variants = {
    default: '',
    primary: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700',
    secondary: 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-700',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
  };

  const elevations = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl'
  };

  const hoverClasses = hover && interactive ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';
  const classes = `${baseClasses} ${variants[variant]} ${elevations[elevation]} ${padding} ${hoverClasses} ${className}`;
  
  return (
    <motion.div
      {...ANIMATIONS.cardAnimation}
      whileHover={hover && interactive ? ANIMATIONS.cardAnimation.whileHover : {}}
      className={classes}
    >
      {children}
    </motion.div>
  );
};

export default Card;
