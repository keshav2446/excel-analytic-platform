import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalysisById, deleteAnalysis } from '../../store/slices/analysisSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow } from 'date-fns';
import ChartRenderer2D from './ChartRenderer2D';
import ChartRenderer3D from './ChartRenderer3D';
import ChartDownloader from './ChartDownloader';

const AnalysisDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAnalysis, loading, error } = useSelector((state) => state.analysis);
  const [activeTab, setActiveTab] = useState('chart');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const chartRef = useRef(null);
  const [chartId] = useState(`chart-${uuidv4()}`);

  useEffect(() => {
    if (id) {
      dispatch(getAnalysisById(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteAnalysis(id)).unwrap();
      dispatch(addNotification({
        id: uuidv4(),
        type: 'success',
        message: 'Analysis deleted successfully'
      }));
      navigate('/analyses');
    } catch (error) {
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: error.message || 'Failed to delete analysis'
      }));
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleDownload = () => {
    // Download functionality will be implemented in a separate component
    setShowDownloadOptions(true);
  };

  const renderChart = () => {
    if (!currentAnalysis) return null;

    const is3D = currentAnalysis.chartType.startsWith('3d-');
    
    if (is3D) {
      return (
        <ChartRenderer3D 
          chartType={currentAnalysis.chartType}
          chartData={currentAnalysis.chartData}
          chartConfig={currentAnalysis.chartConfig}
          excelData={currentAnalysis.excelData}
          dataMappings={currentAnalysis.dataMappings}
          ref={chartRef}
        />
      );
    } else {
      return (
        <ChartRenderer2D
          chartType={currentAnalysis.chartType}
          chartData={currentAnalysis.chartData}
          chartConfig={currentAnalysis.chartConfig}
          excelData={currentAnalysis.excelData}
          dataMappings={currentAnalysis.dataMappings}
          ref={chartRef}
          id={chartId}
        />
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Analysis not found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The analysis you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="mt-6">
          <Link
            to="/analyses"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Analyses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{currentAnalysis.title}</h1>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                currentAnalysis.chartType.startsWith('2d-') 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
              }`}>
                {currentAnalysis.chartType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
            {currentAnalysis.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {currentAnalysis.description}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <Link
              to={`/analyses/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('chart')}
              className={`${
                activeTab === 'chart'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Chart
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`${
                activeTab === 'data'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Data Source
            </button>
            {currentAnalysis.aiInsights && (
              <button
                onClick={() => setActiveTab('insights')}
                className={`${
                  activeTab === 'insights'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                AI Insights
              </button>
            )}
            <button
              onClick={() => setActiveTab('details')}
              className={`${
                activeTab === 'details'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Details
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'chart' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="w-full h-[500px] flex items-center justify-center">
              {renderChart()}
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Source</h3>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentAnalysis.excelFile?.filename || 'Unknown file'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Uploaded {formatDate(currentAnalysis.excelFile?.uploadDate || currentAnalysis.createdAt)}</p>
                  <p className="mt-1">
                    {currentAnalysis.excelData?.rows?.length || 0} rows, {currentAnalysis.excelData?.columns?.length || 0} columns
                  </p>
                </div>
              </div>

              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Data Mappings</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentAnalysis.dataMappings && Object.entries(currentAnalysis.dataMappings).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              
              <div className="mt-4">
                <Link
                  to={`/files/${currentAnalysis.excelFile?._id}`}
                  className="inline-flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View full data source
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && currentAnalysis.aiInsights && (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Insights</h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md p-4 text-gray-800 dark:text-gray-200">
                <div className="flex items-start mb-4">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Key Findings</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {currentAnalysis.aiInsights.summary || 'No AI insights available.'}
                    </p>
                  </div>
                </div>
                
                {currentAnalysis.aiInsights.trends && currentAnalysis.aiInsights.trends.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Identified Trends</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {currentAnalysis.aiInsights.trends.map((trend, index) => (
                        <li key={index}>{trend}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {currentAnalysis.aiInsights.recommendations && currentAnalysis.aiInsights.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Recommendations</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {currentAnalysis.aiInsights.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analysis Details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(currentAnalysis.createdAt)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(currentAnalysis.updatedAt)}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Chart Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentAnalysis.chartType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Insights</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {currentAnalysis.aiInsights ? 'Enabled' : 'Disabled'}
                  </dd>
                </div>
              </dl>

              {currentAnalysis.chartConfig && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Chart Configuration</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(currentAnalysis.chartConfig).map(([key, value]) => {
                        // Skip arrays and objects for simplicity
                        if (typeof value !== 'object') {
                          return (
                            <div key={key} className="flex flex-col">
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                              </dd>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this analysis? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Options Modal */}
      {showDownloadOptions && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Download Chart</h3>
              <button
                type="button"
                onClick={() => setShowDownloadOptions(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <ChartDownloader 
              chartRef={chartRef}
              chartId={chartId}
              title={currentAnalysis?.title}
              is3D={currentAnalysis?.chartType.startsWith('3d-')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDetail;
