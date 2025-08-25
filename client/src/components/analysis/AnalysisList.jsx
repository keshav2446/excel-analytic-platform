import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAnalyses, deleteAnalysis } from '../../store/slices/analysisSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow } from 'date-fns';

const AnalysisList = () => {
  const dispatch = useDispatch();
  const { analyses, loading, error } = useSelector((state) => state.analysis);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // Fetch analyses on component mount
  useEffect(() => {
    dispatch(getAnalyses());
  }, [dispatch]);

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle analysis selection
  const handleSelectAnalysis = (analysisId) => {
    setSelectedAnalyses(prev => {
      if (prev.includes(analysisId)) {
        return prev.filter(id => id !== analysisId);
      } else {
        return [...prev, analysisId];
      }
    });
  };

  // Handle select all analyses
  const handleSelectAll = () => {
    if (selectedAnalyses.length === filteredAnalyses.length) {
      setSelectedAnalyses([]);
    } else {
      setSelectedAnalyses(filteredAnalyses.map(analysis => analysis._id));
    }
  };

  // Handle delete analysis
  const handleDeleteAnalysis = async (analysisId) => {
    if (window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      try {
        await dispatch(deleteAnalysis(analysisId)).unwrap();
        dispatch(addNotification({
          id: uuidv4(),
          type: 'success',
          message: 'Analysis deleted successfully'
        }));
      } catch (error) {
        dispatch(addNotification({
          id: uuidv4(),
          type: 'error',
          message: error.message || 'Failed to delete analysis'
        }));
      }
    }
  };

  // Handle batch delete
  const handleBatchDelete = async () => {
    if (selectedAnalyses.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedAnalyses.length} selected analyses? This action cannot be undone.`)) {
      try {
        // Delete analyses one by one
        for (const analysisId of selectedAnalyses) {
          await dispatch(deleteAnalysis(analysisId)).unwrap();
        }
        
        dispatch(addNotification({
          id: uuidv4(),
          type: 'success',
          message: `${selectedAnalyses.length} analyses deleted successfully`
        }));
        
        setSelectedAnalyses([]);
      } catch (error) {
        dispatch(addNotification({
          id: uuidv4(),
          type: 'error',
          message: error.message || 'Failed to delete some analyses'
        }));
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get chart type icon
  const getChartTypeIcon = (chartType) => {
    switch (chartType) {
      case '2d-bar':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="10" width="3" height="8" />
            <rect x="7" y="6" width="3" height="12" />
            <rect x="12" y="3" width="3" height="15" />
            <rect x="17" y="8" width="3" height="10" />
          </svg>
        );
      case '2d-line':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="2,14 7,8 12,11 17,5 18,7" />
          </svg>
        );
      case '2d-pie':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10,2 L10,10 L18,10 C18,5.5 14.5,2 10,2" />
            <path d="M10,10 L10,18 C14.5,18 18,14.5 18,10 L10,10" opacity="0.7" />
            <path d="M10,18 L10,10 L2,10 C2,14.5 5.5,18 10,18" opacity="0.4" />
            <path d="M10,2 C5.5,2 2,5.5 2,10 L10,10 L10,2" opacity="0.2" />
          </svg>
        );
      case '2d-scatter':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="4" cy="7" r="1.5" />
            <circle cx="8" cy="5" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="14" cy="8" r="1.5" />
            <circle cx="16" cy="13" r="1.5" />
            <circle cx="6" cy="14" r="1.5" />
          </svg>
        );
      case '3d-bar':
      case '3d-scatter':
      case '3d-surface':
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2,2 L2,16 L18,16" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4,14 L4,8 L7,10 L7,14 Z" />
            <path d="M9,14 L9,6 L12,8 L12,14 Z" />
            <path d="M14,14 L14,4 L17,6 L17,14 Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2,2 L2,16 L18,16" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4,14 C8,10 12,14 16,10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  // Filter and sort analyses
  const filteredAnalyses = analyses
    ? analyses
        .filter(analysis => {
          // Filter by search term
          const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (analysis.description && analysis.description.toLowerCase().includes(searchTerm.toLowerCase()));
          
          // Filter by chart type
          const matchesType = filterType === 'all' || 
                             (filterType === '2d' && analysis.chartType.startsWith('2d-')) ||
                             (filterType === '3d' && analysis.chartType.startsWith('3d-'));
          
          return matchesSearch && matchesType;
        })
        .sort((a, b) => {
          // Sort by field
          let aValue = a[sortField];
          let bValue = b[sortField];
          
          // Handle special cases
          if (sortField === 'createdAt' || sortField === 'updatedAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }
          
          // Compare values
          if (aValue < bValue) {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
        })
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          My Analyses
        </h2>
        <Link
          to="/analyses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Analysis
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center">
            <label htmlFor="filterType" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
              Type:
            </label>
            <select
              id="filterType"
              className="border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white py-2 px-3"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Charts</option>
              <option value="2d">2D Charts</option>
              <option value="3d">3D Charts</option>
            </select>
          </div>
        </div>
        {selectedAnalyses.length > 0 && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleBatchDelete}
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected ({selectedAnalyses.length})
          </button>
        )}
      </div>

      {/* Analysis List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-300">
          {error}
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No analyses found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first analysis.'}
          </p>
          {!searchTerm && filterType === 'all' && (
            <div className="mt-6">
              <Link
                to="/analyses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Analysis
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      checked={selectedAnalyses.length === filteredAnalyses.length && filteredAnalyses.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    <span>Title</span>
                    {sortField === 'title' && (
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' 
                            ? "M5 15l7-7 7 7" 
                            : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Chart Type
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    <span>Created</span>
                    {sortField === 'createdAt' && (
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={
                          sortDirection === 'asc' 
                            ? "M5 15l7-7 7 7" 
                            : "M19 9l-7 7-7-7"
                        } />
                      </svg>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAnalyses.map((analysis) => (
                <tr key={analysis._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={selectedAnalyses.includes(analysis._id)}
                        onChange={() => handleSelectAnalysis(analysis._id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          <Link to={`/analyses/${analysis._id}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                            {analysis.title}
                          </Link>
                        </div>
                        {analysis.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {analysis.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-gray-500 dark:text-gray-400 mr-2">
                        {getChartTypeIcon(analysis.chartType)}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {analysis.chartType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(analysis.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/analyses/${analysis._id}`}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        View
                      </Link>
                      <Link
                        to={`/analyses/${analysis._id}/edit`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeleteAnalysis(analysis._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnalysisList;
