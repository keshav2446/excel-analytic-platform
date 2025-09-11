import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DynamicAxisSelector from './DynamicAxisSelector';

const DataMappingForm = ({ chartType, dataMapping, columns, excelData, onDataMappingChange, darkMode }) => {
  // Local state to manage form values
  const [localMapping, setLocalMapping] = useState(dataMapping);
  
  // Update local state when props change
  useEffect(() => {
    setLocalMapping(dataMapping);
  }, [dataMapping]);

  // Handle input change
  const handleInputChange = (field, value) => {
    const updatedMapping = { ...localMapping, [field]: value };
    setLocalMapping(updatedMapping);
    onDataMappingChange(updatedMapping);
  };

  // Handle multi-select change for y-axis
  const handleMultiSelectChange = (field, value) => {
    let updatedValues;
    
    if (localMapping[field].includes(value)) {
      // Remove value if already selected
      updatedValues = localMapping[field].filter(item => item !== value);
    } else {
      // Add value if not already selected
      updatedValues = [...localMapping[field], value];
    }
    
    const updatedMapping = { ...localMapping, [field]: updatedValues };
    setLocalMapping(updatedMapping);
    onDataMappingChange(updatedMapping);
  };

  // Get mapping fields based on chart type
  const getMappingFields = () => {
    // Base mapping fields for different chart types
    const mappingFields = {
      '2d-bar': [
        { id: 'xAxis', label: 'X-Axis (Categories)', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis (Values)', type: 'multi-select', required: true },
      ],
      '2d-line': [
        { id: 'xAxis', label: 'X-Axis (Time/Sequence)', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis (Values)', type: 'multi-select', required: true },
      ],
      '2d-pie': [
        { id: 'label', label: 'Labels (Categories)', type: 'select', required: true },
        { id: 'value', label: 'Values', type: 'select', required: true },
      ],
      '2d-scatter': [
        { id: 'xAxis', label: 'X-Axis', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis', type: 'select', required: true },
        { id: 'category', label: 'Category (Optional)', type: 'select', required: false },
      ],
      '2d-area': [
        { id: 'xAxis', label: 'X-Axis (Time/Sequence)', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis (Values)', type: 'multi-select', required: true },
      ],
      '2d-radar': [
        { id: 'label', label: 'Labels (Categories)', type: 'select', required: true },
        { id: 'yAxis', label: 'Values (Multiple Series)', type: 'multi-select', required: true },
      ],
      '3d-bar': [
        { id: 'xAxis', label: 'X-Axis (Categories)', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis (Values)', type: 'select', required: true },
        { id: 'zAxis', label: 'Z-Axis (Depth)', type: 'select', required: true },
      ],
      '3d-scatter': [
        { id: 'xAxis', label: 'X-Axis', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis', type: 'select', required: true },
        { id: 'zAxis', label: 'Z-Axis', type: 'select', required: true },
        { id: 'category', label: 'Category (Optional)', type: 'select', required: false },
      ],
      '3d-surface': [
        { id: 'xAxis', label: 'X-Axis', type: 'select', required: true },
        { id: 'yAxis', label: 'Y-Axis', type: 'select', required: true },
        { id: 'zAxis', label: 'Z-Axis (Height)', type: 'select', required: true },
      ],
    };

    return mappingFields[chartType] || [];
  };

  // Get chart type description
  const getChartTypeDescription = () => {
    const descriptions = {
      '2d-bar': 'Bar charts are used to compare values across categories. Select a categorical column for the X-axis and one or more numerical columns for the Y-axis.',
      '2d-line': 'Line charts show trends over time or a continuous interval. Select a time/sequence column for the X-axis and one or more numerical columns for the Y-axis.',
      '2d-pie': 'Pie charts show proportions of a whole. Select a categorical column for labels and a numerical column for values.',
      '2d-scatter': 'Scatter plots show relationships between two variables. Select numerical columns for both X and Y axes, and optionally a categorical column to group points.',
      '2d-area': 'Area charts show cumulated totals over time. Select a time/sequence column for the X-axis and one or more numerical columns for the Y-axis.',
      '2d-radar': 'Radar charts display multivariate data. Select a categorical column for labels and multiple numerical columns for values.',
      '3d-bar': 'Three-dimensional bar charts compare values across two categorical dimensions. Select categorical columns for X and Z axes, and a numerical column for the Y-axis.',
      '3d-scatter': 'Three-dimensional scatter plots show relationships between three variables. Select numerical columns for X, Y, and Z axes.',
      '3d-surface': 'Surface plots visualize a function of two variables. Select numerical columns for all three axes.',
    };

    return descriptions[chartType] || 'Select the appropriate data columns for your chart.';
  };

  // Get column suggestions based on field type
  const getColumnSuggestions = (fieldId) => {
    // This is a simplified suggestion logic
    // In a real application, you might analyze the data to determine column types
    if (['yAxis', 'value', 'zAxis'].includes(fieldId)) {
      // Suggest numerical columns for value axes
      return columns;
    } else if (['xAxis', 'label', 'category'].includes(fieldId)) {
      // Suggest all columns for categorical axes
      return columns;
    }
    return columns;
  };

  const mappingFields = getMappingFields();

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Map Your Data
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {getChartTypeDescription()}
      </p>

      {/* Dynamic Axis Selector - New Component */}
      {excelData && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <DynamicAxisSelector
            excelData={excelData}
            chartType={chartType}
            dataMappings={localMapping}
            onMappingChange={onDataMappingChange}
            availableColumns={columns?.map(col => ({ name: col, type: 'auto' }))} 
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Legacy Mapping Interface - For Backward Compatibility */}
      <div className="space-y-6 mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Advanced Mapping Options
        </h4>
        {mappingFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label 
              htmlFor={field.id} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'select' && (
              <select
                id={field.id}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                value={localMapping[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
              >
                <option value="">Select a column</option>
                {getColumnSuggestions(field.id).map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            )}
            
            {field.type === 'multi-select' && (
              <div className="mt-1 space-y-2">
                {getColumnSuggestions(field.id).map((column) => (
                  <div key={column} className="flex items-center">
                    <input
                      id={`${field.id}-${column}`}
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      checked={localMapping[field.id]?.includes(column) || false}
                      onChange={() => handleMultiSelectChange(field.id, column)}
                    />
                    <label
                      htmlFor={`${field.id}-${column}`}
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      {column}
                    </label>
                  </div>
                ))}
                {field.required && localMapping[field.id]?.length === 0 && (
                  <p className="text-sm text-red-500">Please select at least one column</p>
                )}
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {field.id === 'xAxis' && 'This will be used for the horizontal axis of your chart.'}
              {field.id === 'yAxis' && 'This will be used for the vertical axis of your chart.'}
              {field.id === 'zAxis' && 'This will be used for the depth axis of your 3D chart.'}
              {field.id === 'label' && 'This will be used for the labels in your chart.'}
              {field.id === 'value' && 'This will be used for the values in your chart.'}
              {field.id === 'category' && 'This will be used to group data points by color or shape.'}
            </p>
          </div>
        ))}
      </div>

      {/* Data Preview */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
          Selected Mapping Preview
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {JSON.stringify(localMapping, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

DataMappingForm.propTypes = {
  chartType: PropTypes.string.isRequired,
  dataMapping: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  excelData: PropTypes.object,
  onDataMappingChange: PropTypes.func.isRequired,
  darkMode: PropTypes.bool
};

DataMappingForm.defaultProps = {
  excelData: null,
  darkMode: false
};

export default DataMappingForm;
