/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <motion.div
      className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center text-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="glitch-container">
        <div className="glitch" data-text="404">
          404
        </div>
      </div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-black mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Page Not Found
      </motion.h1>

      <motion.p
        className="text-black mt-4 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        It seems you've navigated to a route that doesn't exist in this
        application's memory. Let's get you back on track.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-3 mt-10 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300
                     bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600
                     hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1"
        >
          <FaHome />
          <span>Return to Home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default PageNotFound;
