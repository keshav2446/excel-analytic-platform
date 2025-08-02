import React from "react";
import { FaUserFriends, FaFileExcel, FaListOl } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminAnalytics() {
  // Dummy stats
  const stats = {
    totalUsers: 120,
    totalFiles: 85,
    avgRows: 142,
    avgCols: 7,
    monthlyUploads: [5, 12, 9, 15, 20, 24, 10,6,12,20,4,25], 
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Uploads",
        data: stats.monthlyUploads,
        backgroundColor: "#2563eb", 
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Site Analytics Overview
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex items-center gap-4">
          <FaUserFriends className="text-blue-600 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex items-center gap-4">
          <FaFileExcel className="text-green-600 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Uploaded Files</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{stats.totalFiles}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-5 flex items-center gap-4">
          <FaListOl className="text-purple-600 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Avg Rows / Cols</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {stats.avgRows} / {stats.avgCols}
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Uploads per Month</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
