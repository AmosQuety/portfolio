import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaPlay, FaTimes, FaCopy, FaCheck, FaShieldAlt, FaChartPie, FaCheckCircle, FaExclamationTriangle, FaCode } from 'react-icons/fa';

const PyCodeCommenterSandbox = ({ onClose }) => {
  const [inputCode, setInputCode] = useState('def calculate_yield(rainfall: float, area: float) -> float | None:\n    """Calculate total crop yield."""\n    if rainfall < 0: return None\n    return rainfall * area * 0.8');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generate'); // generate, validate, coverage

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    setOutput('');
  }, [activeTab]);

  const runAnalysis = () => {
    setIsProcessing(true);
    setOutput('');
    
    setTimeout(() => {
      const funcRegex = /def\s+(\w+)\s*\(([\s\S]*?)\)(?:\s*->\s*([\w\[\]\s|.,]+))?:/g;
      const matches = [...inputCode.matchAll(funcRegex)];
      
      if (activeTab === 'generate') {
        let newCode = inputCode;
        // Process in reverse to maintain indices
        for (let i = matches.length - 1; i >= 0; i--) {
          const match = matches[i];
          const fullMatch = match[0];
          const funcName = match[1];
          const argsRaw = match[2];
          const returnType = (match[3] || 'None').trim();

          // Title Case Summary: "Show menu."
          let titleName = funcName.replace(/_/g, ' ');
          titleName = titleName.charAt(0).toUpperCase() + titleName.slice(1);
          
          const argsList = argsRaw.split(',').map(a => a.trim()).filter(a => a && a !== 'self');
          
          let docstring = `\n    """${titleName}.\n\n    Executes the function ${funcName}.\n\n    Args:\n`;
          
          if (argsList.length === 0) {
            docstring += `        None.\n`;
          } else {
            argsList.forEach(arg => {
              const [name, type] = arg.split(':').map(p => p.trim());
              docstring += `        ${name} (${type || 'any'}): Description for ${name}.\n`;
            });
          }
          
          docstring += `\n    Returns:\n        ${returnType}: Description of the return value.\n    """`;
          
          const insertIndex = match.index + fullMatch.length;
          newCode = newCode.slice(0, insertIndex) + docstring + newCode.slice(insertIndex);
        }
        setOutput(newCode);
      } 
      else if (activeTab === 'validate') {
        let issues = [];
        let errorCount = 0;
        
        matches.forEach((match, idx) => {
          const funcName = match[1];
          const linesBefore = inputCode.substring(0, match.index).split('\n');
          const lineNum = linesBefore.length;
          
          // Check if followed by docstring
          const codeAfter = inputCode.substring(match.index + match[0].length);
          if (!codeAfter.trim().startsWith('"""')) {
            errorCount++;
            issues.push(`[ERROR] sandbox.py:${lineNum}:${funcName}: Function '${funcName}' has no docstring\n  → Suggestion: Add a docstring with at minimum a summary line`);
          }
        });

        const coverage = matches.length ? Math.round(((matches.length - errorCount) / matches.length) * 100) : 0;
        
        let report = `============================================================\nVALIDATION REPORT\n============================================================\n`;
        report += `File: sandbox.py\nCoverage: ${coverage.toFixed(1)}%\nTotal Issues: ${errorCount}\n  - Errors: ${errorCount}\n  - Warnings: 0\n  - Info: 0\n\n`;
        report += `ISSUES:\n\n` + (issues.length ? issues.join('\n\n') : 'No issues found.');
        setOutput(report);
      } 
      else if (activeTab === 'coverage') {
        let undocumentedCount = 0;
        matches.forEach(match => {
          const codeAfter = inputCode.substring(match.index + match[0].length);
          if (!codeAfter.trim().startsWith('"""')) undocumentedCount++;
        });

        const cov = matches.length ? Math.round(((matches.length - undocumentedCount) / matches.length) * 100) : 0;
        
        let report = `================================================================================\nDOCUMENTATION COVERAGE REPORT\n================================================================================\n`;
        report += `[!!] sandbox.py                                           ${cov.toFixed(1)}%\n`;
        report += `--------------------------------------------------------------------------------\n`;
        report += `TOTAL                                                  ${cov.toFixed(1)}%\n`;
        report += `================================================================================`;
        setOutput(report);
      }
      
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
      className="fixed inset-0 z-[10000] flex text-white items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-[#0b0e14] border border-slate-800/60 w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[95vh] sm:max-h-[90vh]"
      >
        {/* Modern Header */}
        <div className="bg-[#12161d] p-4 sm:px-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900/50 to-transparent">
          <div className="flex items-center gap-4">
             <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-cyan-400 text-xs" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-400">PYCODECOMMENTER_V2.0</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
            <FaTimes size={14} className="text-slate-500 group-hover:text-white" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-[#0d1117] border-b border-white/5 px-4 gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'generate', label: 'Generation', icon: FaPlay },
            { id: 'validate', label: 'Validation', icon: FaCheckCircle },
            { id: 'coverage', label: 'Coverage', icon: FaChartPie },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={10} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Source Input */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <FaCode className="text-cyan-400" /> Python 3.8+ Source
              </label>
              <button 
                onClick={runAnalysis}
                disabled={isProcessing}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                {isProcessing ? 'Processing...' : <><FaPlay size={8} /> Run Analysis</>}
              </button>
            </div>
            <div className="flex-1 relative group bg-black/40 rounded-xl border border-white/5 p-1">
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full h-full bg-transparent text-slate-200 font-mono text-xs sm:text-sm p-4 outline-none resize-none"
                placeholder="def my_function(arg1: int, arg2: str) -> bool: ..."
                spellCheck="false"
              />
              <div className="absolute top-4 right-4 text-[8px] font-bold text-slate-700 pointer-events-none">CODE_INPUT_MDL</div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 bg-slate-900/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {activeTab === 'generate' ? 'Docstring Output' : activeTab === 'validate' ? 'Validation Report' : 'Coverage Metrics'}
              </label>
              {activeTab === 'generate' && output && (
                <button 
                  onClick={copyToClipboard}
                  className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 text-[10px] font-bold"
                >
                  {copied ? <><FaCheck className="text-green-500" /> Copied</> : <><FaCopy /> Copy</>}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-black/60 border border-white/5 rounded-xl p-4 sm:p-6 font-mono text-xs overflow-auto scrollbar-hide max-h-[400px] lg:max-h-none shadow-inner">
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="h-2 w-3/4 bg-slate-800 animate-pulse rounded-full" />
                  <div className="h-2 w-1/2 bg-slate-800 animate-pulse rounded-full" />
                  <div className="h-2 w-full bg-slate-800 animate-pulse rounded-full" />
                  <div className="h-2 w-2/3 bg-slate-800 animate-pulse rounded-full" />
                </div>
              ) : (
                <div className="relative h-full">
                  <pre className={`${activeTab === 'generate' ? 'text-slate-300' : 'text-cyan-400/90'} leading-relaxed whitespace-pre font-mono`}>
                    {output || `# Select a mode and click "Run Analysis" to see ${activeTab} insights...`}
                  </pre>
                  {!output && !isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 space-y-4">
                      <FaTerminal size={40} className="opacity-10" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Console Footer */}
        <div className="p-3 bg-[#0d1117] border-t border-white/5 flex justify-between items-center px-6">
          <div className="flex items-center gap-4 text-[9px] font-mono">
            <span className="text-slate-600">STATE: <span className={isProcessing ? 'text-yellow-500' : 'text-green-500'}>{isProcessing ? 'BUSY' : 'IDLE'}</span></span>
            <span className="text-slate-600">PARSER: <span className="text-cyan-500">AST_V3</span></span>
          </div>
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter sm:tracking-widest">PyPI Distribution: amos-quety-commenter</p>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default PyCodeCommenterSandbox;
