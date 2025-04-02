import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import loginImage from "../assets/image (1).png"; 
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Component to handle scroll animation
const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
    // Add your login logic here
  };

  return (
    <>
    <Navbar />
       <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <AnimatedSection>
      <h1 className="text-center font-bold text-2xl">Login</h1>
        <div className="max-w-4xl h-84 w-full bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden">
    
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8">
   
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or username
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="James Johnson"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="20"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition duration-300"
              >
                Login
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          {/* Image Section */}
          <div className="w-full md:w-1/2 hidden md:block">
            <img
              src={loginImage}
              alt="Person working on computer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </AnimatedSection>
    </div>
    <Footer />
    </>
 
  );
};

export default Login;