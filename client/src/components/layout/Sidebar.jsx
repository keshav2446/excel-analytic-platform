import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setActiveTab } from '../../store/slices/uiSlice';

const Sidebar = ({ isOpen, isMobile }) => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
      tab: 'dashboard',
    },
    {
      name: 'Upload',
      path: '/upload',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
      ),
      tab: 'upload',
    },
    {
      name: 'My Files',
      path: '/files',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      tab: 'files',
    },
    {
      name: 'Analyses',
      path: '/analyses',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
          <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
        </svg>
      ),
      tab: 'analyses',
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
      tab: 'profile',
    },
  ];

  // Admin-only navigation items
  const adminItems = [
    {
      name: 'Users',
      path: '/admin/users',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      tab: 'admin-users',
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      tab: 'admin-analytics',
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      ),
      tab: 'admin-settings',
    },
  ];

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  return (
    <aside
      className={`z-20 flex-shrink-0 ${
        isOpen ? 'block' : 'hidden'
      } w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block`}
    >
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <a
          className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
          href="#"
        >
          Excel Analytics
        </a>
        <ul className="mt-6">
          {navItems.map((item) => (
            <li className="relative px-6 py-3" key={item.tab}>
              {activeTab === item.tab && (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              )}
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                    isActive
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`
                }
                onClick={() => handleTabChange(item.tab)}
              >
                {item.icon}
                <span className="ml-4">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        {isAdmin && (
          <>
            <hr className="my-4 dark:border-gray-700" />
            <h6 className="px-6 text-xs font-medium text-gray-600 uppercase dark:text-gray-400">
              Admin
            </h6>
            <ul className="mt-3">
              {adminItems.map((item) => (
                <li className="relative px-6 py-3" key={item.tab}>
                  {activeTab === item.tab && (
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  )}
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
                        isActive
                          ? 'text-gray-800 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`
                    }
                    onClick={() => handleTabChange(item.tab)}
                  >
                    {item.icon}
                    <span className="ml-4">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
