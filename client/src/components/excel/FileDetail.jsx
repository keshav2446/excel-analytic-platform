import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getExcelFileById, deleteExcelFile } from '../../store/slices/excelSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const FileDetail = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentFile, loading, error } = useSelector((state) => state.excel);
  
  const [activeTab, setActiveTab] = useState('preview');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  useEffect(() => {
    if (fileId) {
      dispatch(getExcelFileById(fileId));
    }
  }, [dispatch, fileId]);

  useEffect(() => {
    // When file data is loaded, select all columns by default
    if (currentFile && currentFile.columns && currentFile.columns.length > 0) {
      setSelectedColumns(currentFile.columns);
    }
  }, [currentFile]);

  // Handle file deletion
  const handleDeleteFile = async () => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      try {
        await dispatch(deleteExcelFile(fileId)).unwrap();
        dispatch(addNotification({
          id: uuidv4(),
          type: 'success',
          message: 'File deleted successfully'
        }));
        navigate('/files');
      } catch (error) {
        dispatch(addNotification({
          id: uuidv4(),
          type: 'error',
          message: error.message || 'Failed to delete file'
        }));
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter data based on search term
  const filteredData = currentFile?.data?.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handle column selection
  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  // Handle select all columns
  const handleSelectAllColumns = () => {
    if (selectedColumns.length === currentFile?.columns?.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns([...currentFile.columns]);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error loading file</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <div className="mt-6">
            <Link
              to="/files"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back to Files
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render if file not found
  if (!currentFile) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">File not found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The file you're looking for doesn't exist or has been deleted.</p>
          <div className="mt-6">
            <Link
              to="/files"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back to Files
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      {/* File Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-md text-purple-500 dark:text-purple-100 mr-4">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{currentFile.fileName}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Uploaded {formatDate(currentFile.createdAt)}
          </p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-3">
          <Link
            to={`/analyses/new?fileId=${fileId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Create Analysis
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={handleDeleteFile}
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete File
          </button>
        </div>
      </div>

      {/* File Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">File Size</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {currentFile.fileSize ? `${(currentFile.fileSize / 1024).toFixed(2)} KB` : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Columns</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {currentFile.columns?.length || 0}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rows</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {currentFile.data?.length || 0}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'preview'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('preview')}
          >
            Data Preview
          </button>
          <button
            className={`${
              activeTab === 'columns'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('columns')}
          >
            Column Management
          </button>
          <button
            className={`${
              activeTab === 'analyses'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('analyses')}
          >
            Related Analyses
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'preview' && (
        <div>
          {/* Search and Pagination Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
            <div className="relative">
              <input
                type="text"
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="rowsPerPage" className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  Rows:
                </label>
                <select
                  id="rowsPerPage"
                  className="border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white py-1 px-2"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            {currentFile.data && currentFile.data.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {currentFile.columns && currentFile.columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {currentFile.columns && currentFile.columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        >
                          {row[column] !== undefined ? String(row[column]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No data available in this file.</p>
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Showing {filteredData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
            {searchTerm && ` (filtered from ${currentFile.data?.length || 0} total entries)`}
          </div>
        </div>
      )}

      {activeTab === 'columns' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Column Management</h3>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={handleSelectAllColumns}
            >
              {selectedColumns.length === currentFile.columns?.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFile.columns && currentFile.columns.map((column, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedColumns.includes(column)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handleColumnToggle(column)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnToggle(column)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{column}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {/* Display column data type and stats if available */}
                  Data type: {getColumnDataType(currentFile.data, column)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analyses' && (
        <div>
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No analyses yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first analysis with this file.</p>
            <div className="mt-6">
              <Link
                to={`/analyses/new?fileId=${fileId}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Analysis
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to determine column data type
const getColumnDataType = (data, column) => {
  if (!data || data.length === 0) return 'Unknown';
  
  // Get the first non-null value
  const sampleValue = data.find(row => row[column] !== null && row[column] !== undefined)?.[column];
  
  if (sampleValue === undefined) return 'Empty';
  
  if (typeof sampleValue === 'number') return 'Number';
  if (!isNaN(Number(sampleValue))) return 'Number (as string)';
  
  // Check if it's a date
  const dateValue = new Date(sampleValue);
  if (!isNaN(dateValue) && dateValue.toString() !== 'Invalid Date') return 'Date';
  
  return 'Text';
};

export default FileDetail;
