import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaPlay, FaTimes, FaCopy, FaCheck } from 'react-icons/fa';

const PyCodeCommenterSandbox = ({ onClose }) => {
  const [inputCode, setInputCode] = useState('def calculate_yield(rainfall, area):\n    """Example function"""\n    return rainfall * area * 0.8');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const generateDocstring = () => {
    setIsProcessing(true);
    setOutput('');
    
    // Simulate API/Algorithm latency
    setTimeout(() => {
      const functionMatch = inputCode.match(/def\s+(\w+)\s*\((.*?)\):/);
      if (!functionMatch) {
        setOutput('# Error: Could not parse function signature.\n# Please ensure you use standard "def func(args):" syntax.');
        setIsProcessing(false);
        return;
      }

      const funcName = functionMatch[1];
      const args = functionMatch[2].split(',').map(a => a.trim()).filter(a => a);
      
      const capitalizedFunc = funcName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      let docstring = `    """${capitalizedFunc}.\n\n    Detailed description of what ${funcName} accomplishes goes here.`;
      
      if (args.length > 0) {
        docstring += `\n\n    Args:`;
        args.forEach(arg => {
          docstring += `\n        ${arg} (any): Description for ${arg}.`;
        });
      }
      
      docstring += `\n\n    Returns:\n        any: Description of the return value.\n    """`;
      
      setOutput(docstring);
      setIsProcessing(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex text-white items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#0d1117] border border-slate-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Terminal Header */}
        <div className="bg-[#161b22] p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-500 ml-2">pycodecommenter_sandbox.py</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Input Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col p-4 border-b md:border-b-0 md:border-r border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FaTerminal className="text-cyan-400" /> Python Source
              </label>
              <button 
                onClick={generateDocstring}
                disabled={isProcessing}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-md transition-all flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : <><FaPlay size={8} /> Run Analysis</>}
              </button>
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 bg-transparent text-slate-300 font-mono text-xs sm:text-sm p-4 outline-none resize-none border border-slate-800 rounded-lg focus:border-cyan-500/30 transition-colors"
              placeholder="def my_function(arg1, arg2):..."
            />
          </div>

          {/* Output Area */}
          <div className="flex-1 flex flex-col p-4 bg-black/30">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Generated Docstring (Google Style)
              </label>
              {output && (
                <button 
                  onClick={copyToClipboard}
                  className="text-slate-500 hover:text-cyan-400 p-1 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                </button>
              )}
            </div>
            <div className="flex-1 bg-[#010409] border border-slate-800 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-auto scrollbar-hide">
              {isProcessing ? (
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-3/4 bg-slate-800 animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-slate-800 animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-slate-800 animate-pulse rounded" />
                </div>
              ) : (
                <pre className="text-green-400/90 leading-relaxed whitespace-pre-wrap">
                  {output || '# The generated documentation will appear here...'}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#161b22] border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
          <span className="text-slate-500">Status: <span className={isProcessing ? 'text-yellow-400' : 'text-green-400'}>{isProcessing ? 'Parsing AST...' : 'Ready'}</span></span>
          <span className="text-slate-600">Built for Amos's Portfolio</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default PyCodeCommenterSandbox;
