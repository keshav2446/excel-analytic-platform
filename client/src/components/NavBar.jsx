// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);
//   const [isDesktopLoginOpen, setIsDesktopLoginOpen] = useState(false);

//   const navigate = useNavigate();

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
//   const toggleMobileLogin = () => setIsMobileLoginOpen(!isMobileLoginOpen);
//   const toggleDesktopLogin = () => setIsDesktopLoginOpen(!isDesktopLoginOpen);

//   const handleLoginRedirect = (role) => {
//     if (role === "user") navigate("/userlogin");
//     else if (role === "admin") navigate("/adminlogin");

//     setIsMobileMenuOpen(false);
//     setIsMobileLoginOpen(false);
//     setIsDesktopLoginOpen(false);
//   };

//   return (
//     <nav className="w-full fixed top-0 z-50 bg-transparent px-4 py-3">
//       <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg px-6 py-3 flex items-center justify-between text-black">
//         {/* Logo */}
//         <div
//           className="text-2xl font-bold cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           Excel Analytic Platform
//         </div>

//         {/* Desktop Nav */}
//         <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto text-xl font-bold">
//           <button onClick={() => navigate("/")} className="hover:text-blue-500 w-1/3 text-center">
//             Home
//           </button>
//           <button onClick={() => navigate("/about")} className="hover:text-blue-500 w-1/3 text-center">
//             About
//           </button>
//           <button onClick={() => navigate("/contact")} className="hover:text-blue-500 w-1/3 text-center">
//             Contact
//           </button>
//         </div>

//         {/* Desktop Login */}
//         <div className="hidden md:block relative">
//           <button
//             onClick={toggleDesktopLogin}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1"
//           >
//             Login <span className="text-sm">{isDesktopLoginOpen ? "▾" : "▴"}</span>
//           </button>

//           {isDesktopLoginOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white text-black border border-gray-200 rounded shadow-lg z-10">
//               <button
//                 onClick={() => handleLoginRedirect("user")}
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//               >
//                 User
//               </button>
//               <button
//                 onClick={() => handleLoginRedirect("admin")}
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//               >
//                 Admin
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Mobile Hamburger */}
//         <div className="md:hidden">
//           <button onClick={toggleMobileMenu} className="text-2xl">☰</button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden mt-3 px-2 text-lg font-semibold space-y-3 bg-white rounded-xl shadow-lg py-4">
//           <button onClick={() => navigate("/")} className="block w-full text-left px-4 hover:text-blue-500">
//             Home
//           </button>
//           <button onClick={() => navigate("/about")} className="block w-full text-left px-4 hover:text-blue-500">
//             About
//           </button>
//           <button onClick={() => navigate("/contact")} className="block w-full text-left px-4 hover:text-blue-500">
//             Contact
//           </button>

//           <div className="px-4">
//             <button
//               onClick={toggleMobileLogin}
//               className="w-full text-left flex justify-between items-center hover:text-blue-500"
//             >
//               Login <span className="text-sm">{isMobileLoginOpen ? "▾" : "▴"}</span>
//             </button>

//             {isMobileLoginOpen && (
//               <div className="pl-4 mt-2 space-y-2">
//                 <button
//                   onClick={() => handleLoginRedirect("user")}
//                   className="block text-left w-full hover:text-blue-500"
//                 >
//                   User
//                 </button>
//                 <button
//                   onClick={() => handleLoginRedirect("admin")}
//                   className="block text-left w-full hover:text-blue-500"
//                 >
//                   Admin
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }












import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLogin = () => setIsLoginOpen(!isLoginOpen);

  const handleLoginRedirect = (role) => {
    if (role === "user") navigate("/userlogin");
    else if (role === "admin") navigate("/adminlogin");
    setIsLoginOpen(false);
  };

  return (
    <nav className="w-full fixed top-0 z-50 px-4 py-3 backdrop-blur-sm bg-white/10 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-white">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-wide cursor-pointer hover:text-purple-300 transition duration-300"
        >
          Excel Analytic Platform
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg font-semibold">
          <button onClick={() => navigate("/")} className="hover:text-purple-300 transition">Home</button>
          <button onClick={() => navigate("/about")} className="hover:text-purple-300 transition">About</button>
          <button onClick={() => navigate("/contact")} className="hover:text-purple-300 transition">Contact</button>
          <button onClick={() => navigate("/dashboard")} className="hover:text-purple-300 transition">Dashboard</button>
        </div>

        {/* Login Dropdown */}
        <div className="relative">
          <button
            onClick={toggleLogin}
            className="bg-purple-700 hover:bg-purple-600 transition px-4 py-2 rounded-md shadow-lg text-white font-semibold"
          >
            Login
          </button>

          {isLoginOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded shadow-lg z-20 animate-fade-in">
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
      </div>
    </nav>
  );
}
   