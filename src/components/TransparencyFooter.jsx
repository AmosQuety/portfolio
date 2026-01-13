import React from 'react';
import { FaCheckCircle, FaBolt, FaWeightHanging, FaRobot, FaUserEdit } from 'react-icons/fa';

const TransparencyFooter = ({ siteTitle }) => {
  const metrics = [
    { label: 'Portfolio Bundle Size', value: '142kb', icon: FaWeightHanging, color: 'text-cyan-400' },
    { label: 'AI Latency (Avg)', value: '840ms', icon: FaBolt, color: 'text-amber-400' },
    { label: 'Lighthouse Score', value: '100/100', icon: FaCheckCircle, color: 'text-green-400' },
  ];

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/50 backdrop-blur-md py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Transparency Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-lg">
              <div className={`p-3 rounded-xl bg-slate-800 ${metric.color}`}>
                <metric.icon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{metric.label}</span>
                <span className="text-lg font-mono text-white">{metric.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-slate-800/50">
          <div className="max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-500/80 mb-2">
              <FaRobot size={14} />
              <FaUserEdit size={14} />
              <span className="text-[10px] items-center uppercase tracking-widest font-bold">Human-AI Collaboration Report</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              "Engineered by Amos using Antigravity & Gemini 3 as accelerators—Architecture and Final Decisions are human-driven."
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-slate-500 mb-1">
              © {new Date().getFullYear()} {siteTitle}. All Rights Reserved.
            </p>
            <div className="flex items-center justify-center md:justify-end gap-2 text-[9px] text-slate-600 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              System Status: High Performance
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TransparencyFooter;
