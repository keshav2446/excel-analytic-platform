import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../store/slices/uiSlice';

const Notification = ({ id, type = 'info', message, duration = 5000 }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-dismiss notification after duration
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, id, duration]);

  const handleDismiss = () => {
    dispatch(removeNotification(id));
  };

  // Define styles based on notification type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-800',
          border: 'border-green-500',
          text: 'text-green-800 dark:text-green-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-800',
          border: 'border-red-500',
          text: 'text-red-800 dark:text-red-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-800',
          border: 'border-yellow-500',
          text: 'text-yellow-800 dark:text-yellow-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-800',
          border: 'border-blue-500',
          text: 'text-blue-800 dark:text-blue-100',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow-lg border-l-4 ${styles.bg} ${styles.border} animate-fade-in-right`}
      role="alert"
    >
      <div className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 ${styles.text}`}>
        {styles.icon}
      </div>
      <div className={`ml-3 text-sm font-normal ${styles.text}`}>{message}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 ${styles.bg} ${styles.text} rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:hover:bg-gray-700`}
        aria-label="Close"
        onClick={handleDismiss}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
