import React from 'react';

const ChartTypeSelector = ({ selectedType, onSelectType }) => {
  // Chart type definitions with icons and descriptions
  const chartTypes = [
    {
      id: '2d-bar',
      name: 'Bar Chart',
      description: 'Compare values across categories with rectangular bars',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="12" width="3" height="8" />
          <rect x="8" y="8" width="3" height="12" />
          <rect x="13" y="5" width="3" height="15" />
          <rect x="18" y="10" width="3" height="10" />
        </svg>
      ),
      dimension: '2D',
    },
    {
      id: '2d-line',
      name: 'Line Chart',
      description: 'Show trends over a continuous interval or time period',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,17 8,10 13,14 18,7 21,10" />
        </svg>
      ),
      dimension: '2D',
    },
    {
      id: '2d-pie',
      name: 'Pie Chart',
      description: 'Show proportions and percentages between categories',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2 L12,12 L22,12 C22,6.5 17.5,2 12,2" />
          <path d="M12,12 L12,22 C17.5,22 22,17.5 22,12 L12,12" opacity="0.7" />
          <path d="M12,22 L12,12 L2,12 C2,17.5 6.5,22 12,22" opacity="0.4" />
          <path d="M12,2 C6.5,2 2,6.5 2,12 L12,12 L12,2" opacity="0.2" />
        </svg>
      ),
      dimension: '2D',
    },
    {
      id: '2d-scatter',
      name: 'Scatter Plot',
      description: 'Show relationship between two variables as points',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="16" cy="9" r="1.5" />
          <circle cx="18" cy="15" r="1.5" />
          <circle cx="7" cy="16" r="1.5" />
        </svg>
      ),
      dimension: '2D',
    },
    {
      id: '2d-area',
      name: 'Area Chart',
      description: 'Show cumulated totals using numbers or percentages over time',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,17 L8,10 L13,14 L18,7 L21,10 L21,17 L3,17" opacity="0.5" />
          <polyline points="3,17 8,10 13,14 18,7 21,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      dimension: '2D',
    },
    {
      id: '2d-radar',
      name: 'Radar Chart',
      description: 'Display multivariate data in a two-dimensional chart',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" strokeDasharray="2" opacity="0.3" />
          <circle cx="12" cy="12" r="5" strokeDasharray="2" opacity="0.6" />
          <line x1="12" y1="4" x2="12" y2="20" opacity="0.3" />
          <line x1="4" y1="12" x2="20" y2="12" opacity="0.3" />
          <line x1="6" y1="6" x2="18" y2="18" opacity="0.3" />
          <line x1="18" y1="6" x2="6" y2="18" opacity="0.3" />
          <polygon points="12,7 15,12 12,17 9,12" fill="currentColor" opacity="0.7" />
        </svg>
      ),
      dimension: '2D',
    },
    {
      id: '3d-bar',
      name: '3D Bar Chart',
      description: 'Compare values across categories with 3D rectangular bars',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4,14 L4,18 L7,20 L7,16 Z" />
          <path d="M9,10 L9,18 L12,20 L12,12 Z" />
          <path d="M14,6 L14,18 L17,20 L17,8 Z" />
          <path d="M4,14 L7,16 L7,16 L4,14" opacity="0.7" />
          <path d="M9,10 L12,12 L12,12 L9,10" opacity="0.7" />
          <path d="M14,6 L17,8 L17,8 L14,6" opacity="0.7" />
        </svg>
      ),
      dimension: '3D',
    },
    {
      id: '3d-scatter',
      name: '3D Scatter Plot',
      description: 'Show relationship between three variables as points in 3D space',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,3 L3,17 L21,17" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="16" cy="6" r="1.5" />
          <circle cx="7" cy="14" r="1.5" />
          <circle cx="15" cy="10" r="1.5" />
        </svg>
      ),
      dimension: '3D',
    },
    {
      id: '3d-surface',
      name: '3D Surface Plot',
      description: 'Visualize a function of two variables in a 3D space',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3,3 L3,17 L21,17" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4,16 C8,12 12,16 16,12 C18,10 20,12 20,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4,13 C8,9 12,13 16,9 C18,7 20,9 20,9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4,10 C8,6 12,10 16,6 C18,4 20,6 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      dimension: '3D',
    },
  ];

  // Group chart types by dimension
  const chartTypesByDimension = chartTypes.reduce((acc, chart) => {
    if (!acc[chart.dimension]) {
      acc[chart.dimension] = [];
    }
    acc[chart.dimension].push(chart);
    return acc;
  }, {});

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Select Chart Type
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Choose the type of chart that best represents your data. Different chart types are suitable for different kinds of data and analysis goals.
      </p>

      {/* 2D Charts */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
          2D Charts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartTypesByDimension['2D']?.map((chart) => (
            <div
              key={chart.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedType === chart.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
              onClick={() => onSelectType(chart.id)}
            >
              <div className="flex items-center mb-2">
                <div className={`text-${selectedType === chart.id ? 'purple' : 'gray'}-500 dark:text-${selectedType === chart.id ? 'purple' : 'gray'}-400`}>
                  {chart.icon}
                </div>
                <h5 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                  {chart.name}
                </h5>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {chart.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Charts */}
      <div>
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
          3D Charts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartTypesByDimension['3D']?.map((chart) => (
            <div
              key={chart.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedType === chart.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
              onClick={() => onSelectType(chart.id)}
            >
              <div className="flex items-center mb-2">
                <div className={`text-${selectedType === chart.id ? 'purple' : 'gray'}-500 dark:text-${selectedType === chart.id ? 'purple' : 'gray'}-400`}>
                  {chart.icon}
                </div>
                <h5 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
                  {chart.name}
                </h5>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {chart.description}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  3D Visualization
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartTypeSelector;
