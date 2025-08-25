import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';

const ChartPreview = ({ 
  chartType, 
  dataMapping, 
  chartOptions, 
  fileData, 
  title,
  description 
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [chartId] = useState(`chart-${uuidv4()}`);

  // Process data for the chart based on chart type and data mapping
  useEffect(() => {
    try {
      if (!fileData || fileData.length === 0) {
        setError('No data available to generate chart');
        return;
      }

      // Process data based on chart type
      if (chartType.startsWith('2d-')) {
        process2DChartData();
      } else if (chartType.startsWith('3d-')) {
        process3DChartData();
      }
    } catch (err) {
      console.error('Error processing chart data:', err);
      setError(`Failed to process chart data: ${err.message}`);
    }
  }, [chartType, dataMapping, fileData]);

  // Render 2D chart using Chart.js
  useEffect(() => {
    if (chartData && chartType.startsWith('2d-') && chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Create new chart instance
      chartInstance.current = new Chart(ctx, {
        type: get2DChartType(),
        data: chartData,
        options: get2DChartOptions()
      });

      // Cleanup on unmount
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }
  }, [chartData, chartType, chartOptions]);

  // Process data for 2D charts
  const process2DChartData = () => {
    let processedData;

    switch (chartType) {
      case '2d-bar':
      case '2d-line':
      case '2d-area':
        processedData = processAxisBasedData();
        break;
      case '2d-pie':
        processedData = processPieData();
        break;
      case '2d-scatter':
        processedData = processScatterData();
        break;
      case '2d-radar':
        processedData = processRadarData();
        break;
      default:
        setError(`Unsupported chart type: ${chartType}`);
        return;
    }

    setChartData(processedData);
  };

  // Process data for 3D charts
  const process3DChartData = () => {
    let processedData;

    switch (chartType) {
      case '3d-bar':
        processedData = process3DBarData();
        break;
      case '3d-scatter':
        processedData = process3DScatterData();
        break;
      case '3d-surface':
        processedData = process3DSurfaceData();
        break;
      default:
        setError(`Unsupported chart type: ${chartType}`);
        return;
    }

    setChartData(processedData);
  };

  // Process data for axis-based charts (bar, line, area)
  const processAxisBasedData = () => {
    const { xAxis, yAxis } = dataMapping;
    
    if (!xAxis || !yAxis || yAxis.length === 0) {
      setError('Please select both X and Y axes');
      return null;
    }

    // Get unique x-axis values
    const labels = [...new Set(fileData.map(item => item[xAxis]))];

    // Create datasets for each y-axis
    const datasets = yAxis.map((y, index) => {
      const color = chartOptions.colors[index % chartOptions.colors.length];
      
      return {
        label: y,
        data: labels.map(label => {
          const matchingRow = fileData.find(item => item[xAxis] === label);
          return matchingRow ? parseFloat(matchingRow[y]) || 0 : 0;
        }),
        backgroundColor: chartType === '2d-line' ? color : `${color}80`, // Add transparency for bar/area
        borderColor: color,
        fill: chartType === '2d-area',
      };
    });

    return { labels, datasets };
  };

  // Process data for pie charts
  const processPieData = () => {
    const { label, value } = dataMapping;
    
    if (!label || !value) {
      setError('Please select both label and value fields');
      return null;
    }

    // Get unique labels
    const labels = [...new Set(fileData.map(item => item[label]))];
    
    // Calculate values for each label
    const data = labels.map(labelValue => {
      const matchingRow = fileData.find(item => item[label] === labelValue);
      return matchingRow ? parseFloat(matchingRow[value]) || 0 : 0;
    });

    // Generate background colors
    const backgroundColor = labels.map((_, index) => 
      chartOptions.colors[index % chartOptions.colors.length]
    );

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderColor: chartOptions.darkMode ? '#374151' : '#ffffff',
        borderWidth: 1
      }]
    };
  };

  // Process data for scatter plots
  const processScatterData = () => {
    const { xAxis, yAxis, category } = dataMapping;
    
    if (!xAxis || !yAxis) {
      setError('Please select both X and Y axes');
      return null;
    }

    if (category) {
      // Group by category
      const categories = [...new Set(fileData.map(item => item[category]))];
      
      const datasets = categories.map((cat, index) => {
        const color = chartOptions.colors[index % chartOptions.colors.length];
        const filteredData = fileData.filter(item => item[category] === cat);
        
        return {
          label: cat,
          data: filteredData.map(item => ({
            x: parseFloat(item[xAxis]) || 0,
            y: parseFloat(item[yAxis]) || 0
          })),
          backgroundColor: `${color}80`,
          borderColor: color,
          pointRadius: 5,
          pointHoverRadius: 7
        };
      });

      return { datasets };
    } else {
      // No category grouping
      return {
        datasets: [{
          label: `${xAxis} vs ${yAxis}`,
          data: fileData.map(item => ({
            x: parseFloat(item[xAxis]) || 0,
            y: parseFloat(item[yAxis]) || 0
          })),
          backgroundColor: `${chartOptions.colors[0]}80`,
          borderColor: chartOptions.colors[0],
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      };
    }
  };

  // Process data for radar charts
  const processRadarData = () => {
    const { label, yAxis } = dataMapping;
    
    if (!label || !yAxis || yAxis.length === 0) {
      setError('Please select both label and value fields');
      return null;
    }

    // Get unique labels
    const labels = [...new Set(fileData.map(item => item[label]))];
    
    // Create datasets for each y-axis
    const datasets = yAxis.map((y, index) => {
      const color = chartOptions.colors[index % chartOptions.colors.length];
      
      return {
        label: y,
        data: labels.map(labelValue => {
          const matchingRow = fileData.find(item => item[label] === labelValue);
          return matchingRow ? parseFloat(matchingRow[y]) || 0 : 0;
        }),
        backgroundColor: `${color}40`,
        borderColor: color,
        pointBackgroundColor: color,
        fill: true
      };
    });

    return { labels, datasets };
  };

  // Process data for 3D bar charts
  const process3DBarData = () => {
    const { xAxis, yAxis, zAxis } = dataMapping;
    
    if (!xAxis || !yAxis || !zAxis) {
      setError('Please select X, Y, and Z axes');
      return null;
    }

    // For Three.js, we'll return the raw data and process it in the 3D renderer
    const xValues = [...new Set(fileData.map(item => item[xAxis]))];
    const zValues = [...new Set(fileData.map(item => item[zAxis]))];
    
    const data = [];
    
    xValues.forEach((x, xIndex) => {
      zValues.forEach((z, zIndex) => {
        const matchingRow = fileData.find(item => item[xAxis] === x && item[zAxis] === z);
        const value = matchingRow ? parseFloat(matchingRow[yAxis]) || 0 : 0;
        
        data.push({
          x: xIndex,
          y: value,
          z: zIndex,
          xLabel: x,
          zLabel: z,
          value
        });
      });
    });

    return {
      data,
      xLabels: xValues,
      zLabels: zValues,
      yAxis
    };
  };

  // Process data for 3D scatter plots
  const process3DScatterData = () => {
    const { xAxis, yAxis, zAxis, category } = dataMapping;
    
    if (!xAxis || !yAxis || !zAxis) {
      setError('Please select X, Y, and Z axes');
      return null;
    }

    let data;
    
    if (category) {
      // Group by category
      const categories = [...new Set(fileData.map(item => item[category]))];
      
      data = categories.map((cat, index) => {
        const color = chartOptions.colors[index % chartOptions.colors.length];
        const filteredData = fileData.filter(item => item[category] === cat);
        
        return {
          category: cat,
          color,
          points: filteredData.map(item => ({
            x: parseFloat(item[xAxis]) || 0,
            y: parseFloat(item[yAxis]) || 0,
            z: parseFloat(item[zAxis]) || 0
          }))
        };
      });
    } else {
      // No category grouping
      data = [{
        category: `${xAxis} vs ${yAxis} vs ${zAxis}`,
        color: chartOptions.colors[0],
        points: fileData.map(item => ({
          x: parseFloat(item[xAxis]) || 0,
          y: parseFloat(item[yAxis]) || 0,
          z: parseFloat(item[zAxis]) || 0
        }))
      }];
    }

    return {
      data,
      xAxis,
      yAxis,
      zAxis
    };
  };

  // Process data for 3D surface plots
  const process3DSurfaceData = () => {
    const { xAxis, yAxis, zAxis } = dataMapping;
    
    if (!xAxis || !yAxis || !zAxis) {
      setError('Please select X, Y, and Z axes');
      return null;
    }

    // For Three.js, we'll return the raw data and process it in the 3D renderer
    const xValues = [...new Set(fileData.map(item => parseFloat(item[xAxis]) || 0))].sort((a, b) => a - b);
    const yValues = [...new Set(fileData.map(item => parseFloat(item[yAxis]) || 0))].sort((a, b) => a - b);
    
    // Create a grid of z values
    const zGrid = Array(xValues.length).fill().map(() => Array(yValues.length).fill(0));
    
    fileData.forEach(item => {
      const x = parseFloat(item[xAxis]) || 0;
      const y = parseFloat(item[yAxis]) || 0;
      const z = parseFloat(item[zAxis]) || 0;
      
      const xIndex = xValues.indexOf(x);
      const yIndex = yValues.indexOf(y);
      
      if (xIndex !== -1 && yIndex !== -1) {
        zGrid[xIndex][yIndex] = z;
      }
    });

    return {
      xValues,
      yValues,
      zGrid,
      xAxis,
      yAxis,
      zAxis
    };
  };

  // Get Chart.js chart type based on our chart type
  const get2DChartType = () => {
    switch (chartType) {
      case '2d-bar': return 'bar';
      case '2d-line': return 'line';
      case '2d-pie': return 'pie';
      case '2d-scatter': return 'scatter';
      case '2d-area': return 'line'; // Line with fill
      case '2d-radar': return 'radar';
      default: return 'bar';
    }
  };

  // Get Chart.js options based on our chart options
  const get2DChartOptions = () => {
    const baseOptions = {
      responsive: chartOptions.responsive,
      maintainAspectRatio: chartOptions.maintainAspectRatio,
      animation: chartOptions.animation ? { duration: 1000 } : false,
      plugins: {
        legend: {
          display: chartOptions.showLegend,
          position: 'top',
          labels: {
            color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
          }
        },
        title: {
          display: !!chartOptions.title,
          text: chartOptions.title || title,
          color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
        }
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
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
              }
            },
            x: {
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
              }
            }
          }
        };
      case '2d-line':
      case '2d-area':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
              }
            },
            x: {
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
              }
            }
          },
          elements: {
            line: {
              tension: 0.3 // Smooth lines
            }
          }
        };
      case '2d-scatter':
        return {
          ...baseOptions,
          scales: {
            y: {
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
              }
            },
            x: {
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
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
              angleLines: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
              },
              grid: {
                color: chartOptions.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
              },
              pointLabels: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151'
              },
              ticks: {
                color: chartOptions.darkMode ? '#e5e7eb' : '#374151',
                backdropColor: chartOptions.darkMode ? '#1f2937' : '#ffffff'
              }
            }
          }
        };
      case '2d-pie':
        return {
          ...baseOptions,
          cutout: '0%',
          radius: '90%'
        };
      default:
        return baseOptions;
    }
  };

  // Render 3D chart components
  const render3DChart = () => {
    if (!chartData) return null;

    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={chartOptions.enableZoom || true} />
          
          {chartType === '3d-bar' && <ThreeDBarChart data={chartData} colors={chartOptions.colors} />}
          {chartType === '3d-scatter' && <ThreeDScatterChart data={chartData} />}
          {chartType === '3d-surface' && <ThreeDSurfaceChart data={chartData} colors={chartOptions.colors} />}
          
          <axesHelper args={[5]} />
        </Canvas>
      </div>
    );
  };

  // 3D Bar Chart Component
  const ThreeDBarChart = ({ data, colors }) => {
    if (!data || !data.data) return null;
    
    return (
      <>
        {data.data.map((bar, index) => (
          <mesh key={index} position={[bar.x - data.xLabels.length/2, bar.y/2, bar.z - data.zLabels.length/2]}>
            <boxGeometry args={[0.8, bar.y, 0.8]} />
            <meshStandardMaterial color={colors[index % colors.length]} />
          </mesh>
        ))}
      </>
    );
  };

  // 3D Scatter Chart Component
  const ThreeDScatterChart = ({ data }) => {
    if (!data || !data.data) return null;
    
    return (
      <>
        {data.data.map((category, catIndex) => (
          category.points.map((point, pointIndex) => (
            <mesh key={`${catIndex}-${pointIndex}`} position={[point.x, point.y, point.z]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={category.color} />
            </mesh>
          ))
        ))}
      </>
    );
  };

  // 3D Surface Chart Component
  const ThreeDSurfaceChart = ({ data, colors }) => {
    if (!data || !data.xValues || !data.yValues || !data.zGrid) return null;
    
    // This is a simplified implementation
    // A full implementation would use PlaneGeometry with vertex manipulation
    return (
      <>
        {data.xValues.map((x, xIndex) => (
          data.yValues.map((y, yIndex) => {
            const z = data.zGrid[xIndex][yIndex];
            return (
              <mesh key={`${xIndex}-${yIndex}`} position={[
                x - Math.max(...data.xValues)/2, 
                z/2, 
                y - Math.max(...data.yValues)/2
              ]}>
                <boxGeometry args={[0.1, z, 0.1]} />
                <meshStandardMaterial 
                  color={colors[Math.floor((z / Math.max(...data.zGrid.flat())) * colors.length) % colors.length]} 
                />
              </mesh>
            );
          })
        ))}
      </>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Chart Preview
      </h3>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6" 
        style={{ backgroundColor: chartOptions.backgroundColor }}>
        {error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        ) : chartType.startsWith('2d-') ? (
          <div className="w-full" style={{ height: '400px' }}>
            <canvas id={chartId} ref={chartRef}></canvas>
          </div>
        ) : (
          render3DChart()
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
          Chart Configuration Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Chart Type:</span> {chartType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Data Points:</span> {fileData?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Data Mapping:</span>
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-400 list-disc list-inside ml-2">
              {Object.entries(dataMapping).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                return (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {Array.isArray(value) ? value.join(', ') : value}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
