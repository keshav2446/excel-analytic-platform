import { useEffect, useRef, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  PieController, 
  ArcElement, 
  RadarController, 
  RadialLinearScale, 
  Filler, 
  Tooltip, 
  Legend,
  Title,
  SubTitle,
  ScatterController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { v4 as uuidv4 } from 'uuid';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title,
  SubTitle,
  ScatterController
);

const ChartRenderer2D = forwardRef(({ chartType, chartData, chartConfig, excelData, dataMappings, id }, ref) => {
  const chartRef = ref || useRef(null);
  const chartId = id || `chart-${uuidv4()}`;
  const [chartInstance, setChartInstance] = useState(null);
  const [error, setError] = useState(null);

  // Process data for the chart based on chart type and mappings
  const processChartData = () => {
    try {
      if (!excelData || !excelData.data || !dataMappings) {
        throw new Error('Missing data or mappings');
      }

      const { data, columns } = excelData;
      
      // Handle dynamic axis mappings
      // First, check for standard mappings from DynamicAxisSelector
      const xAxisKey = dataMappings.x || dataMappings.xAxis;
      const yAxisKeys = dataMappings.y || dataMappings.yAxis;
      const zAxisKey = dataMappings.z || dataMappings.zAxis;
      const labelsKey = dataMappings.labels || dataMappings.label;
      const valuesKey = dataMappings.values || dataMappings.value;
      const groupKey = dataMappings.group || dataMappings.category;
      const colorKey = dataMappings.color;
      const sizeKey = dataMappings.size;
      const datasetsKeys = dataMappings.datasets;
      
      // Get column indices for the mapped fields
      const getColumnIndex = (columnName) => {
        return columns.findIndex(col => col === columnName);
      };

      // Generate colors if not provided
      const generateColors = (count) => {
        const defaultColors = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(199, 199, 199, 0.7)',
          'rgba(83, 102, 255, 0.7)',
          'rgba(40, 159, 64, 0.7)',
          'rgba(210, 199, 199, 0.7)',
        ];
        
        // Use provided colors or default to generated ones
        const colors = chartConfig?.colors || [];
        
        if (colors.length >= count) {
          return colors.slice(0, count);
        }
        
        // If we need more colors than provided, use defaults and repeat if necessary
        const result = [...colors];
        
        while (result.length < count) {
          const colorIndex = result.length % defaultColors.length;
          result.push(defaultColors[colorIndex]);
        }
        
        return result;
      };
      
      // Helper function to get a color from palette
      const getColorPalette = (index) => {
        const defaultColors = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ];
        return chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || 
               defaultColors[index % defaultColors.length];
      };

      // Process data based on chart type
      switch (chartType) {
        case '2d-bar':
        case 'bar':
        case '2d-line':
        case 'line':
        case '2d-area':
        case 'area': {
          // Use x and y axes from dynamic mappings
          const xKey = xAxisKey;
          const yKeys = Array.isArray(yAxisKeys) ? yAxisKeys : 
                       (yAxisKeys ? [yAxisKeys] : 
                       (Array.isArray(dataMappings.yAxis) ? dataMappings.yAxis : 
                       (dataMappings.yAxis ? [dataMappings.yAxis] : [])));
          
          if (!xKey || yKeys.length === 0) return null;
          
          const labels = data.map(row => row[xKey]);
          const datasets = yKeys.map((key, index) => {
            const baseConfig = {
              label: key,
              data: data.map(row => parseFloat(row[key]) || 0),
              backgroundColor: chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index),
              borderColor: chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index),
              fill: chartType === '2d-area' || chartType === 'area',
            };
            
            // If we have group/color mapping, use it to create multiple datasets
            if (groupKey && data.length > 0) {
              const groups = [...new Set(data.map(row => row[groupKey]))];
              return groups.map((group, groupIndex) => ({
                ...baseConfig,
                label: `${key} (${group})`,
                data: data
                  .filter(row => row[groupKey] === group)
                  .map(row => parseFloat(row[key]) || 0),
                backgroundColor: chartConfig?.colors?.[groupIndex % (chartConfig?.colors?.length || 1)] || getColorPalette(groupIndex),
                borderColor: chartConfig?.colors?.[groupIndex % (chartConfig?.colors?.length || 1)] || getColorPalette(groupIndex),
              }));
            }
            
            return baseConfig;
          });
          
          // Flatten datasets if grouping was applied
          const flatDatasets = datasets.flat();
          
          return { labels, datasets: flatDatasets };
        }
        
        case '2d-pie':
        case 'pie':
        case '2d-doughnut':
        case 'doughnut': {
          const labelKey = labelsKey;
          const valueKey = valuesKey;
          
          if (!labelKey || !valueKey) return null;
          
          const labels = data.map(row => row[labelKey]);
          const values = data.map(row => parseFloat(row[valueKey]) || 0);
          const backgroundColor = labels.map((_, index) => 
            chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index)
          );
          
          return {
            labels,
            datasets: [{
              data: values,
              backgroundColor,
              borderColor: chartConfig?.darkMode ? '#374151' : '#fff',
              borderWidth: 2,
            }],
          };
        }
        
        case '2d-scatter':
        case 'scatter': {
          const xKey = xAxisKey;
          const yKey = yAxisKeys;
          const categoryKey = groupKey || colorKey;
          const pointSizeKey = sizeKey;
          
          if (!xKey || !yKey) return null;
          
          if (categoryKey) {
            // Group by category
            const categories = [...new Set(chartData.map(row => row[categoryKey]))];
            
            const datasets = categories.map((category, index) => {
              const filteredData = chartData.filter(row => row[categoryKey] === category);
              return {
                label: category,
                data: filteredData.map(row => {
                  const point = {
                    x: parseFloat(row[xKey]) || 0,
                    y: parseFloat(row[yKey]) || 0,
                  };
                  
                  // Add point size if available
                  if (pointSizeKey) {
                    point.r = parseFloat(row[pointSizeKey]) || 3;
                  }
                  
                  return point;
                }),
                backgroundColor: chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index),
                borderColor: chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index),
                borderWidth: 1,
                pointRadius: pointSizeKey ? undefined : 5
              };
            });
            
            return { datasets };
          } else {
            // No category grouping
            return {
              datasets: [{
                label: 'Data Points',
                data: chartData.map(row => {
                  const point = {
                    x: parseFloat(row[xKey]) || 0,
                    y: parseFloat(row[yKey]) || 0,
                  };
                  
                  // Add point size if available
                  if (pointSizeKey) {
                    point.r = parseFloat(row[pointSizeKey]) || 3;
                  }
                  
                  return point;
                }),
                backgroundColor: chartConfig?.colors?.[0] || getColorPalette(0),
                borderColor: chartConfig?.colors?.[0] || getColorPalette(0),
                borderWidth: 1,
                pointRadius: pointSizeKey ? undefined : 5
              }],
            };
          }
        }
        
        case '2d-radar':
        case 'radar': {
          const labelKey = labelsKey;
          const datasetKeys = datasetsKeys || 
                            (Array.isArray(dataMappings.datasets) ? dataMappings.datasets : 
                            (dataMappings.datasets ? [dataMappings.datasets] : []));
          
          if (!labelKey || datasetKeys.length === 0) return null;
          
          const labels = chartData.map(row => row[labelKey]);
          const datasets = datasetKeys.map((key, index) => ({
            label: key,
            data: chartData.map(row => parseFloat(row[key]) || 0),
            backgroundColor: `${chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index)}80`,
            borderColor: chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index),
            pointBackgroundColor: chartConfig?.colors?.[index % (chartConfig?.colors?.length || 1)] || getColorPalette(index),
          }));
          
          return { labels, datasets };
        }
        
        case '2d-area': {
          // Area chart is essentially a line chart with fill
          const xAxisColumn = dataMappings.xAxis;
          const yAxisColumns = Array.isArray(dataMappings.yAxis) ? dataMappings.yAxis : [dataMappings.yAxis];
          
          const xAxisIndex = getColumnIndex(xAxisColumn);
          const yAxisIndices = yAxisColumns.map(col => getColumnIndex(col));
          
          if (xAxisIndex === -1 || yAxisIndices.some(idx => idx === -1)) {
            throw new Error('Invalid column mappings');
          }
          
          const labels = chartData.map(row => row[xAxisIndex]);
          const datasets = yAxisColumns.map((col, i) => {
            const colIndex = yAxisIndices[i];
            return {
              label: col,
              data: chartData.map(row => parseFloat(row[colIndex]) || 0),
              backgroundColor: generateColors(yAxisColumns.length)[i].replace('0.7', '0.4'),
              borderColor: generateColors(yAxisColumns.length)[i].replace('0.7', '1'),
              borderWidth: 2,
              tension: 0.3,
              fill: true
            };
          });
          
          return {
            labels,
            datasets
          };
        }
        
        default:
          return null;
      }
    } catch (error) {
      console.error('Error processing chart data:', error);
      setError(`Error processing chart data: ${error.message}`);
      return null;
    }
  };

  // Get chart options based on chart type and config
  const getChartOptions = () => {
    const baseOptions = {
      responsive: chartConfig?.responsive !== false,
      maintainAspectRatio: chartConfig?.maintainAspectRatio !== false,
      plugins: {
        legend: {
          display: chartConfig?.showLegend !== false,
          position: chartConfig?.legendPosition || 'top',
        },
        title: {
          display: !!chartConfig?.title,
          text: chartConfig?.title || '',
          font: {
            size: 16
          }
        },
        subtitle: {
          display: !!chartConfig?.subtitle,
          text: chartConfig?.subtitle || '',
          font: {
            size: 14
          }
        },
        tooltip: {
          enabled: true
        }
      },
      animation: {
        duration: chartConfig?.animation === false ? 0 : 1000
      }
    };

    // Add chart-specific options
    switch (chartType) {
      case '2d-bar':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: !!chartConfig?.yAxisTitle,
                text: chartConfig?.yAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            },
            x: {
              title: {
                display: !!chartConfig?.xAxisTitle,
                text: chartConfig?.xAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            }
          },
          indexAxis: chartConfig?.horizontal ? 'y' : 'x'
        };
        
      case '2d-line':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: chartConfig?.beginAtZero !== false,
              title: {
                display: !!chartConfig?.yAxisTitle,
                text: chartConfig?.yAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            },
            x: {
              title: {
                display: !!chartConfig?.xAxisTitle,
                text: chartConfig?.xAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            }
          }
        };
        
      case '2d-pie':
        return {
          ...baseOptions,
          cutout: chartConfig?.doughnut ? '50%' : '0%'
        };
        
      case '2d-scatter':
        return {
          ...baseOptions,
          scales: {
            y: {
              title: {
                display: !!chartConfig?.yAxisTitle,
                text: chartConfig?.yAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            },
            x: {
              title: {
                display: !!chartConfig?.xAxisTitle,
                text: chartConfig?.xAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            }
          }
        };
        
      case '2d-radar':
        return {
          ...baseOptions,
          scales: {
            r: {
              beginAtZero: true,
              ticks: {
                backdropColor: 'transparent'
              }
            }
          }
        };
        
      case '2d-area':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: chartConfig?.beginAtZero !== false,
              title: {
                display: !!chartConfig?.yAxisTitle,
                text: chartConfig?.yAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            },
            x: {
              title: {
                display: !!chartConfig?.xAxisTitle,
                text: chartConfig?.xAxisTitle || ''
              },
              grid: {
                display: chartConfig?.showGrid !== false
              }
            }
          }
        };
        
      default:
        return baseOptions;
    }
  };

  // Get chart type for ChartJS
  const getChartJSType = () => {
    switch (chartType) {
      case '2d-bar':
        return 'bar';
      case '2d-line':
        return 'line';
      case '2d-pie':
        return chartConfig?.doughnut ? 'doughnut' : 'pie';
      case '2d-scatter':
        return 'scatter';
      case '2d-radar':
        return 'radar';
      case '2d-area':
        return 'line'; // Area chart is a line chart with fill=true
      default:
        return 'bar';
    }
  };

  // Apply dark mode if configured
  useEffect(() => {
    if (chartConfig?.darkMode) {
      document.getElementById(chartId)?.parentElement?.classList.add('dark-mode-chart');
    } else {
      document.getElementById(chartId)?.parentElement?.classList.remove('dark-mode-chart');
    }
  }, [chartConfig?.darkMode, chartId]);

  // Get chart data and options
  const chartData = processChartData();
  const options = getChartOptions();
  const chartJSType = getChartJSType();

  if (error) {
    return (
      <div className="chart-container w-full h-full min-h-[400px] flex items-center justify-center" id={chartId}>
        {error ? (
          <div className="text-red-500 text-center p-4">
            <p className="font-semibold">Error rendering chart</p>
            <p>{error}</p>
          </div>
        ) : null}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="chart-container w-full h-full" id={chartId}>
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        id={chartId}
        className={`chart-container ${chartConfig?.darkMode ? 'dark-mode-chart' : ''}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          maxWidth: chartConfig?.maxWidth || '100%',
          maxHeight: chartConfig?.maxHeight || '100%'
        }}
      >
        <Chart
          ref={chartRef}
          type={chartJSType}
          data={chartData}
          options={options}
          onLoad={(chart) => setChartInstance(chart)}
        />
      </div>
    </div>
  );
});

ChartRenderer2D.displayName = 'ChartRenderer2D';

ChartRenderer2D.propTypes = {
  id: PropTypes.string,
  chartType: PropTypes.string.isRequired,
  chartData: PropTypes.object,
  chartConfig: PropTypes.object,
  excelData: PropTypes.object.isRequired,
  dataMappings: PropTypes.object.isRequired
};

export default ChartRenderer2D;
