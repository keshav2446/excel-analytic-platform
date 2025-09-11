import React, { useState } from "react";
import { FaTrashAlt, FaSearch, FaUser } from "react-icons/fa";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy user data
  const users = [
    {
      id: 1,
      name: "Keshav Singh",
      email: "keshav@example.com",
      registeredAt: "2025-06-01T10:00:00Z",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      registeredAt: "2025-07-20T14:00:00Z",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        User Management
      </h2>

      <div className="mb-4 flex items-center gap-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm w-full sm:w-1/3"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No users found.</p>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-gray-900 shadow rounded-xl p-4 flex justify-between items-center border border-gray-200 dark:border-gray-800"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Registered on: {new Date(user.registeredAt).toLocaleDateString()}
                </p>
              </div>
              <button className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
