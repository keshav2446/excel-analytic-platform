import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserExcelFiles } from '../../store/slices/excelSlice';
import { getUserAnalyses } from '../../store/slices/analysisSlice';
import StatCard from './StatCard';
import RecentFileCard from './RecentFileCard';
import RecentAnalysisCard from './RecentAnalysisCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files, loading: filesLoading } = useSelector((state) => state.excel);
  const { analyses, loading: analysesLoading } = useSelector((state) => state.analysis);

  useEffect(() => {
    // Fetch user's files and analyses when component mounts
    dispatch(getUserExcelFiles());
    dispatch(getUserAnalyses());
  }, [dispatch]);

  // Get recent files and analyses (last 5)
  const recentFiles = [...files].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentAnalyses = [...analyses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        Welcome back, {user?.firstName || 'User'}!
      </h2>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Files"
          value={files.length}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Total Analyses"
          value={analyses.length}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="purple"
        />
        <StatCard
          title="2D Charts"
          value={analyses.filter(a => a.chartType.includes('2d')).length}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h8a1 1 0 100-2H3zm10 5a1 1 0 102 0v-5a1 1 0 00-1-1H9a1 1 0 000 2h2.586l-4.293 4.293a1 1 0 001.414 1.414L13 13.414V15z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="green"
        />
        <StatCard
          title="3D Charts"
          value={analyses.filter(a => a.chartType.includes('3d')).length}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          }
          color="orange"
        />
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Recent Files */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              Recent Files
            </h4>
            <Link
              to="/files"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden mb-4">
            {filesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : recentFiles.length > 0 ? (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <RecentFileCard key={file._id} file={file} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
                <Link
                  to="/upload"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Upload your first file
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              Recent Analyses
            </h4>
            <Link
              to="/analyses"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden mb-4">
            {analysesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <RecentAnalysisCard key={analysis._id} analysis={analysis} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No analyses created yet</p>
                <Link
                  to="/files"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Create your first analysis
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
        <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
          Quick Actions
        </h4>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Link
            to="/upload"
            className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-gray-700 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">Upload File</span>
          </Link>
          <Link
            to="/files"
            className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">Browse Files</span>
          </Link>
          <Link
            to="/analyses"
            className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-gray-700 rounded-lg hover:bg-green-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">View Analyses</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg hover:bg-yellow-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
