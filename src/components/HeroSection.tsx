import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title?: string;
  highlightText?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Transform Your",
  highlightText = "Learning Journey",
  description = "Discover the future of AI with our comprehensive 6-week program. Interactive lessons, personalized progress tracking, and cutting-edge content.",
  buttonText = "Start Learning Today",
  onButtonClick,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`text-center mb-8 ${className}`}
    >
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
        {title}{' '}
        <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          {highlightText}
        </span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
        {description}
      </p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={onButtonClick || (() => {})}
          size="lg"
          variant="gradient"
          className="group"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;