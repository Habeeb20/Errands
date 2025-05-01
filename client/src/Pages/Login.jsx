import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import loginImage from "../assets/image (1).png";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get("redirect");

  const getDashboardRoute = (role) => {
    if (role === "errander" || role === "messenger") return "/erranderdashboard";
    return "/userdashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      const { token, role, message } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", JSON.stringify(role));

      toast.success(message || "Login successful! Redirecting...");

      setTimeout(() => {
        navigate(redirect || getDashboardRoute(role));
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={loading}
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={loading}
                    aria-required="true"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Login"
                  )}
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
                loading="lazy"
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