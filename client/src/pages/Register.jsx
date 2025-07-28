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
      ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white"
      : "bg-gradient-to-br from-white via-blue-100 to-blue-200 text-gray-900"
  }`}
>

      {/* Toggle Theme */}
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
  className={`w-full max-w-lg p-8 rounded-2xl shadow-2xl backdrop-blur-md ${
    isDark
      ? "bg-white/10 text-white"
      : "bg-white border border-blue-200 text-gray-900"
  }`}
>
  <div className="flex justify-center items-center mb-4">
    <FaUserCircle className="text-4xl text-blue-300" />
  </div>
  <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
    : "bg-blue-50 border border-blue-200"
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
    : "bg-blue-50 border border-blue-200"
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
                isDark ? "bg-white/20 border border-white/30 text-white" : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          {/* Role */}
          
          <div>
  <label className="text-sm text-blue-800 dark:text-white">Role</label>

  <select
    name="role"
    onChange={handleChange}
  className="w-full mt-1 p-2 rounded-lg border dark:border-white/30 border-gray-300 
             bg-white dark:bg-gray-800 text-black dark:text-white 
             outline-none focus:ring-2 focus:ring-blue-500 
             appearance-none"
  >
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
  : "bg-blue-50 border border-blue-200"

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
                isDark ? "bg-white/20 border border-white/30 text-white" : "bg-purple-50 border border-purple-200"
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
    : "bg-blue-50 border border-blue-200"
}`}

              required
            />
            <span
             className={`absolute right-3 top-[38px] text-lg cursor-pointer ${
  isDark ? "text-white/80" : "text-blue-500"
}`}

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
                isDark ? "bg-white/20 border border-white/30 text-white" : "bg-purple-50 border border-purple-200"
              }`}
              required
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className={`w-full font-bold py-2 rounded-lg transition ${
  isDark
    ? "bg-white text-blue-700 hover:bg-blue-100"
    : "bg-blue-600 text-white hover:bg-blue-700"
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
  isDark ? "text-white" : "text-blue-800"
}`}

          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
