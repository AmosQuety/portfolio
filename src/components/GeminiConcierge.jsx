import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaSeedling, FaWifi, FaChevronRight, FaExpandAlt, FaCompressAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { usePortfolio } from '../context/PortfolioContext';

const SYSTEM_INSTRUCTION = `
You are the AI Concierge for Nabasa Amos. 
Your goal: Represent Amos with 100% accuracy based on his real-world data.

--- AMOS'S REAL DATA (Source of Truth) ---
EDUCATION:
- University: Bachelor of Software Engineering at Mbarara University of Science and Technology (MUST), 2022–2026.
- High School: St. Mary’s College Rushoroza (UACE, 2019-2020) and Mbarara High School (UCE, 2015-2018).
- Primary: Kabale Preparatory School.

WORK EXPERIENCE:
- John Vince Engineering (June - July 2024): Full Stack Intern. Built 'HostelEase' (MERN stack).
- CAMTech Uganda (Sept - Oct 2023): Software Dev Intern. Developed a health-focused voicebot using Python/ChatGPT API.
- Hammer Uganda (July - Sept 2025): Site Verification Engineer. Analyzed network performance and drive test log files.

CORE PROJECTS:
- Prism AI: Biometric SaaS (React, FastAPI, Python, DeepFace). Focuses on "Edge-First Privacy."
- RefugeLink: WhatsApp AI Chatbot for refugees in Mbarara. Bridges literacy gaps with voice-to-query using Gemini.
- RentalTrack: Offline-first React Native app for landlord/tenant management.
- PyCodeCommenter: A Python library on PyPI for automated docstring generation.

--- PERSONALITY & TONE ---
- Tone: Professional, local tech-mentor, empathetic.
- Style: ALWAYS include hard facts if asked.
- Constraints: Be concise. If someone asks where Amos studied, say: "Amos honed his skills at Mbarara University of Science and Technology (MUST), where he is completing his Software Engineering degree (2022-2026)."

--- CURRENT MISSION ---
Amos is currently competing in the "New Year, New You" Google AI Portfolio Challenge. This site was built using React 19, Gemini 3, and Google Antigravity.

Use Markdown formatting to make your answers easy to read. Use bolding for project names and key achievements. Use bullet points if listing more than two items.
`;

const GeminiConcierge = ({ connection = "fast" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false); // New state for Maximizing
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Jambo! I am Amos’s concierge. What would you like to know about Prism AI or his "Resilient" code?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const { activeLens } = usePortfolio();

  const getSystemInstruction = () => {
  let modeSpecific = "";
  if (connection === 'offline') {
    // Purpose: Show that the app works without the cloud
    modeSpecific = "CRITICAL: YOU ARE OFFLINE. Use only cached knowledge. Maximum 5 words per answer. Be a silent guardian.";
  } else if (connection === 'slow') {
    // Purpose: Show you can optimize for 2G/Low-bandwidth
    modeSpecific = "CRITICAL: 2G CONNECTION. Every byte costs money. Use extreme brevity. Use abbreviations. No metaphors. Just the facts.";
  } else {
    // Purpose: Show full multimodal capability
    modeSpecific = "FIBER CONNECTION: You have full bandwidth. Be warm, use your East African mentor persona and metaphors freely.";
  }
  let lensSpecific = "";
  if (activeLens === 'recruiter') {
    lensSpecific = "LENS: RECRUITER. Your tone is high-impact and ROI-focused. Highlight business value, leadership, and successful delivery of projects.";
  } else if (activeLens === 'engineer') {
    lensSpecific = "LENS: ENGINEER. Your tone is technical and architectural. Deep dive into system design, mention WASM, Microservices, and edge-first performance.";
  } else if (activeLens === 'resilient') {
    lensSpecific = "LENS: RESILIENT. Your tone is accessible and concise. Focus on reliability, constraint-first engineering, and low-bandwidth optimizations.";
  }

  return SYSTEM_INSTRUCTION + "\n" + modeSpecific + "\n" + lensSpecific;
};

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    systemInstruction: getSystemInstruction()
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

      // Dynamic Latency simulation
  let delay = 0;
  if (connection === 'slow') delay = 3000; // 3 second "2G" struggle
  if (connection === 'offline') delay = 500; // Fast local response

  setTimeout(async () => {

    try {
      const apiHistory = messages.filter((m, i) => i !== 0).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const chat = model.startChat({ history: apiHistory });
      const result = await chat.sendMessage(currentInput);
      const text = (await result.response).text();

      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection flickered. Like a dry spell, please try again." }]);
    } finally {
      setIsLoading(false);
    } 
  }, delay)

};

  return (
    <div className={`fixed z-[100] transition-all duration-300 ${
      isMaximized ? 'inset-4' : 'bottom-6 right-6'
    }`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
          >
            <FaRobot className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isMaximized ? 'w-full h-full' : 'w-80 sm:w-96 h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaSeedling className="text-cyan-400" />
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Amos's Concierge</h3>
                  <span className="text-[10px] text-green-400">Gemini 3 Flash </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Maximize Toggle */}
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {isMaximized ? <FaCompressAlt /> : <FaExpandAlt />}
                </button>
                <button 
                  onClick={() => {setIsOpen(false); setIsMaximized(false);}}
                  className="text-slate-400 hover:text-red-400"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 shadow-lg'
              }`}>
                {/* WE WRAP THE MARKDOWN IN A DIV INSTEAD OF PASSING CLASSNAME TO IT */}
                <div className="prose prose-invert prose-sm max-w-none 
                                prose-strong:text-cyan-400 prose-strong:font-bold
                                prose-p:leading-relaxed prose-li:text-slate-300">
                  <ReactMarkdown>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-cyan-500 text-xs animate-pulse">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
              Amos's AI is thinking...
            </div>
          )}
        </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <div className="flex gap-2">
                <input 
                  type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a quick question..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button onClick={handleSend} className="bg-cyan-500 text-white p-2 rounded-xl">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeminiConcierge;