import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RecentAnalysisCard = ({ analysis }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Function to get chart icon based on chart type
  const getChartIcon = () => {
    if (analysis.chartType.includes('3d')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (analysis.chartType.includes('bar')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
          />
        </svg>
      );
    } else if (analysis.chartType.includes('line')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h8a1 1 0 100-2H3zm10 5a1 1 0 102 0v-5a1 1 0 00-1-1H9a1 1 0 000 2h2.586l-4.293 4.293a1 1 0 001.414 1.414L13 13.414V16z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (analysis.chartType.includes('pie')) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"
          />
          <path
            d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  // Function to get color based on chart type
  const getColorClass = () => {
    if (analysis.chartType.includes('3d')) {
      return {
        bg: 'bg-orange-100 dark:bg-orange-800',
        text: 'text-orange-500 dark:text-orange-100',
      };
    } else if (analysis.chartType.includes('bar')) {
      return {
        bg: 'bg-blue-100 dark:bg-blue-800',
        text: 'text-blue-500 dark:text-blue-100',
      };
    } else if (analysis.chartType.includes('line')) {
      return {
        bg: 'bg-green-100 dark:bg-green-800',
        text: 'text-green-500 dark:text-green-100',
      };
    } else if (analysis.chartType.includes('pie')) {
      return {
        bg: 'bg-purple-100 dark:bg-purple-800',
        text: 'text-purple-500 dark:text-purple-100',
      };
    } else {
      return {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-500 dark:text-gray-300',
      };
    }
  };

  const colorClasses = getColorClass();

  return (
    <Link
      to={`/analyses/${analysis._id}`}
      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <div className={`p-2 ${colorClasses.bg} rounded-md ${colorClasses.text}`}>
            {getChartIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {analysis.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {analysis.chartType} • {analysis.fileName || 'Unknown file'}
          </p>
        </div>
        <div className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
          {formatDate(analysis.createdAt)}
        </div>
      </div>
    </Link>
  );
};

export default RecentAnalysisCard;
