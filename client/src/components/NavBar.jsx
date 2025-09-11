// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = JSON.parse(atob(token?.split(".")[1] || "e30="))?.email;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 20);
    setLastScrollY(currentScrollY);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleLogin = () => setIsLoginOpen(!isLoginOpen);

  const handleLoginRedirect = (role) => {
    if (role === "user") navigate("/userlogin");
    else if (role === "admin") navigate("/adminlogin");
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`w-full fixed top-0 z-50 px-4 py-3 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } backdrop-blur-sm bg-white/10 dark:bg-black/20 border-b border-white/10`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-white">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-wide cursor-pointer hover:text-purple-300 transition"
        >
          Excel Analytics Platform
        </div>

        {/* Links */}
        <div className="hidden md:flex space-x-6 text-lg font-semibold">
          <button onClick={() => navigate("/")} className="hover:text-purple-300">Home</button>
          <button onClick={() => navigate("/about")} className="hover:text-purple-300">About</button>
          <button onClick={() => navigate("/contact")} className="hover:text-purple-300">Contact</button>
          <button onClick={() => navigate("/dashboard")} className="hover:text-purple-300">Dashboard</button>
        </div>

        <div className="flex items-center gap-3 relative">

          {!token ? (
            <div className="relative">
              <button
                onClick={toggleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
              >
                Login
              </button>

              {isLoginOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded shadow-lg z-20">
                  <button
                    onClick={() => handleLoginRedirect("user")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    User
                  </button>
                  <button
                    onClick={() => handleLoginRedirect("admin")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline text-purple-200">{userEmail}</span>
              <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
      >
        Logout
      </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
