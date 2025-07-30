// src/components/Layout.jsx
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BackToHomeButton from "./BackToHomeButton";

export default function Layout({ children }) {
  const location = useLocation();
  const path = location.pathname;

  const hideNavbarPaths = ["/userlogin", "/adminlogin", "/register", "/dashboard"];
  const showBackButtonPaths = ["/userlogin", "/adminlogin", "/register", "/dashboard"];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!hideNavbarPaths.includes(path) && <Navbar />}
      {showBackButtonPaths.includes(path) && <BackToHomeButton />}
      <main className="pt-16">{children}</main>
    </div>
  );
}
