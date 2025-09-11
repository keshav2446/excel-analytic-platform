import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 flex flex-col">
        <AdminTopbar />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
