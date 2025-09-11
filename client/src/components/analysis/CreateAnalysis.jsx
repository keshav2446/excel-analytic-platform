import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getExcelFileById } from '../../store/slices/excelSlice';
import { createAnalysis } from '../../store/slices/analysisSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';
import ChartTypeSelector from './ChartTypeSelector';
import DataMappingForm from './DataMappingForm';
import ChartConfigForm from './ChartConfigForm';
import ChartPreview from './ChartPreview';

const CreateAnalysis = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fileId = queryParams.get('fileId');

  const { currentFile, loading: fileLoading } = useSelector((state) => state.excel);
  const { loading: analysisLoading } = useSelector((state) => state.analysis);

  // Analysis configuration state
  const [step, setStep] = useState(1);
  const [analysisConfig, setAnalysisConfig] = useState({
    title: '',
    description: '',
    fileId: fileId || '',
    chartType: '2d-bar',
    dataMapping: {
      xAxis: '',
      yAxis: [],
      zAxis: '',
      category: '',
      value: '',
      label: '',
    },
    chartOptions: {
      title: '',
      showLegend: true,
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      backgroundColor: '#FFFFFF',
      darkMode: false,
      animation: true,
      responsive: true,
      maintainAspectRatio: true,
    },
    aiInsights: false,
  });

  // Load file data if fileId is provided
  useEffect(() => {
    if (fileId) {
      dispatch(getExcelFileById(fileId));
    }
  }, [dispatch, fileId]);

  // Update title when file is loaded
  useEffect(() => {
    if (currentFile && !analysisConfig.title) {
      setAnalysisConfig(prev => ({
        ...prev,
        title: `Analysis of ${currentFile.fileName}`,
      }));
    }
  }, [currentFile, analysisConfig.title]);

  // Handle next step
  const handleNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Handle chart type selection
  const handleChartTypeChange = (chartType) => {
    setAnalysisConfig(prev => ({
      ...prev,
      chartType,
      // Reset data mapping when chart type changes
      dataMapping: {
        xAxis: '',
        yAxis: [],
        zAxis: '',
        category: '',
        value: '',
        label: '',
      },
    }));
  };

  // Handle data mapping change
  const handleDataMappingChange = (dataMapping) => {
    setAnalysisConfig(prev => ({
      ...prev,
      dataMapping,
    }));
  };

  // Handle chart options change
  const handleChartOptionsChange = (chartOptions) => {
    setAnalysisConfig(prev => ({
      ...prev,
      chartOptions,
    }));
  };

  // Handle basic info change
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setAnalysisConfig(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle AI insights toggle
  const handleAiInsightsToggle = () => {
    setAnalysisConfig(prev => ({
      ...prev,
      aiInsights: !prev.aiInsights,
    }));
  };

  // Handle analysis creation
  const handleCreateAnalysis = async () => {
    try {
      await dispatch(createAnalysis(analysisConfig)).unwrap();
      
      dispatch(addNotification({
        id: uuidv4(),
        type: 'success',
        message: 'Analysis created successfully!'
      }));
      
      navigate('/analyses');
    } catch (error) {
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: error.message || 'Failed to create analysis'
      }));
    }
  };

  // Render loading state
  if (fileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Render error state if no file is selected
  if (!fileId || !currentFile) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No file selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please select an Excel file to analyze.</p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => navigate('/files')}
            >
              Select a File
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Create New Analysis
      </h2>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            } text-white`}>
              1
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Chart Type
            </div>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700">
            <div className={`h-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            } text-white`}>
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Mapping
            </div>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700">
            <div className={`h-full ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            } text-white`}>
              3
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Configuration
            </div>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700">
            <div className={`h-full ${step >= 4 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ width: step >= 4 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 4 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            } text-white`}>
              4
            </div>
            <div className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {step === 1 && (
          <ChartTypeSelector 
            selectedType={analysisConfig.chartType}
            onSelectType={handleChartTypeChange}
          />
        )}

        {step === 2 && (
          <DataMappingForm 
            chartType={analysisConfig.chartType}
            dataMapping={analysisConfig.dataMapping}
            columns={currentFile.columns || []}
            excelData={{
              columns: currentFile.columns || [],
              data: currentFile.data || []
            }}
            onDataMappingChange={handleDataMappingChange}
            darkMode={analysisConfig.chartOptions.darkMode}
          />
        )}

        {step === 3 && (
          <ChartConfigForm 
            chartType={analysisConfig.chartType}
            chartOptions={analysisConfig.chartOptions}
            basicInfo={{
              title: analysisConfig.title,
              description: analysisConfig.description,
            }}
            onChartOptionsChange={handleChartOptionsChange}
            onBasicInfoChange={handleBasicInfoChange}
            aiInsights={analysisConfig.aiInsights}
            onAiInsightsToggle={handleAiInsightsToggle}
          />
        )}

        {step === 4 && (
          <ChartPreview 
            chartType={analysisConfig.chartType}
            dataMapping={analysisConfig.dataMapping}
            chartOptions={analysisConfig.chartOptions}
            fileData={currentFile.data || []}
            title={analysisConfig.title}
            description={analysisConfig.description}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          onClick={() => step === 1 ? navigate('/files') : handlePrevStep()}
        >
          {step === 1 ? 'Cancel' : 'Previous'}
        </button>
        <button
          type="button"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={step === 4 ? handleCreateAnalysis : handleNextStep}
          disabled={analysisLoading}
        >
          {step === 4 ? (analysisLoading ? 'Creating...' : 'Create Analysis') : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CreateAnalysis;
