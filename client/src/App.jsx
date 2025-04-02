import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './Pages/Home';
import { Toaster } from "sonner";
import Login from './Pages/Login';
import Signup from './Pages/Signup';

const App = () => {
  return (
    <div>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
      
    </div>
  )
}

export default App
