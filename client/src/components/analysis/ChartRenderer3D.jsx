import React, { useEffect, useState, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';

const ChartRenderer3D = forwardRef(({ chartType, chartConfig, excelData, dataMappings, id }, ref) => {
  const [error, setError] = useState(null);
  const chartId = id || `chart-3d-${uuidv4()}`;
  const [chartData, setChartData] = useState(null);
  const [axesConfig, setAxesConfig] = useState(null);
  const controlsRef = useRef();

  // Process data for the chart based on chart type and mappings
  useEffect(() => {
    try {
      if (!excelData || !excelData.data || !dataMappings) {
        throw new Error('Missing data or mappings');
      }

      const { data, columns } = excelData;
      
      // Handle dynamic axis mappings
      // First, check for standard mappings from DynamicAxisSelector
      const xAxisKey = dataMappings.x || dataMappings.xAxis;
      const yAxisKey = dataMappings.y || dataMappings.yAxis;
      const zAxisKey = dataMappings.z || dataMappings.zAxis;
      const colorKey = dataMappings.color;
      const sizeKey = dataMappings.size;
      const groupKey = dataMappings.group || dataMappings.category;
      
      // Get column indices for the mapped fields
      const getColumnIndex = (columnName) => {
        return columns.findIndex(col => col === columnName);
      };

      // Generate colors if not provided
      const generateColors = (count) => {
        const defaultColors = [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(199, 199, 199)',
          'rgb(83, 102, 255)',
          'rgb(40, 159, 64)',
          'rgb(210, 199, 199)',
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

      // Find min and max values for normalization
      const findMinMax = (values) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { min, max };
      };

      // Normalize values to a specific range
      const normalizeValues = (values, min, max, targetMin = -5, targetMax = 5) => {
        if (min === max) return values.map(() => (targetMin + targetMax) / 2);
        return values.map(value => {
          return targetMin + ((value - min) / (max - min)) * (targetMax - targetMin);
        });
      };

      // Process data based on chart type
      switch (chartType) {
        case '3d-bar': {
          // Use dynamic axis mappings
          const xAxisColumn = xAxisKey;
          const zAxisColumn = zAxisKey;
          const yAxisColumn = yAxisKey; // Height in 3D bar chart
          const colorColumn = colorKey;
          
          if (!xAxisColumn || !zAxisColumn || !yAxisColumn) {
            throw new Error('Missing required axis mappings for 3D bar chart');
          }
          
          const xAxisIndex = getColumnIndex(xAxisColumn);
          const zAxisIndex = getColumnIndex(zAxisColumn);
          const yAxisIndex = getColumnIndex(yAxisColumn);
          const colorIndex = colorColumn ? getColumnIndex(colorColumn) : -1;
          
          if (xAxisIndex === -1 || zAxisIndex === -1 || yAxisIndex === -1) {
            throw new Error('Invalid column mappings');
          }
          
          // Extract values
          const xValues = data.map(row => row[xAxisIndex]);
          const zValues = data.map(row => row[zAxisIndex]);
          const yValues = data.map(row => parseFloat(row[yAxisIndex]) || 0);
          
          // Find unique categories for x and z axes
          const uniqueXValues = [...new Set(xValues)];
          const uniqueZValues = [...new Set(zValues)];
          
          // Create a mapping for x and z categories to positions
          const xMapping = {};
          uniqueXValues.forEach((value, index) => {
            xMapping[value] = index - (uniqueXValues.length - 1) / 2;
          });
          
          const zMapping = {};
          uniqueZValues.forEach((value, index) => {
            zMapping[value] = index - (uniqueZValues.length - 1) / 2;
          });
          
          // Find min and max for y values for normalization
          const { min: yMin, max: yMax } = findMinMax(yValues);
          
          // Create bar data
          const bars = data.map((row, index) => {
            const x = xMapping[row[xAxisIndex]];
            const z = zMapping[row[zAxisIndex]];
            const y = parseFloat(row[yAxisIndex]) || 0;
            
            // Normalize height
            const normalizedHeight = normalizeValues([y], yMin, yMax, 0.1, 5)[0];
            
            // Determine color
            let color;
            if (colorIndex !== -1) {
              // Use color mapping if provided
              const colorValue = row[colorIndex];
              const colorSet = generateColors(uniqueXValues.length);
              const colorIndex = uniqueXValues.indexOf(row[xAxisIndex]) % colorSet.length;
              color = colorSet[colorIndex];
            } else {
              // Default color based on x category
              const colorSet = generateColors(uniqueXValues.length);
              const colorIndex = uniqueXValues.indexOf(row[xAxisIndex]) % colorSet.length;
              color = colorSet[colorIndex];
            }
            
            return {
              position: [x, normalizedHeight / 2, z],
              size: [0.8, normalizedHeight, 0.8],
              color,
              originalValue: y,
              label: `${row[xAxisIndex]}, ${row[zAxisIndex]}: ${y}`
            };
          });
          
          // Create axes config
          const axes = {
            x: {
              min: -uniqueXValues.length / 2,
              max: uniqueXValues.length / 2,
              ticks: uniqueXValues.map((value, index) => ({
                position: [index - (uniqueXValues.length - 1) / 2, 0, -uniqueZValues.length / 2 - 0.5],
                label: value
              })),
              label: xAxisColumn
            },
            y: {
              min: 0,
              max: 5,
              ticks: [0, 1, 2, 3, 4, 5].map(value => ({
                position: [-uniqueXValues.length / 2 - 0.5, value, -uniqueZValues.length / 2 - 0.5],
                label: Math.round((value / 5) * (yMax - yMin) + yMin)
              })),
              label: yAxisColumn
            },
            z: {
              min: -uniqueZValues.length / 2,
              max: uniqueZValues.length / 2,
              ticks: uniqueZValues.map((value, index) => ({
                position: [-uniqueXValues.length / 2 - 0.5, 0, index - (uniqueZValues.length - 1) / 2],
                label: value
              })),
              label: zAxisColumn
            }
          };
          
          setChartData({ bars });
          setAxesConfig(axes);
          break;
        }
        
        case '3d-scatter': {
          // Use dynamic axis mappings
          const xAxisColumn = xAxisKey;
          const yAxisColumn = yAxisKey;
          const zAxisColumn = zAxisKey;
          const sizeColumn = sizeKey;
          const colorColumn = colorKey || groupKey;
          
          if (!xAxisColumn || !yAxisColumn || !zAxisColumn) {
            throw new Error('Missing required axis mappings for 3D scatter chart');
          }
          
          const xAxisIndex = getColumnIndex(xAxisColumn);
          const yAxisIndex = getColumnIndex(yAxisColumn);
          const zAxisIndex = getColumnIndex(zAxisColumn);
          const sizeIndex = sizeColumn ? getColumnIndex(sizeColumn) : -1;
          const colorIndex = colorColumn ? getColumnIndex(colorColumn) : -1;
          
          if (xAxisIndex === -1 || yAxisIndex === -1 || zAxisIndex === -1) {
            throw new Error('Invalid column mappings');
          }
          
          // Extract values
          const xValues = data.map(row => parseFloat(row[xAxisIndex]) || 0);
          const yValues = data.map(row => parseFloat(row[yAxisIndex]) || 0);
          const zValues = data.map(row => parseFloat(row[zAxisIndex]) || 0);
          const sizeValues = sizeIndex !== -1 ? data.map(row => parseFloat(row[sizeIndex]) || 1) : null;
          
          // Find min and max for normalization
          const { min: xMin, max: xMax } = findMinMax(xValues);
          const { min: yMin, max: yMax } = findMinMax(yValues);
          const { min: zMin, max: zMax } = findMinMax(zValues);
          const sizeMinMax = sizeValues ? findMinMax(sizeValues) : { min: 1, max: 1 };
          
          // Normalize values
          const normalizedX = normalizeValues(xValues, xMin, xMax);
          const normalizedY = normalizeValues(yValues, yMin, yMax);
          const normalizedZ = normalizeValues(zValues, zMin, zMax);
          const normalizedSizes = sizeValues ? normalizeValues(sizeValues, sizeMinMax.min, sizeMinMax.max, 0.1, 0.5) : null;
          
          // Create points data
          const points = data.map((row, index) => {
            // Determine color
            let color;
            if (colorIndex !== -1) {
              // Use color mapping if provided
              const colorValue = row[colorIndex];
              const uniqueColors = [...new Set(data.map(r => r[colorIndex]))];
              const colorSet = generateColors(uniqueColors.length);
              const colorIdx = uniqueColors.indexOf(colorValue) % colorSet.length;
              color = colorSet[colorIdx];
            } else {
              // Default color
              color = generateColors(1)[0];
            }
            
            return {
              position: [normalizedX[index], normalizedY[index], normalizedZ[index]],
              size: normalizedSizes ? normalizedSizes[index] : 0.2,
              color,
              originalValues: {
                x: xValues[index],
                y: yValues[index],
                z: zValues[index],
                size: sizeValues ? sizeValues[index] : null
              },
              label: `${xAxisColumn}: ${xValues[index]}, ${yAxisColumn}: ${yValues[index]}, ${zAxisColumn}: ${zValues[index]}`
            };
          });
          
          // Create axes config
          const axes = {
            x: {
              min: -5,
              max: 5,
              ticks: [-5, -2.5, 0, 2.5, 5].map(value => ({
                position: [value, -5, -5],
                label: Math.round(((value + 5) / 10) * (xMax - xMin) + xMin)
              })),
              label: xAxisColumn
            },
            y: {
              min: -5,
              max: 5,
              ticks: [-5, -2.5, 0, 2.5, 5].map(value => ({
                position: [-5, value, -5],
                label: Math.round(((value + 5) / 10) * (yMax - yMin) + yMin)
              })),
              label: yAxisColumn
            },
            z: {
              min: -5,
              max: 5,
              ticks: [-5, -2.5, 0, 2.5, 5].map(value => ({
                position: [-5, -5, value],
                label: Math.round(((value + 5) / 10) * (zMax - zMin) + zMin)
              })),
              label: zAxisColumn
            }
          };
          
          setChartData({ points });
          setAxesConfig(axes);
          break;
        }
        
        case '3d-surface': {
          // Use dynamic axis mappings
          const xAxisColumn = xAxisKey;
          const zAxisColumn = zAxisKey;
          const yAxisColumn = yAxisKey; // Height in 3D surface
          
          if (!xAxisColumn || !zAxisColumn || !yAxisColumn) {
            throw new Error('Missing required axis mappings for 3D surface chart');
          }
          
          const xAxisIndex = getColumnIndex(xAxisColumn);
          const zAxisIndex = getColumnIndex(zAxisColumn);
          const yAxisIndex = getColumnIndex(yAxisColumn);
          
          if (xAxisIndex === -1 || zAxisIndex === -1 || yAxisIndex === -1) {
            throw new Error('Invalid column mappings');
          }
          
          // Extract values
          const xValues = data.map(row => parseFloat(row[xAxisIndex]) || 0);
          const zValues = data.map(row => parseFloat(row[zAxisIndex]) || 0);
          const yValues = data.map(row => parseFloat(row[yAxisIndex]) || 0);
          
          // Find min and max for normalization
          const { min: xMin, max: xMax } = findMinMax(xValues);
          const { min: yMin, max: yMax } = findMinMax(yValues);
          const { min: zMin, max: zMax } = findMinMax(zValues);
          
          // Normalize values
          const normalizedX = normalizeValues(xValues, xMin, xMax);
          const normalizedY = normalizeValues(yValues, yMin, yMax);
          const normalizedZ = normalizeValues(zValues, zMin, zMax);
          
          // For surface, we need to create a grid
          // First, find unique x and z values to create a grid
          const uniqueXValues = [...new Set(normalizedX)].sort((a, b) => a - b);
          const uniqueZValues = [...new Set(normalizedZ)].sort((a, b) => a - b);
          
          // Create a 2D grid for the surface
          const grid = Array(uniqueXValues.length).fill().map(() => Array(uniqueZValues.length).fill(null));
          
          // Fill the grid with normalized y values
          data.forEach((row, index) => {
            const x = parseFloat(row[xAxisIndex]) || 0;
            const z = parseFloat(row[zAxisIndex]) || 0;
            
            const normalizedXValue = normalizedX[index];
            const normalizedZValue = normalizedZ[index];
            const normalizedYValue = normalizedY[index];
            
            const xIndex = uniqueXValues.indexOf(normalizedXValue);
            const zIndex = uniqueZValues.indexOf(normalizedZValue);
            
            if (xIndex !== -1 && zIndex !== -1) {
              grid[xIndex][zIndex] = normalizedYValue;
            }
          });
          
          // Create vertices and faces for the surface
          const vertices = [];
          const faces = [];
          const colors = [];
          
          // Generate vertices
          for (let i = 0; i < uniqueXValues.length; i++) {
            for (let j = 0; j < uniqueZValues.length; j++) {
              const x = uniqueXValues[i];
              const z = uniqueZValues[j];
              const y = grid[i][j] !== null ? grid[i][j] : 0;
              
              vertices.push([x, y, z]);
              
              // Generate color based on height
              const normalizedHeight = (y + 5) / 10; // Normalize to 0-1
              const color = new THREE.Color().setHSL(
                0.7 - normalizedHeight * 0.7, // Hue: blue to red
                0.8, // Saturation
                0.5  // Lightness
              );
              colors.push(color.getHexString());
            }
          }
          
          // Generate faces (triangles)
          for (let i = 0; i < uniqueXValues.length - 1; i++) {
            for (let j = 0; j < uniqueZValues.length - 1; j++) {
              const topLeft = i * uniqueZValues.length + j;
              const topRight = topLeft + 1;
              const bottomLeft = (i + 1) * uniqueZValues.length + j;
              const bottomRight = bottomLeft + 1;
              
              // Create two triangles for each grid cell
              faces.push([topLeft, bottomLeft, bottomRight]); // First triangle
              faces.push([topLeft, bottomRight, topRight]);   // Second triangle
            }
          }
          
          // Create axes config
          const axes = {
            x: {
              min: -5,
              max: 5,
              ticks: [-5, -2.5, 0, 2.5, 5].map(value => ({
                position: [value, -5, -5],
                label: Math.round(((value + 5) / 10) * (xMax - xMin) + xMin)
              })),
              label: xAxisColumn
            },
            y: {
              min: -5,
              max: 5,
              ticks: [-5, -2.5, 0, 2.5, 5].map(value => ({
                position: [-5, value, -5],
                label: Math.round(((value + 5) / 10) * (yMax - yMin) + yMin)
              })),
              label: yAxisColumn
            },
            z: {
              min: -5,
              max: 5,
              ticks: [-5, -2.5, 0, 2.5, 5].map(value => ({
                position: [-5, -5, value],
                label: Math.round(((value + 5) / 10) * (zMax - zMin) + zMin)
              })),
              label: zAxisColumn
            }
          };
          
          setChartData({ surface: { vertices, faces, colors } });
          setAxesConfig(axes);
          break;
        }
        
        default:
          throw new Error(`Unsupported chart type: ${chartType}`);
      }
    } catch (err) {
      setError(`Error processing chart data: ${err.message}`);
    }
  }, [chartType, chartConfig, excelData, dataMappings]);

  // Reset camera position when chart type changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [chartType]);

  // Render 3D bar chart
  const renderBarChart = () => {
    if (!chartData || !chartData.bars) return null;
    
    return (
      <>
        {chartData.bars.map((bar, index) => (
          <mesh key={index} position={bar.position}>
            <boxGeometry args={bar.size} />
            <meshStandardMaterial color={bar.color} />
            {chartConfig?.showLabels && (
              <Html position={[0, bar.size[1] / 2 + 0.3, 0]} center>
                <div className="text-xs bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 p-1 rounded">
                  {bar.originalValue}
                </div>
              </Html>
            )}
          </mesh>
        ))}
      </>
    );
  };

  // Render 3D scatter chart
  const renderScatterChart = () => {
    if (!chartData || !chartData.points) return null;
    
    return (
      <>
        {chartData.points.map((point, index) => (
          <mesh key={index} position={point.position}>
            <sphereGeometry args={[point.size, 16, 16]} />
            <meshStandardMaterial color={point.color} />
            {chartConfig?.showLabels && (
              <Html position={[0, point.size + 0.1, 0]} center>
                <div className="text-xs bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 p-1 rounded">
                  {point.originalValues.y}
                </div>
              </Html>
            )}
          </mesh>
        ))}
      </>
    );
  };

  // Render 3D surface chart
  const renderSurfaceChart = () => {
    if (!chartData || !chartData.surface) return null;
    
    const { vertices, faces, colors } = chartData.surface;
    
    return (
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={vertices.length}
            array={new Float32Array(vertices.flat())}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={faces.flat().length}
            array={new Uint16Array(faces.flat())}
            itemSize={1}
          />
        </bufferGeometry>
        <meshPhongMaterial
          vertexColors
          side={THREE.DoubleSide}
          wireframe={chartConfig?.wireframe || false}
        />
      </mesh>
    );
  };

  // Render axes
  const renderAxes = () => {
    if (!axesConfig) return null;
    
    return (
      <>
        {/* X Axis */}
        <Line
          points={[
            [axesConfig.x.min, 0, 0],
            [axesConfig.x.max, 0, 0]
          ]}
          color="gray"
          lineWidth={1}
        />
        {axesConfig.x.ticks.map((tick, index) => (
          <group key={`x-tick-${index}`}>
            <Text
              position={tick.position}
              color="gray"
              fontSize={0.3}
              anchorX="center"
              anchorY="top"
            >
              {tick.label}
            </Text>
          </group>
        ))}
        <Text
          position={[0, 0, -6]}
          color="gray"
          fontSize={0.4}
          anchorX="center"
          anchorY="top"
        >
          {axesConfig.x.label}
        </Text>
        
        {/* Y Axis */}
        <Line
          points={[
            [0, axesConfig.y.min, 0],
            [0, axesConfig.y.max, 0]
          ]}
          color="gray"
          lineWidth={1}
        />
        {axesConfig.y.ticks.map((tick, index) => (
          <group key={`y-tick-${index}`}>
            <Text
              position={tick.position}
              color="gray"
              fontSize={0.3}
              anchorX="right"
              anchorY="middle"
            >
              {tick.label}
            </Text>
          </group>
        ))}
        <Text
          position={[-6, 0, 0]}
          color="gray"
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
        >
          {axesConfig.y.label}
        </Text>
        
        {/* Z Axis */}
        <Line
          points={[
            [0, 0, axesConfig.z.min],
            [0, 0, axesConfig.z.max]
          ]}
          color="gray"
          lineWidth={1}
        />
        {axesConfig.z.ticks.map((tick, index) => (
          <group key={`z-tick-${index}`}>
            <Text
              position={tick.position}
              color="gray"
              fontSize={0.3}
              anchorX="right"
              anchorY="middle"
            >
              {tick.label}
            </Text>
          </group>
        ))}
        <Text
          position={[0, -6, 0]}
          color="gray"
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
          rotation={[Math.PI / 2, 0, 0]}
        >
          {axesConfig.z.label}
        </Text>
      </>
    );
  };

  // Render chart based on type
  const renderChart = () => {
    switch (chartType) {
      case '3d-bar':
        return renderBarChart();
      case '3d-scatter':
        return renderScatterChart();
      case '3d-surface':
        return renderSurfaceChart();
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="chart-container w-full h-full min-h-[400px]" id={chartId}>
        {error ? (
          <div className="text-red-500 text-center p-4">
            <p className="font-semibold">Error rendering chart</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading 3D chart...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chart-container w-full h-full min-h-[400px]" id={chartId}>
      <Canvas 
        className="w-full h-full" 
        camera={{ position: [5, 5, 5], fov: 75 }}
        style={{ background: chartConfig?.darkMode ? '#1a1a2e' : '#f8f9fa' }}
        ref={ref}
        data-chart-id={chartId}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <gridHelper args={[10, 10]} />
        {renderAxes()}
        {renderChart()}
        <OrbitControls 
          ref={controlsRef} 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
          autoRotate={chartConfig?.autoRotate || false}
          autoRotateSpeed={chartConfig?.rotationSpeed || 1}
        />
      </Canvas>
    </div>
  );
});

ChartRenderer3D.displayName = 'ChartRenderer3D';

ChartRenderer3D.propTypes = {
  id: PropTypes.string,
  chartType: PropTypes.string.isRequired,
  chartData: PropTypes.object,
  chartConfig: PropTypes.object,
  excelData: PropTypes.object.isRequired,
  dataMappings: PropTypes.object.isRequired
};

export default ChartRenderer3D;
