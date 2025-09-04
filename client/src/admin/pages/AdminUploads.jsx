import React from "react";
import { FaDownload, FaTrashAlt, FaChartBar } from "react-icons/fa";

export default function AdminUploads() {
  const uploads = [
    {
      id: 1,
      fileName: "sales_data.xlsx",
      uploadedBy: "Keshav Singh (keshav@example.com)",
      uploadedAt: "2025-07-29",
      totalRows: 150,
      totalCols: 8,
    },
    {
      id: 2,
      fileName: "inventory_2025.xlsx",
      uploadedBy: "Neha Sharma (neha@example.com)",
      uploadedAt: "2025-07-30",
      totalRows: 90,
      totalCols: 6,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Uploaded Files
      </h2>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Uploaded By</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Rows</th>
              <th className="px-4 py-3">Columns</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((file) => (
              <tr
                key={file.id}
                className="border-b dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{file.fileName}</td>
                <td className="px-4 py-3">{file.uploadedBy}</td>
                <td className="px-4 py-3">{file.uploadedAt}</td>
                <td className="px-4 py-3">{file.totalRows}</td>
                <td className="px-4 py-3">{file.totalCols}</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800" title="Download">
                    <FaDownload />
                  </button>
                  <button className="text-green-600 hover:text-green-800" title="View Chart">
                    <FaChartBar />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Delete">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
