import React from 'react';
import PropTypes from 'prop-types';

const ArchitectureXRay = ({ 
  client = 'Client', 
  backend = 'Node/FastAPI', 
  data = 'Supabase/Gemini',
  scores = { speed: 90, security: 85, cost: 95 }
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Visual Diagram */}
      <div className="relative flex items-center justify-between px-4 py-8 bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2 z-0"></div>
        
        {/* Nodes */}
        {[client, backend, data].map((node, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-800 border border-cyan-500/50 rounded-lg shadow-lg shadow-cyan-500/10">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>
            <span className="text-[10px] uppercase tracking-tighter text-cyan-400 font-bold">{node}</span>
          </div>
        ))}
      </div>

      {/* Trade-off Matrix */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(scores).map(([key, val]) => (
          <div key={key} className="flex flex-col gap-1 p-2 bg-slate-800/40 rounded-lg border border-slate-700/30">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{key}</span>
            <div className="flex items-end gap-1">
              <span className="text-sm font-mono text-cyan-400 font-bold">{val}</span>
              <span className="text-[8px] text-slate-600 mb-0.5">/100</span>
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500/50 transition-all duration-1000" 
                style={{ width: `${val}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ArchitectureXRay.propTypes = {
  client: PropTypes.string,
  backend: PropTypes.string,
  data: PropTypes.string,
  scores: PropTypes.shape({
    speed: PropTypes.number,
    security: PropTypes.number,
    cost: PropTypes.number,
  }),
};

export default ArchitectureXRay;
