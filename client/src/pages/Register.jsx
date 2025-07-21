import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import SocialLogin from "../components/SocialLogin";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    role: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("dark");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register form data:", form);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`flex justify-center items-center min-h-screen px-4 transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-white via-purple-100 to-gray-100 text-gray-900"
      }`}
    >
      {/* Toggle Theme */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`absolute top-6 right-6 text-xl p-2 rounded-full shadow ${
          isDark ? "bg-white/10 text-white" : "bg-purple-200 text-purple-800"
        }`}
        title="Toggle Theme"
      >
        {isDark ? <FaSun /> : <FaMoon />}
      </button>

      <div
        className={`w-full max-w-lg p-8 rounded-2xl shadow-2xl backdrop-blur-md ${
          isDark
            ? "bg-white/10 text-white"
            : "bg-white border border-purple-200 text-gray-900"
        }`}
      >
        <div className="flex justify-center items-center mb-4">
          <FaUserCircle className="text-4xl text-purple-300" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* First Name */}
          <div>
            <label className="text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              onChange={handleChange}
              className={`w-full mt-1 p-2 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              onChange={handleChange}
              className={`w-full mt-1 p-2 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          {/* Organization */}
          <div>
            <label className="text-sm">Organization</label>
            <input
              type="text"
              name="organization"
              placeholder="Your company/institute"
              onChange={handleChange}
              className={`w-full mt-1 p-2 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <label className="text-sm">Role</label>
            <select
  name="role"
  onChange={handleChange}
  className={`w-full mt-1 p-2 rounded-lg pr-10 appearance-none outline-none transition
    focus:ring-2 focus:ring-purple-500 focus:border-purple-500
    ${isDark
      ? "bg-purple-950 text-white border border-purple-400"
      : "bg-white text-black border border-gray-300"}
  `}
  required
>
  <option value="">Select Role</option>
  <option value="student">Student</option>
  <option value="analyst">Analyst</option>
  <option value="cxo">CXO</option>
  <option value="data_engineer">Data Engineer</option>
  <option value="data_scientist">Data Scientist</option>
  <option value="devops">DevOps</option>
  <option value="engineer">Engineer</option>
  <option value="full_stack">Full Stack Developer</option>
  <option value="vp">Director / VP</option>
  <option value="product_manager">Product Manager</option>
  <option value="intern">Intern</option>
  <option value="other">Other</option>
</select>

            {/* Custom Arrow */}
            <div className="absolute top-[42px] right-3 pointer-events-none">
              <svg
                className={`w-4 h-4 ${
                  isDark ? "text-white" : "text-gray-700"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm">Username</label>
            <input
              type="text"
              name="username"
              placeholder="john24"
              onChange={handleChange}
              className={`w-full mt-1 p-2 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          {/* Email */}
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
                  : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          {/* Password */}
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
                  : "bg-purple-50 border border-purple-200"
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

          {/* Confirm Password */}
          <div>
            <label className="text-sm">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              onChange={handleChange}
              className={`w-full mt-1 p-2 rounded-lg outline-none ${
                isDark
                  ? "bg-white/20 border border-white/30 text-white"
                  : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full font-bold py-2 rounded-lg transition ${
                isDark
                  ? "bg-white text-purple-700 hover:bg-purple-100"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/userlogin"
            className={`underline font-semibold ${
              isDark ? "text-white" : "text-purple-800"
            }`}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
