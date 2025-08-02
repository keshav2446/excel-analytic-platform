import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaUpload, FaUsersCog } from "react-icons/fa";

export default function AdminSidebar() {
  const { pathname } = useLocation();

  const linkStyle = (path) =>
    `block px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white ${
      pathname === path ? "bg-blue-500 text-white" : "text-gray-700"
    }`;

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin/dashboard" className={linkStyle("/admin/dashboard")}>
          <FaChartLine className="inline mr-2" />
          Dashboard
        </Link>

        <Link to="/admin/uploads" className={linkStyle("/admin/uploads")}>
  <FaUpload className="inline mr-2" />
  Uploads
</Link>

<Link to="/admin/users" className={linkStyle("/admin/users")}>
  <FaUsersCog className="inline mr-2" />
  Users
</Link>

<Link to="/admin/analytics" className={linkStyle("/admin/analytics")}>
  📊 Analytics
</Link>

<Link to="/admin/messages" className={linkStyle("/admin/messages")}>
  ✉️ Messages
</Link>

     
      </nav>
    </div>
  );
}
