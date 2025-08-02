    // src/admin/pages/AdminMessages.jsx

import React from "react";

export default function AdminMessages() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Admin Messages</h2>
      <p className="text-gray-600">All messages submitted via the contact form will appear here.</p>

      {/* Placeholder for messages list */}
      <div className="mt-6 bg-white p-6 rounded shadow">
        <p className="text-center text-gray-400">No messages yet.</p>
      </div>
    </div>
  );
}
