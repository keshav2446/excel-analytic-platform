import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RecentFileCard = ({ file }) => {
  // Function to format the date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Function to get file icon based on file type
  const getFileIcon = () => {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <Link
      to={`/files/${file._id}`}
      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-md text-purple-500 dark:text-purple-100">
            {getFileIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.fileName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {file.columns?.length || 0} columns • {file.data?.length || 0} rows
          </p>
        </div>
        <div className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
          {formatDate(file.createdAt)}
        </div>
      </div>
    </Link>
  );
};

export default RecentFileCard;
