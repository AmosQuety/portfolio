import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRobot,
  FaTimes,
  FaChevronRight,
  FaExpandAlt,
  FaCompressAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { usePortfolio } from '../context/PortfolioContext';
import ReactMarkdown from 'react-markdown';
import { buildBaseSystemPrompt } from '../lib/profilePrompt';

const BASE_SYSTEM_INSTRUCTION = buildBaseSystemPrompt();

const CONNECTION_INSTRUCTIONS = {
  offline: `
NETWORK STATUS: OFFLINE.
You are operating on cached knowledge only. Keep every response under 20 words.
Acknowledge the offline state if the user asks a complex question you cannot fully address.
`,
  slow: `
NETWORK STATUS: LIMITED BANDWIDTH (2G/Edge).
Be extremely concise — every token matters. Abbreviate where sensible. No lengthy explanations.
`,
  fast: `
NETWORK STATUS: FULL BANDWIDTH.
Respond warmly and thoroughly. Use your professional East-African tech-mentor persona freely.
`,
};

const LENS_INSTRUCTIONS = {
  recruiter: `
ACTIVE LENS: RECRUITER.
Emphasise business value, successful delivery, leadership signals, and measurable outcomes.
Frame Amos' work in terms of ROI and professional impact.
`,
  engineer: `
ACTIVE LENS: ENGINEER.
Go deep on technical architecture. Discuss system design decisions, trade-offs, performance, and scalability.
Mention relevant paradigms (edge-first, offline-first, microservices) where applicable.
`,
  resilient: `
ACTIVE LENS: RESILIENT.
Focus on constraint-driven engineering: offline capability, low-bandwidth optimisations, and accessibility.
Highlight how Amos builds software that works reliably in challenging environments.
`,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const buildSystemInstruction = (connection, activeLens) =>
  [
    BASE_SYSTEM_INSTRUCTION,
    CONNECTION_INSTRUCTIONS[connection] ?? CONNECTION_INSTRUCTIONS.fast,
    LENS_INSTRUCTIONS[activeLens] ?? '',
  ].join('\n');

const CONNECTION_DELAYS = { slow: 3000, offline: 400 };

const INITIAL_MESSAGE = {
  role: 'model',
  text: "Hello! I'm Amos' AI Concierge. Ask me anything about his background, projects, or technical experience.",
};

const HEADER_GAP_PX = 8;
const FALLBACK_TOP_OFFSET_PX = 88;

const ERROR_MESSAGES = {
  API_KEY_MISSING: 'The concierge is temporarily unavailable — API key not configured. Please contact Amos directly.',
  NOT_FOUND: 'AI model not found. Please notify Amos so he can update the configuration.',
  DEFAULT: 'The request could not be completed. Please try again in a moment.',
};

const resolveErrorMessage = (error) => {
  if (error.message === 'API_KEY_MISSING') return ERROR_MESSAGES.API_KEY_MISSING;
  if (error.message?.includes('404')) return ERROR_MESSAGES.NOT_FOUND;
  return ERROR_MESSAGES.DEFAULT;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const ConnectionBadge = ({ connection }) => {
  const config = {
    fast: { label: 'Online', color: 'text-emerald-400', dot: 'bg-emerald-400' },
    slow: { label: '2G', color: 'text-amber-400', dot: 'bg-amber-400' },
    offline: { label: 'Offline', color: 'text-rose-400', dot: 'bg-rose-400' },
  }[connection] ?? { label: 'Online', color: 'text-emerald-400', dot: 'bg-emerald-400' };

  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-medium ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </div>
  );
};

ConnectionBadge.propTypes = { connection: PropTypes.string };

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-3 flex items-center gap-1.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-cyan-700 text-white rounded-tr-none shadow-md font-semibold'
            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 shadow-lg'
        }`}
      >
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <div
            className="
              prose prose-invert prose-sm max-w-none
              prose-strong:text-cyan-400 prose-strong:font-semibold
              prose-p:leading-relaxed prose-p:my-1
              prose-li:text-slate-300 prose-ul:my-1 prose-ol:my-1
              prose-headings:text-slate-100
            "
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({ role: PropTypes.string, text: PropTypes.string }).isRequired,
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const GeminiConcierge = ({ connection = 'fast' } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState(null);
  const [maximizedTopOffset, setMaximizedTopOffset] = useState(FALLBACK_TOP_OFFSET_PX);

  const [sessionId, setSessionId] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { activeLens } = usePortfolio();

  // Initialize stable sessionId
  useEffect(() => {
    let sid = sessionStorage.getItem('portfolio_ai_sid');
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem('portfolio_ai_sid', sid);
    }
    setSessionId(sid);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Keep maximized chat offset aligned to the fixed navbar height.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateTopOffset = () => {
      const header = document.getElementById('site-header');
      if (!header) {
        setMaximizedTopOffset(FALLBACK_TOP_OFFSET_PX);
        return;
      }

      const { bottom } = header.getBoundingClientRect();
      setMaximizedTopOffset(Math.max(FALLBACK_TOP_OFFSET_PX, Math.ceil(bottom + HEADER_GAP_PX)));
    };

    updateTopOffset();

    const header = document.getElementById('site-header');
    let observer;

    if (header && 'ResizeObserver' in window) {
      observer = new ResizeObserver(updateTopOffset);
      observer.observe(header);
    }

    window.addEventListener('resize', updateTopOffset);
    window.addEventListener('orientationchange', updateTopOffset);

    return () => {
      window.removeEventListener('resize', updateTopOffset);
      window.removeEventListener('orientationchange', updateTopOffset);
      observer?.disconnect();
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsMaximized(false);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const delay = CONNECTION_DELAYS[connection] ?? 0;
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const systemPrompt = buildSystemInstruction(connection, activeLens);
      
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          history: messages.filter((_, i) => i !== 0), // Skip initial greeting
          systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (error) {
      const errorMsg = resolveErrorMessage(error);
      setInitError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, connection, activeLens, sessionId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div
      className={`fixed z-[100] transition-all duration-300 ${
        isMaximized
          ? 'left-2 right-2 bottom-2 sm:left-4 sm:right-4 sm:bottom-4'
          : 'bottom-6 right-6'
      }`}
      style={isMaximized ? { top: `${maximizedTopOffset}px` } : undefined}
    >
      {/* Trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI concierge"
            className="bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <FaRobot className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-label="Amos's AI Concierge"
            className={`bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isMaximized ? 'w-full h-full' : 'w-80 sm:w-96 h-[520px]'
            }`}
          >
            {/* ---- Header ---- */}
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <FaRobot className="text-cyan-400 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100 text-sm leading-tight">
                    Amos&rsquo; Concierge
                  </p>
                  <ConnectionBadge connection={connection} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized((v) => !v)}
                  aria-label={isMaximized ? 'Restore window' : 'Maximise window'}
                  className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {isMaximized ? <FaCompressAlt /> : <FaExpandAlt />}
                </button>
                <button
                  onClick={handleClose}
                  aria-label="Close concierge"
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* ---- Init error banner ---- */}
            {initError && (
              <div className="flex items-start gap-2 bg-rose-900/40 border-b border-rose-700/50 px-4 py-2.5 text-rose-300 text-xs">
                <FaExclamationTriangle className="mt-0.5 shrink-0" />
                <p>{initError}</p>
              </div>
            )}

            {/* ---- Messages ---- */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {/* ---- Input ---- */}
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/60 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    connection === 'offline'
                      ? 'Limited mode — keep it brief'
                      : "Ask about Amos' experience or projects\u2026"
                  }
                  disabled={isLoading || !!initError}
                  aria-label="Message input"
                  className="
                    flex-1 bg-black border border-slate-700 rounded-xl px-4 py-2.5
                    text-sm text-slate-100 placeholder-slate-500
                    focus:outline-none focus:ring-1 focus:ring-cyan-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                  "
                />
                <div className="relative group">
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim() || !!initError}
                    aria-label="Send message"
                    className="
                      bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600
                      disabled:opacity-40 disabled:cursor-not-allowed
                      text-white p-2.5 rounded-xl transition-colors duration-150
                      focus:outline-none focus:ring-2 focus:ring-cyan-400
                    "
                  >
                    <FaChevronRight />
                  </button>
                  {/* subtle tooltip on hover */}
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-[9px] text-slate-400 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-700 shadow-lg">
                    AI responses may vary in accuracy
                  </div>
                </div>
              </div>

              <div className="text-center border-t border-slate-700/50 pt-2 mt-2">
                <p className="text-[8px] text-slate-700 italic tracking-wide">
                  Responses are AI-generated
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

GeminiConcierge.propTypes = {
  connection: PropTypes.oneOf(['fast', 'slow', 'offline']),
};

export default GeminiConcierge;