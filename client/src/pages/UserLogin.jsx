import { useState } from "react";
import { FaUserAlt, FaSun, FaMoon } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import SocialLogin from "../components/SocialLogin";

export default function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User login form data:", form);
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-blue-900 via-slate-900 to-blue-800 text-white"
          : "bg-gradient-to-br from-white via-blue-100 to-gray-100 text-gray-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`absolute top-6 right-6 text-xl p-2 rounded-full shadow ${
          isDark ? "bg-white/10 text-white" : "bg-blue-200 text-blue-800"
        }`}
        title="Toggle Theme"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </button>

      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md ${
          isDark
            ? "bg-white/10 text-white"
            : "bg-white border border-blue-200 text-gray-900"
        }`}
      >
        <div className="flex justify-center items-center mb-4">
          <FaUserAlt className="text-4xl text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">User Login</h2>
        <p className="text-center text-sm mb-6">
          Login to access your dashboard and insights
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className={`w-full mt-1 p-2 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-blue-50 border border-blue-200"
              }`}
              required
            />
          </div>

          <div className="relative">
            <label className="text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className={`w-full mt-1 p-2 pr-10 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-blue-50 border border-blue-200"
              }`}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-lg text-gray-400 cursor-pointer"
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </span>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-2 rounded-lg transition ${
              isDark
                ? "bg-white text-blue-700 hover:bg-blue-100"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Login
          </button>
          <SocialLogin />
        </form>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className={`underline font-semibold ${
              isDark ? "text-white" : "text-blue-800"
            }`}
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
