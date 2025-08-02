import React from "react";
import { FaEnvelopeOpenText, FaTrash, FaCheckCircle } from "react-icons/fa";

export default function AdminMessages() {
  const messages = [
    {
      id: 1,
      name: "Keshav Singh",
      email: "keshav@example.com",
      subject: "Support needed",
      message: "I am facing an issue with uploading Excel files.",
      date: "2025-07-30",
      read: false,
    },
    {
      id: 2,
      name: "Neha Sharma",
      email: "neha@example.com",
      subject: "Feature Request",
      message: "Can you add CSV file support?",
      date: "2025-07-31",
      read: true,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Contact Messages
      </h2>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white dark:bg-gray-900 text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg.id}
                className={`border-b dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                  msg.read ? "" : "font-semibold"
                }`}
              >
                <td className="px-4 py-3">{msg.name}</td>
                <td className="px-4 py-3">{msg.email}</td>
                <td className="px-4 py-3">{msg.subject}</td>
                <td className="px-4 py-3 max-w-xs truncate">{msg.message}</td>
                <td className="px-4 py-3">{msg.date}</td>
                <td className="px-4 py-3 flex justify-center gap-2">
                  <button className="text-green-600 hover:text-green-800" title="Mark as Read">
                    <FaCheckCircle />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Delete">
                    <FaTrash />
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
