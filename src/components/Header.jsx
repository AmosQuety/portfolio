// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { usePortfolio } from "../context/PortfolioContext";
import { useConnectivity } from "../context/ConnectivityContext";
import { FaUserTie, FaCode, FaShieldAlt, FaChevronDown, FaChevronUp, FaGlobe, FaWifi, FaDatabase, FaEye, FaTextHeight, FaUniversalAccess, FaTerminal } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";

const HamburgerIcon = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className="text-white focus:outline-none md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      )}
    </svg>
  </button>
);

HamburgerIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const Header = ({ navItems, siteTitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    activeLens, setActiveLens, 
    isHighContrast, toggleHighContrast, 
    isLargeFont, toggleLargeFont,
    isConsoleOpen, toggleConsole
  } = usePortfolio();
  const { isLowDataMode, isOffline, toggleLowDataMode } = useConnectivity();
  const [isLensDropdownOpen, setIsLensDropdownOpen] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const accessRef = useRef(null);

  const lenses = [
    { id: 'recruiter', label: 'Recruiter', icon: FaUserTie, color: 'bg-blue-600', text: 'text-blue-400' },
    { id: 'engineer', label: 'Engineer', icon: FaCode, color: 'bg-cyan-600', text: 'text-cyan-400' },
    { id: 'resilient', label: 'Resilience', icon: FaShieldAlt, color: 'bg-emerald-600', text: 'text-emerald-400' },
  ];

  const activeLensData = lenses.find(l => l.id === activeLens);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleNavLinkClick = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLensDropdownOpen(false);
      }
      if (accessRef.current && !accessRef.current.contains(event.target)) {
        setIsAccessDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 sm:h-20 flex justify-between items-center px-6 lg:px-12 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 z-[155]">
      {/* Site Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {siteTitle}
      </h1>

      {/* Right Side: Desktop Nav + Lens Selector */}
      <div className="flex items-center gap-8">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm lg:text-base font-semibold tracking-wider">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-gray-400 hover:text-white transition-colors duration-300 uppercase"
            >
              {item.text}
            </a>
          ))}
        </nav>

        {/* Desktop Lens Selector */}
        <div className="hidden lg:block relative" ref={dropdownRef}>
          <button
            onClick={() => setIsLensDropdownOpen(!isLensDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg`}
          >
            <activeLensData.icon className={`${activeLensData.text} text-sm`} />
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              {activeLensData.label}
            </span>
            {isLensDropdownOpen ? <FaChevronUp className="text-[10px] text-gray-500" /> : <FaChevronDown className="text-[10px] text-gray-500" />}
          </button>

          <AnimatePresence>
            {isLensDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5"
              >
                {lenses.map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => {
                      setActiveLens(lens.id);
                      setIsLensDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                      activeLens === lens.id 
                        ? `${lens.color} text-white` 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <lens.icon className={activeLens === lens.id ? 'text-white' : lens.text} />
                    <span className="text-xs font-bold uppercase tracking-widest">{lens.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Accessibility Selector */}
        <div className="hidden lg:block relative" ref={accessRef}>
          <button
            onClick={() => setIsAccessDropdownOpen(!isAccessDropdownOpen)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 ${isHighContrast || isLargeFont ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5'} hover:bg-white/10 transition-all duration-300 shadow-lg`}
          >
            <FaUniversalAccess className={isHighContrast || isLargeFont ? 'text-amber-400' : 'text-gray-400'} size={14} />
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              Access Lab
            </span>
          </button>

          <AnimatePresence>
            {isAccessDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1"
              >
                <button
                  onClick={toggleHighContrast}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isHighContrast ? 'bg-amber-500/20 text-white' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaEye className={isHighContrast ? 'text-amber-400' : ''} />
                    <span className="text-xs font-bold uppercase tracking-widest">High Contrast</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${isHighContrast ? 'bg-amber-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isHighContrast ? 'left-5' : 'left-1'}`} />
                  </div>
                </button>

                <button
                  onClick={toggleLargeFont}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isLargeFont ? 'bg-amber-500/20 text-white' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaTextHeight className={isLargeFont ? 'text-amber-400' : ''} />
                    <span className="text-xs font-bold uppercase tracking-widest">Large Text</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${isLargeFont ? 'bg-amber-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isLargeFont ? 'left-5' : 'left-1'}`} />
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop System Console Trigger */}
        <div className="hidden lg:block relative group">
          <button
            onClick={toggleConsole}
            className={`p-2.5 rounded-full border border-white/10 ${isConsoleOpen ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 text-gray-400'} hover:bg-white/10 hover:text-white transition-all duration-300 shadow-lg`}
            title="Open System Console (`)"
          >
            <FaTerminal size={14} />
          </button>
          
          {/* Tooltip hint */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[8px] text-white font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/5 shadow-xl">
            Press ` to toggle
          </div>
        </div>


        {/* Low Data Mode Toggle */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleLowDataMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              isLowDataMode ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'
            }`}
            title="Toggle Low Data Mode"
          >
            <FaDatabase size={12} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {isLowDataMode ? 'Data Saver ON' : 'Data Saver'}
            </span>
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <div className="md:hidden">
          <HamburgerIcon onClick={toggleMobileMenu} isOpen={isMobileMenuOpen} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-2xl shadow-2xl md:hidden flex flex-col p-6 space-y-4 border-t border-white/10 z-[200]"
          >
            {/* Mobile Lens Selector */}
            <div className="pb-4 border-b border-white/10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">Viewing Perspective</p>
              <div className="flex justify-center gap-2">
                {lenses.map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => {
                      setActiveLens(lens.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex flex-col items-center justify-center w-24 py-3 rounded-2xl transition-all duration-300 ${
                      activeLens === lens.id 
                        ? `${lens.color} text-white shadow-lg scale-105` 
                        : 'bg-white/5 text-gray-400 border border-white/5'
                    }`}
                  >
                    <lens.icon className="text-lg mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{lens.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Access Lab */}
            <div className="pb-4 border-b border-white/10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">Access Lab</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleHighContrast}
                  className={`flex flex-col items-center justify-center w-28 py-3 rounded-2xl transition-all duration-300 ${
                    isHighContrast 
                      ? 'bg-amber-500 text-white shadow-lg scale-105' 
                      : 'bg-white/5 text-gray-400 border border-white/5'
                  }`}
                >
                  <FaEye className="text-lg mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">High Contrast</span>
                </button>
                <button
                  onClick={toggleLargeFont}
                  className={`flex flex-col items-center justify-center w-28 py-3 rounded-2xl transition-all duration-300 ${
                    isLargeFont 
                      ? 'bg-amber-500 text-white shadow-lg scale-105' 
                      : 'bg-white/5 text-gray-400 border border-white/5'
                  }`}
                >
                  <FaTextHeight className="text-lg mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Large Text</span>
                </button>
              </div>
            </div>

            {/* Mobile System Interface Toggle */}
            <div className="pt-2">
              <button
                onClick={() => {
                  toggleConsole();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all duration-300 ${
                  isConsoleOpen 
                    ? 'bg-cyan-500 text-white shadow-lg' 
                    : 'bg-white/5 text-gray-400 border border-white/5'
                }`}
              >
                <FaTerminal className="text-lg" />
                <span className="text-xs font-bold uppercase tracking-widest">System Interface</span>
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col items-center space-y-2 pt-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavLinkClick}
                  className="w-full text-center text-gray-400 hover:text-white transition-colors duration-300 text-sm font-bold uppercase tracking-widest py-3 hover:bg-white/5 rounded-xl"
                >
                  {item.text}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Offline Indicator Pill */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-3 z-[200] font-bold border-2 border-slate-900/20"
          >
            <FaWifi className="animate-pulse" />
            <span className="text-sm tracking-tight">Offline Mode: Some features may be limited</span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

Header.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default Header;
