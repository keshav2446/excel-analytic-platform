import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DynamicAxisSelector = ({ 
  excelData, 
  chartType, 
  dataMappings, 
  onMappingChange,
  availableColumns,
  darkMode
}) => {
  const [axisOptions, setAxisOptions] = useState([]);
  const [requiredAxes, setRequiredAxes] = useState([]);
  const [optionalAxes, setOptionalAxes] = useState([]);
  
  // Determine required and optional axes based on chart type
  useEffect(() => {
    if (!chartType) return;
    
    const is3D = chartType.startsWith('3d-');
    let required = [];
    let optional = [];
    
    // Define required and optional axes based on chart type
    switch (chartType) {
      case 'bar':
      case 'line':
      case 'area':
        required = ['x', 'y'];
        optional = ['group'];
        break;
      case 'pie':
      case 'doughnut':
        required = ['labels', 'values'];
        optional = [];
        break;
      case 'scatter':
        required = ['x', 'y'];
        optional = ['size', 'color'];
        break;
      case 'radar':
        required = ['labels', 'datasets'];
        optional = ['group'];
        break;
      case '3d-bar':
        required = ['x', 'y', 'z'];
        optional = ['color'];
        break;
      case '3d-scatter':
        required = ['x', 'y', 'z'];
        optional = ['size', 'color'];
        break;
      case '3d-surface':
        required = ['x', 'y', 'z'];
        optional = ['color'];
        break;
      default:
        required = ['x', 'y'];
        optional = [];
    }
    
    setRequiredAxes(required);
    setOptionalAxes(optional);
    
  }, [chartType]);
  
  // Generate axis options from Excel data columns
  useEffect(() => {
    if (!excelData || !excelData.columns) return;
    
    // Get column names and types
    const columns = excelData.columns.map(col => ({
      name: col,
      type: getColumnType(excelData.data, col)
    }));
    
    setAxisOptions(columns);
  }, [excelData]);
  
  // Determine column data type
  const getColumnType = (data, columnName) => {
    if (!data || data.length === 0) return 'string';
    
    const sample = data.slice(0, 10).map(row => row[columnName]).filter(val => val !== undefined && val !== null);
    
    if (sample.length === 0) return 'string';
    
    // Check if all values are numbers
    const allNumbers = sample.every(val => !isNaN(Number(val)));
    if (allNumbers) return 'number';
    
    // Check if all values are dates
    const allDates = sample.every(val => !isNaN(Date.parse(val)));
    if (allDates) return 'date';
    
    // Default to string
    return 'string';
  };
  
  // Handle mapping change
  const handleAxisChange = (axis, columnName) => {
    const newMappings = { ...dataMappings, [axis]: columnName };
    onMappingChange(newMappings);
  };
  
  // Get appropriate columns for axis type
  const getAppropriateColumns = (axisName) => {
    // For most chart types, specific axes require specific data types
    switch (axisName) {
      case 'x':
        // X axis can be any type
        return availableColumns || axisOptions;
      case 'y':
      case 'z':
      case 'values':
      case 'size':
        // These axes typically need numeric data
        return (availableColumns || axisOptions).filter(col => col.type === 'number');
      case 'color':
        // Color can be any type
        return availableColumns || axisOptions;
      case 'labels':
      case 'group':
        // Labels and grouping are typically categorical
        return availableColumns || axisOptions;
      default:
        return availableColumns || axisOptions;
    }
  };
  
  // Get axis display name
  const getAxisDisplayName = (axis) => {
    switch (axis) {
      case 'x': return 'X Axis';
      case 'y': return 'Y Axis';
      case 'z': return 'Z Axis';
      case 'labels': return 'Labels';
      case 'values': return 'Values';
      case 'datasets': return 'Datasets';
      case 'group': return 'Group By';
      case 'size': return 'Point Size';
      case 'color': return 'Color';
      default: return axis.charAt(0).toUpperCase() + axis.slice(1);
    }
  };
  
  // Get axis description
  const getAxisDescription = (axis) => {
    switch (axis) {
      case 'x': return 'Horizontal axis data';
      case 'y': return 'Vertical axis data';
      case 'z': return 'Depth axis data (3D)';
      case 'labels': return 'Category labels for the chart';
      case 'values': return 'Numeric values to display';
      case 'datasets': return 'Multiple data series to compare';
      case 'group': return 'Group data points by this column';
      case 'size': return 'Determines the size of data points';
      case 'color': return 'Determines the color of data points';
      default: return '';
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Data Axis Mapping
      </h3>
      
      {/* Required Axes */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Required Axes
        </h4>
        
        {requiredAxes.map(axis => (
          <div key={axis} className="space-y-2">
            <label 
              htmlFor={`axis-${axis}`} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {getAxisDisplayName(axis)}
              <span className="ml-1 text-red-500">*</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {getAxisDescription(axis)}
              </span>
            </label>
            
            <select
              id={`axis-${axis}`}
              value={dataMappings[axis] || ''}
              onChange={(e) => handleAxisChange(axis, e.target.value)}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
              required
            >
              <option value="">Select a column</option>
              {getAppropriateColumns(axis).map(col => (
                <option key={col.name} value={col.name}>
                  {col.name} ({col.type})
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      {/* Optional Axes */}
      {optionalAxes.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
            Optional Axes
          </h4>
          
          {optionalAxes.map(axis => (
            <div key={axis} className="space-y-2">
              <label 
                htmlFor={`axis-${axis}`} 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {getAxisDisplayName(axis)}
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {getAxisDescription(axis)}
                </span>
              </label>
              
              <select
                id={`axis-${axis}`}
                value={dataMappings[axis] || ''}
                onChange={(e) => handleAxisChange(axis, e.target.value)}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md ${
                  darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                }`}
              >
                <option value="">None (Optional)</option>
                {getAppropriateColumns(axis).map(col => (
                  <option key={col.name} value={col.name}>
                    {col.name} ({col.type})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
      
      {/* Validation Messages */}
      {requiredAxes.some(axis => !dataMappings[axis]) && (
        <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
          Please select columns for all required axes to proceed.
        </p>
      )}
    </div>
  );
};

DynamicAxisSelector.propTypes = {
  excelData: PropTypes.object.isRequired,
  chartType: PropTypes.string.isRequired,
  dataMappings: PropTypes.object.isRequired,
  onMappingChange: PropTypes.func.isRequired,
  availableColumns: PropTypes.array,
  darkMode: PropTypes.bool
};

DynamicAxisSelector.defaultProps = {
  availableColumns: null,
  darkMode: false
};

export default DynamicAxisSelector;
