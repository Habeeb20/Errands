import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Pages/Home';
import { Toaster } from "sonner";
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSignup from './Pages/AdminSignup';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import VerifyEmail from './Pages/VerifyEmail';
import ProfileForm from './Pages/ProfileForm';
const App = () => {
  return (
    <div>
      <Router>
        <Toaster />
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyemail" element={<VerifyEmail />} />
          <Route path="/adminsignup" element={<AdminSignup />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/profileform" element={<ProfileForm />} />
        </Routes>
      </Router>
      
    </div>
  )
}

export default App
