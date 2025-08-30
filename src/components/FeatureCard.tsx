import React from 'react';
import Card from '@/components/Card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  iconTextColor?: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  iconBgColor = "bg-primary-100 dark:bg-primary-900",
  iconTextColor = "text-primary-600 dark:text-primary-400",
  className = ""
}) => {
  return (
    <Card className={`text-center p-6 ${className}`}>
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
        <span className={`${iconTextColor} font-bold text-xl`}>
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </Card>
  );
};

export default FeatureCard;