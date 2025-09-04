import { FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function AdminTopbar() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
        Welcome Admin
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          title="Toggle theme"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md text-sm transition"
          title="Logout"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
}
