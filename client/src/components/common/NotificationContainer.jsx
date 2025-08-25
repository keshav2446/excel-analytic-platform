import { useSelector } from 'react-redux';
import Notification from './Notification';

const NotificationContainer = () => {
  const { notifications } = useSelector((state) => state.ui);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end space-y-2 max-w-xs">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
