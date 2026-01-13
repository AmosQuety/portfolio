import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWifi, FaSatellite, FaSignal, FaFlask, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const ConnectivitySlider = ({ connection, setConnection }) => {
  const { activeLens } = usePortfolio();
  const [isMinimized, setIsMinimized] = useState(true); // Default to minimized on mobile

  useEffect(() => {
    if (activeLens === 'resilient') {
      setIsMinimized(false);
    }
  }, [activeLens]);

  const modes = [
    { id: 'offline', label: 'Satellite', icon: FaSatellite, desc: 'Offline' },
    { id: 'slow', label: '2G/Edge', icon: FaSignal, desc: 'Resilient' },
    { id: 'fast', label: 'Fiber', icon: FaWifi, desc: 'High Band' },
  ];

  const activeMode = modes.find(m => m.id === connection);

  return (
    /* Change: Removed 'hidden xl:block'. Added z-index higher than content but lower than Chat */
    <div className="fixed bottom-6 left-6 z-[90]">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* --- MINIMIZED STATUS PILL (Responsive) --- */
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-2xl hover:border-cyan-500/50 transition-colors"
          >
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <activeMode.icon className="text-cyan-400 text-xs" />
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {activeMode.label}
            </span>
            <FaChevronUp className="text-[10px] text-slate-500" />
          </motion.button>
        ) : (
          /* --- EXPANDED RESILIENCE LAB (Responsive) --- */
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            /* Adjusted width for mobile (w-64) vs desktop */
            className="bg-slate-900/98 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl w-[260px] sm:w-56 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <FaFlask className="animate-pulse" />
                Resilience Lab
              </h4>
              <button 
                onClick={() => setIsMinimized(true)}
                className="text-slate-500 hover:text-white p-1"
              >
                <FaChevronDown className="text-xs" />
              </button>
            </div>
            
            <p className="text-[9px] text-slate-400 mb-4 leading-tight">
              Test how my code adapts to network constraints.
            </p>

            <div className="space-y-1.5">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setConnection(mode.id);
                    // On very small screens, minimize after selection to clear view
                    if (window.innerWidth < 640) setIsMinimized(true);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all ${
                    connection === mode.id 
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                      : 'bg-slate-800/50 border-transparent text-slate-500'
                  }`}
                >
                  <mode.icon className="text-sm" />
                  <div className="text-left">
                    <p className="text-xs font-bold">{mode.label}</p>
                    <p className="text-[9px] opacity-60 leading-none">{mode.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-500">
               <span>Mode: {connection}</span>
               <span className="text-cyan-800">NABASA-OS v2.6</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectivitySlider;