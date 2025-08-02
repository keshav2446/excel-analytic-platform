// src/admin/pages/AdminUsers.jsx

import React from "react";

export default function AdminUsers() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <p className="text-gray-600">All registered users will be listed and managed here.</p>

      {/* Placeholder for user table */}
      <div className="mt-6 bg-white p-6 rounded shadow">
        <p className="text-center text-gray-400">No users available yet.</p>
      </div>
    </div>
  );
}
