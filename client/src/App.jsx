<<<<<<< HEAD
import './App.css'

function App() {

  return (
    <>
     <h1 className='bg-amber-600 text-4xl text-white'>Excel sheet</h1>
     <div className='animate-spin text-7xl'>+</div>
    </>
  )
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import AdminRoutes from "./admin/AdminRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* User Side */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
        <ToastContainer position="top-right" theme="colored" />
      </Layout>
    </Router>
  );
>>>>>>> 3aa6953d9b7f40763de79664e18d5fedcfacc8e6
}

export default App
