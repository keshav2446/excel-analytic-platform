import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaUpload, FaUsersCog } from "react-icons/fa";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
      pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-5 shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Admin Panel
      </h2>

      <nav className="space-y-2">
        <Link to="/admin/dashboard" className={linkStyle("/admin/dashboard")}>
          <FaChartLine /> Dashboard
        </Link>

        <Link to="/admin/uploads" className={linkStyle("/admin/uploads")}>
          <FaUpload /> Uploads
        </Link>

        <Link to="/admin/users" className={linkStyle("/admin/users")}>
          <FaUsersCog /> Users
        </Link>

        <Link to="/admin/analytics" className={linkStyle("/admin/analytics")}>
          📊 Analytics
        </Link>

        <Link to="/admin/messages" className={linkStyle("/admin/messages")}>
          ✉️ Messages
        </Link>
      </nav>
    </aside>
  );
}
