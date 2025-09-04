import React from "react";
import { FaUsers, FaFileUpload, FaEnvelope } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, Admin 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here’s a quick summary of your platform activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-gray-50 dark:bg-gray-900 hover:shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300">
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 p-3 rounded-full text-2xl">
            <FaUsers />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">--</h3>
          </div>
        </div>

        {/* Files Uploaded */}
        <div className="bg-gray-50 dark:bg-gray-900 hover:shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300">
          <div className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 p-3 rounded-full text-2xl">
            <FaFileUpload />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Files Uploaded</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">--</h3>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-50 dark:bg-gray-900 hover:shadow-lg border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300">
          <div className="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 p-3 rounded-full text-2xl">
            <FaEnvelope />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Messages</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">--</h3>
          </div>
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div className="mt-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Analytics Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Charts and graphs will be displayed here soon.
        </p>
        <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-sm">
          📊 No data available
        </div>
      </div>
    </div>
  );
}
