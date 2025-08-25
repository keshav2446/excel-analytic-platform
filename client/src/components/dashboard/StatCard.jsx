import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  // Define color variants
  const colorVariants = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-800',
      text: 'text-blue-500 dark:text-blue-100',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-800',
      text: 'text-green-500 dark:text-green-100',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-800',
      text: 'text-purple-500 dark:text-purple-100',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-800',
      text: 'text-orange-500 dark:text-orange-100',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-800',
      text: 'text-red-500 dark:text-red-100',
    },
  };

  const colorClasses = colorVariants[color] || colorVariants.blue;

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <div className={`p-3 mr-4 rounded-full ${colorClasses.bg}`}>
        <span className={colorClasses.text}>{icon}</span>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
