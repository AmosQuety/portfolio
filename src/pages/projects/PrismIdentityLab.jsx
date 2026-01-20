import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Added for Portal support
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaTimes, FaCamera, FaUpload, FaMicrochip, FaLanguage, FaLock, FaBullseye, FaCodeBranch } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';

const PrismIdentityLab = ({ onClose }) => {
  const { activeLens } = usePortfolio();
  const isEngineerMode = activeLens === 'engineer';
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [showLogic, setShowLogic] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setAnalysis(null);
    }
  };

  const runBiometricCheck = async () => {
    if (!image) return;
    setIsLoading(true);

    try {
      const imageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(image);
      });

      const prompt = `
        ACT AS: The Prism AI Security Engine.
        TASK: Perform a simulated biometric and liveness analysis on this image.
        RETURN JSON FORMAT ONLY:
        {
          "status": "Verified / Flagged / Unknown",
          "liveness_score": "0-100%",
          "security_report_en": "Professional English security summary.",
          "security_report_lug": "Concise Luganda security summary.",
          "security_report_run": "Concise Runyankore security summary.",
          "technical_reasoning": "Explain the vision patterns detected (e.g. skin texture, eye reflection, edge detection) that verify liveness.",
          "privacy_note": "A note about how data is handled in this microservices architecture."
        }
        TONE: High-security, professional, but accessible.
      `;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: imageData, mimeType: image.type } }
      ]);
      
      const response = await result.response;
      const cleanJson = response.text().replace(/```json|```/g, "");
      setAnalysis(JSON.parse(cleanJson));
    } catch (error) {
      setAnalysis({ 
        status: "Error",
        security_report_en: "Biometric link failed. Please retry.",
        security_report_lug: "Tekisobose. Gezaako nate.",
        security_report_run: "Kyamansha. Teeraho kandi."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- MODAL UI CONTENT ---
  const modalContent = (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      // Use fixed inset-0 and a massive Z-index to override everything
      className="fixed inset-0 z-[9999] flex text-white items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl overflow-y-auto"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col my-auto max-h-[95vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400">
              <FaUserShield className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Prism AI: Identity Lab</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Liveness & Biometric Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition-colors p-2"
            aria-label="Close modal"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {!preview ? (
            <label className="group border-2 border-dashed border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-cyan-500/30 hover:bg-slate-800/20 transition-all">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="bg-slate-800 p-5 rounded-full text-slate-500 group-hover:text-cyan-400 transition-colors">
                <FaUpload size={32} />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-medium">Upload Image for Identity Check</p>
                <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-tighter">Encrypted & Processed via Gemini 3 Flash</p>
              </div>
            </label>
          ) : (
            <div className="space-y-6">
              {/* Preview with "Scanning" Overlay */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-square max-w-xs mx-auto bg-black shadow-2xl">
                <img src={preview} alt="Selfie preview" className="w-full h-full object-cover opacity-80" />
                {isLoading && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_15px_#06b6d4] z-10"
                  />
                )}
                
                {/* Engineer HUD Overlay */}
                {isEngineerMode && analysis && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Detection Box */}
                      <motion.rect 
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        x="25" y="20" width="50" height="50"
                        fill="none" stroke="#22d3ee" strokeWidth="0.5"
                        strokeDasharray="2 2"
                      />
                      {/* Corners */}
                      <path d="M25 30 V20 H35" fill="none" stroke="#22d3ee" strokeWidth="1" />
                      <path d="M65 20 H75 V30" fill="none" stroke="#22d3ee" strokeWidth="1" />
                      <path d="M25 60 V70 H35" fill="none" stroke="#22d3ee" strokeWidth="1" />
                      <path d="M65 70 H75 V60" fill="none" stroke="#22d3ee" strokeWidth="1" />
                      
                      {/* Landpoints */}
                      <circle cx="40" cy="40" r="1" fill="#22d3ee" />
                      <circle cx="60" cy="40" r="1" fill="#22d3ee" />
                      <circle cx="50" cy="55" r="1" fill="#22d3ee" />
                    </svg>
                    
                    {/* Floating Metrics */}
                    <div className="absolute top-4 left-4 font-mono text-[8px] text-cyan-400 space-y-1 bg-black/40 p-1 rounded">
                      <div>REC_092: ACTIVE</div>
                      <div>FPS: 60.0</div>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 font-mono text-[8px] text-cyan-400 bg-black/40 p-1 rounded text-right">
                      <div>CONF: {analysis.liveness_score}</div>
                      <div>LATENCY: 420ms</div>
                    </div>
                  </div>
                )}
              </div>

              {!analysis && (
                <button 
                  onClick={runBiometricCheck} disabled={isLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-500/10"
                >
                  {isLoading ? "Authenticating Persona..." : <><FaLock /> Start Secure Verification</>}
                </button>
              )}

              {analysis && (
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      className={`p-4 rounded-full border-4 ${
                        analysis.status === 'Verified' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}
                    >
                      {analysis.status === 'Verified' ? <FaLock className="text-3xl" /> : <FaTimes className="text-3xl" />}
                    </motion.div>
                    
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      analysis.status === 'Verified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {activeLens === 'recruiter' && analysis.status === 'Verified' ? 'Identity Secured: Professional Access' : `System Status: ${analysis.status} (${analysis.liveness_score} Liveness)`}
                    </span>
                  </div>

                  {/* Multi-lingual Security Reports */}
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                      <FaLanguage /> Access Control Summary
                    </div>
                    
                    <div className="space-y-3">
                      <div className="border-l-2 border-cyan-500 pl-3">
                        <p className="text-[10px] text-slate-500 uppercase">English</p>
                        <p className="text-sm text-slate-200">{analysis.security_report_en}</p>
                      </div>
                      <div className="border-l-2 border-slate-600 pl-3">
                        <p className="text-[10px] text-slate-500 uppercase">Luganda</p>
                        <p className="text-sm text-slate-400 italic">{analysis.security_report_lug}</p>
                      </div>
                      <div className="border-l-2 border-slate-600 pl-3">
                        <p className="text-[10px] text-slate-500 uppercase">Runyankore</p>
                        <p className="text-sm text-slate-400 italic">{analysis.security_report_run}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Logic Toggle */}
                  <div className="pt-2">
                    <button 
                      onClick={() => setShowLogic(!showLogic)}
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors mx-auto"
                    >
                      <FaMicrochip /> {showLogic ? "Hide Logic" : "View Engineering Trade-offs"}
                    </button>

                    <AnimatePresence>
                      {showLogic && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-black/50 p-4 mt-3 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-600/80 leading-relaxed"
                        >
                          {analysis.technical_reasoning}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-600">
          <div className="flex gap-4">
            <span>Prism-Node v4.2</span>
            <span>Gemini-Vision-Agent Active</span>
          </div>
          <button 
            onClick={() => {setImage(null); setPreview(null); setAnalysis(null);}} 
            className="text-cyan-900 hover:text-cyan-1000 underline font-bold uppercase"
          >
            Reset Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // --- PORTAL TELEPORTATION ---
  // This sends the modal to the bottom of <body> so it is never trapped by card layouts
  return createPortal(modalContent, document.body);
};

export default PrismIdentityLab;