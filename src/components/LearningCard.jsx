// components/LearningCard.jsx
import React from 'react';

const LearningCard = ({
  title,
  color,
  description,
  simulationTitle,
  simulationDesc,
  children
}) => {
  return (
    <div className="p-6 rounded-lg border bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 flex flex-col">
      <h3 className={`text-2xl font-bold mb-2 ${color}`}>{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">{description}</p>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
        <p className="font-semibold text-gray-800 dark:text-gray-200">{simulationTitle}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{simulationDesc}</p>
        <div className="h-40 relative mb-4 bg-gray-200 dark:bg-gray-700 rounded-md">
          {children}
        </div>
        {/* Optional: Add button or interaction */}
      </div>
    </div>
  );
};

export default LearningCard;
