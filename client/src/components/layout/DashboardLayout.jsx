import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationContainer from '../common/NotificationContainer';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, darkMode, notifications } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && sidebarOpen) {
        dispatch(toggleSidebar());
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [dispatch, sidebarOpen]);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container px-6 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notifications */}
      <NotificationContainer />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
