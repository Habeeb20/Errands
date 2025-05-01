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
import ErrandDashboard from './Pages/Errander/ErranderDashboard';
import Errander from './components/errander/Errander';
import Profile from './Pages/Errander/Profile';
import DashboardUser from './Pages/user/DashboardUser';
import ErrandersInDashboard from './Pages/user/ErrandersInDashboard';
import ProfileUser from './Pages/user/ProfileUser';
import MyErrander from './Pages/Errander/MyErrander';
import MapWithCar from './Pages/MapWithCar';
import TelephoneBooking from './components/admin/TelephoneBooking';
import Telephone from './components/others/Telephone';
import TelephoneErrands from './Pages/Errander/TelephoneErrands';

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
          <Route path="/profile/:slug" element={<Errander />} />



          <Route path="/erranderdashboard" element={<ErrandDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myerrands" element={<MyErrander />} />
          
          <Route path="/telephone-errands" element={<TelephoneErrands />} />



          <Route path="/userdashboard" element={<DashboardUser />} />
          <Route path="/errandersIndashboard" element={<ErrandersInDashboard />} />
          <Route path="/userprofile" element={<ProfileUser />} />
          

          <Route path="/telephone-booking" element={<Telephone />} />



          <Route path='/mapwithcar'  element={<MapWithCar />} />
        
        </Routes>
      </Router>
      
    </div>
  )
}

export default App
