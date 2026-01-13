import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaCommentAlt, FaRobot, FaUserAlt } from 'react-icons/fa';

const CodeReview = () => {
  const [activeComment, setActiveComment] = useState(null);

  const codeSnippet = [
    { line: 1, content: "const runBiometricCheck = async () => {", annotation: null },
    { line: 2, content: "  const imageData = await getBase64(image);", annotation: null },
    { line: 3, content: "  const prompt = `ACT AS: Prism AI Security Engine.", annotation: "prompt" },
    { line: 4, content: "    TASK: Perform liveness analysis. RETURN JSON ONLY.`;", annotation: null },
    { line: 5, content: "  ", annotation: null },
    { line: 6, content: "  const result = await model.generateContent([", annotation: "model" },
    { line: 7, content: "    prompt, { inlineData: { data: imageData, mimeType: 'image/jpeg' } }", annotation: null },
    { line: 8, content: "  ]);", annotation: null },
    { line: 9, content: "  ", annotation: null },
    { line: 10, content: "  const cleanJson = result.response.text().replace(/```json|```/g, '');", annotation: "parsing" },
    { line: 11, content: "  return JSON.parse(cleanJson);", annotation: null },
    { line: 12, content: "};", annotation: null },
  ];

  const comments = {
    prompt: {
      reviewer: "Why rely on a text-prompt for critical security logic?",
      response: "It allows for rapid iteration of vision reasoning patterns (texture, reflection) without redeploying specialized models. I use 'system-instruction' style prompts to enforce strict output schema."
    },
    model: {
      reviewer: "Is Gemini 2.0 Flash stable enough for biometric verification?",
      response: "The speed-to-accuracy ratio is unmatched for real-time edge analysis. I handle 'instability' via a multi-retry fallback logic and client-side validation."
    },
    parsing: {
      reviewer: "Regex-based JSON cleaning is risky. What if the model outputs markdown artifacts?",
      response: "Agreed. In production, I'd use a parser combinator. Here, I use it as a 'resilient' shim to handle Gemini's conversational tendencies while keeping the bundle size low."
    }
  };

  return (
    <section className="py-20 bg-slate-950/50 rounded-3xl border border-slate-800/50 mt-16 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-cyan-500/10 p-3 rounded-2xl text-cyan-400">
            <FaCode size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Ghost in the Code</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Interactive Peer Review: Prism AI Liveness Engine</p>
          </div>
        </div>

        <div className="relative bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">src/engines/liveness.js</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-6 font-mono text-sm overflow-x-auto">
            {codeSnippet.map((line) => (
              <div key={line.line} className="relative group flex gap-6 hover:bg-slate-800/30 transition-colors">
                <span className="w-6 text-slate-600 text-right select-none">{line.line}</span>
                <span className="text-slate-300 whitespace-pre">{line.content}</span>
                
                {line.annotation && (
                  <button 
                    onClick={() => setActiveComment(activeComment === line.annotation ? null : line.annotation)}
                    className="absolute right-0 top-0 h-full px-4 flex items-center gap-2 text-cyan-500/40 hover:text-cyan-400 transition-colors bg-gradient-to-l from-slate-900 via-slate-900 to-transparent"
                  >
                    <FaCommentAlt size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Review</span>
                  </button>
                )}

                <AnimatePresence>
                  {activeComment === line.annotation && line.annotation && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="absolute left-0 right-0 top-full z-10 bg-slate-800 border-y border-slate-700 p-4 space-y-4 shadow-xl"
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                          <FaRobot />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Senior AI Reviewer</p>
                          <p className="text-slate-300 italic">{comments[line.annotation].reviewer}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 ml-6">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                          <FaUserAlt size={14} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Nabasa Amos (Developer)</p>
                          <p className="text-slate-400">{comments[line.annotation].response}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-600">
          <p className="text-[10px] uppercase tracking-[0.2em]">Click 'Review' buttons to see engineering trade-offs</p>
        </div>
      </div>
    </section>
  );
};

export default CodeReview;
