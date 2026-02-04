import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaChevronRight, FaExpand, FaCompress, FaMinus, FaTimes } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

export const SystemConsole = () => {
  const { isConsoleOpen, setIsConsoleOpen, activeLens, setActiveLens, toggleHighContrast } = usePortfolio();
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'NABASA-OS [Version 2.6.0]',
    '(c) 2026 Nabasa Amos. All rights reserved.',
    '',
    'Type "help" for available commands.'
  ]);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        e.preventDefault();
        setIsConsoleOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsConsoleOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsConsoleOpen]);

  useEffect(() => {
    if (isConsoleOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConsoleOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd) => {
    const args = cmd.toLowerCase().trim().split(' ');
    const baseCmd = args[0];
    let output = '';

    switch (baseCmd) {
      case 'help':
        output = 'Available commands: help, clear, lens [recruiter|engineer|resilient], contrast, amos, version, exit';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'exit':
        setIsConsoleOpen(false);
        return;
      case 'version':
        output = 'NABASA-OS v2.6.0-stable. Architecture: React 19 + Gemini 3.';
        break;
      case 'amos':
        output = 'Nabasa Amos: Software Engineer. Focus: Resilient AI & Constraint-First Engineering.';
        break;
      case 'lens':
        if (['recruiter', 'engineer', 'resilient'].includes(args[1])) {
          setActiveLens(args[1]);
          output = `Viewing perspective shifted to: ${args[1]}`;
        } else {
          output = 'Usage: lens [recruiter|engineer|resilient]';
        }
        break;
      case 'contrast':
        toggleHighContrast();
        output = 'High contrast mode toggled.';
        break;
      case 'matrix':
        output = 'Wake up, Neo... The Matrix has you.';
        break;
      case 'fullscreen':
        setIsMaximized(!isMaximized);
        output = isMaximized ? 'Window mode activated.' : 'Full-screen mode activated.';
        break;
      default:
        output = `Command not found: ${baseCmd}. Type "help" for assistance.`;
    }

    setHistory(prev => [...prev, `> ${cmd}`, output]);
  };

  const handleSend = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    }
  };

  return (
    <AnimatePresence>
      {isConsoleOpen && (
        <motion.div
          initial={{ opacity: 0, y: isMaximized ? 0 : -20, scale: isMaximized ? 1 : 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isMaximized ? 0 : -20, scale: isMaximized ? 1 : 0.95 }}
          className={`fixed z-[10000] bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 flex flex-col font-mono shadow-2xl transition-all duration-300 ${
            isMaximized 
              ? 'inset-0 rounded-none' 
              : 'top-16 sm:top-20 md:top-24 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-2xl h-[calc(100%-6rem)] sm:h-[500px] rounded-t-2xl sm:rounded-2xl'
          }`}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-4 px-4 py-3 border-b border-cyan-900/40 bg-black/40">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsConsoleOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors flex items-center justify-center text-[6px] text-black group"
              >
                <FaTimes className="opacity-0 group-hover:opacity-100" />
              </button>
              <button 
                onClick={() => setIsConsoleOpen(false)}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors flex items-center justify-center text-[6px] text-black group"
              >
                <FaMinus className="opacity-0 group-hover:opacity-100" />
              </button>
              <button 
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors flex items-center justify-center text-[6px] text-black group"
              >
                {isMaximized ? <FaCompress className="opacity-0 group-hover:opacity-100" /> : <FaExpand className="opacity-0 group-hover:opacity-100" />}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-cyan-400">
              <FaTerminal size={12} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Nabasa-OS_v2.6_Console</span>
            </div>
            
            <div className="ml-auto text-[8px] text-cyan-400 text-slate-500 font-bold uppercase tracking-widest hidden sm:block">
              Root@Portfolio: ~
            </div>
          </div>

          {/* Console Content */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto text-white p-6 space-y-2 scrollbar-hide"
          >
            {history.map((line, i) => (
              <div key={i} className={`text-[10px] sm:text-[12px] md:text-[13px] leading-relaxed ${line.startsWith('>') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                {line}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/40 border-t border-cyan-900/20">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-800 focus-within:border-cyan-500/50 transition-all">
              <FaChevronRight className="text-cyan-500 text-[10px]" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSend}
                className="bg-transparent border-none outline-none text-slate-100 text-xs sm:text-sm w-full font-mono placeholder-slate-700"
                placeholder="system_prompt > _"
                autoFocus
              />
            </div>
            <div className="mt-2 flex justify-between text-cyan-400 items-center px-4">
              <span className="text-[8px] text-slate-600 uppercase tracking-widest">Connection: Secure (SSL/TLS 1.3)</span>
              <span className="text-[8px] text-slate-600 uppercase tracking-widest">ESC to Exit</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
