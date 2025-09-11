import React, { useState, useEffect } from 'react';

const ChartConfigForm = ({ 
  chartType, 
  chartOptions, 
  basicInfo, 
  onChartOptionsChange, 
  onBasicInfoChange,
  aiInsights,
  onAiInsightsToggle
}) => {
  // Local state to manage form values
  const [localOptions, setLocalOptions] = useState(chartOptions);
  const [localBasicInfo, setLocalBasicInfo] = useState(basicInfo);
  
  // Update local state when props change
  useEffect(() => {
    setLocalOptions(chartOptions);
    setLocalBasicInfo(basicInfo);
  }, [chartOptions, basicInfo]);

  // Handle chart options change
  const handleOptionsChange = (field, value) => {
    const updatedOptions = { ...localOptions, [field]: value };
    setLocalOptions(updatedOptions);
    onChartOptionsChange(updatedOptions);
  };

  // Handle basic info change
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setLocalBasicInfo(prev => {
      const updated = { ...prev, [name]: value };
      onBasicInfoChange(e);
      return updated;
    });
  };

  // Handle color change
  const handleColorChange = (index, color) => {
    const updatedColors = [...localOptions.colors];
    updatedColors[index] = color;
    handleOptionsChange('colors', updatedColors);
  };

  // Add new color
  const handleAddColor = () => {
    if (localOptions.colors.length < 10) {
      const defaultColors = [
        '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#EC4899', '#14B8A6', '#6366F1', '#F97316', '#84CC16'
      ];
      const unusedColors = defaultColors.filter(color => !localOptions.colors.includes(color));
      const newColor = unusedColors.length > 0 ? unusedColors[0] : '#000000';
      handleOptionsChange('colors', [...localOptions.colors, newColor]);
    }
  };

  // Remove color
  const handleRemoveColor = (index) => {
    if (localOptions.colors.length > 1) {
      const updatedColors = localOptions.colors.filter((_, i) => i !== index);
      handleOptionsChange('colors', updatedColors);
    }
  };

  // Get chart type specific options
  const getChartTypeOptions = () => {
    const baseOptions = (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chart Title Display
          </label>
          <input
            type="text"
            name="title"
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            value={localOptions.title}
            onChange={(e) => handleOptionsChange('title', e.target.value)}
            placeholder="Chart title (leave empty to use analysis title)"
          />
        </div>

        <div className="flex items-center">
          <input
            id="showLegend"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={localOptions.showLegend}
            onChange={(e) => handleOptionsChange('showLegend', e.target.checked)}
          />
          <label htmlFor="showLegend" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Show Legend
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="animation"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={localOptions.animation}
            onChange={(e) => handleOptionsChange('animation', e.target.checked)}
          />
          <label htmlFor="animation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Enable Animation
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="responsive"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={localOptions.responsive}
            onChange={(e) => handleOptionsChange('responsive', e.target.checked)}
          />
          <label htmlFor="responsive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Responsive
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="maintainAspectRatio"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={localOptions.maintainAspectRatio}
            onChange={(e) => handleOptionsChange('maintainAspectRatio', e.target.checked)}
          />
          <label htmlFor="maintainAspectRatio" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Maintain Aspect Ratio
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="darkMode"
            type="checkbox"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={localOptions.darkMode}
            onChange={(e) => handleOptionsChange('darkMode', e.target.checked)}
          />
          <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Dark Mode
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={localOptions.backgroundColor}
              onChange={(e) => handleOptionsChange('backgroundColor', e.target.value)}
              className="h-8 w-8 border-0 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={localOptions.backgroundColor}
              onChange={(e) => handleOptionsChange('backgroundColor', e.target.value)}
              className="ml-2 block w-32 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    );

    // Add chart-specific options
    if (chartType.startsWith('3d-')) {
      return (
        <>
          {baseOptions}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              3D Specific Options
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="enableRotation"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  checked={localOptions.enableRotation || false}
                  onChange={(e) => handleOptionsChange('enableRotation', e.target.checked)}
                />
                <label htmlFor="enableRotation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Rotation
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="enableZoom"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  checked={localOptions.enableZoom || false}
                  onChange={(e) => handleOptionsChange('enableZoom', e.target.checked)}
                />
                <label htmlFor="enableZoom" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Zoom
                </label>
              </div>
            </div>
          </div>
        </>
      );
    }

    return baseOptions;
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Configure Your Analysis
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Customize your analysis details and chart appearance.
      </p>

      <div className="space-y-8">
        {/* Basic Info Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Analysis Details
          </h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                value={localBasicInfo.title}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                value={localBasicInfo.description}
                onChange={handleBasicInfoChange}
                placeholder="Describe the purpose of this analysis"
              />
            </div>
            <div className="flex items-center">
              <input
                id="aiInsights"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={aiInsights}
                onChange={onAiInsightsToggle}
              />
              <label htmlFor="aiInsights" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Generate AI Insights
              </label>
            </div>
            {aiInsights && (
              <div className="ml-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Our AI will analyze your data and provide insights about trends, patterns, and anomalies.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chart Options Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Chart Appearance
          </h4>
          {getChartTypeOptions()}
        </div>

        {/* Color Palette Section */}
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
            Color Palette
          </h4>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {localOptions.colors.map((color, index) => (
                <div key={index} className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="h-10 w-10 border-0 rounded-md cursor-pointer"
                  />
                  {localOptions.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {localOptions.colors.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="h-10 w-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  +
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click on a color to change it. You can add up to 10 colors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartConfigForm;
