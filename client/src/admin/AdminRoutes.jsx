import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUploads from "./pages/AdminUploads";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminMessages from "./pages/AdminMessages";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="uploads" element={<AdminUploads />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/uploads" element={<AdminUploads />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        




  
      </Route>
    </Routes>
  );
}
