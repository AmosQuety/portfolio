import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const LensSwitcher = () => {
  const { activeLens, setActiveLens } = usePortfolio();

  const lenses = [
    { id: 'recruiter', label: 'Recruiter' },
    { id: 'engineer', label: 'Engineer' },
    { id: 'resilient', label: 'Resilience' },
  ];

  return (
    <div className="fixed top-20 md:top-auto md:bottom-10 left-1/2 -translate-x-1/2 z-[100] w-fit">
      <div className={`flex items-center gap-1 p-1.5 backdrop-blur-2xl border transition-all duration-300 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.1)] 
        ${activeLens === 'resilient' 
          ? 'bg-slate-900 border-white/40 ring-2 ring-white/10' 
          : 'bg-slate-900/40 border-white/10 hover:border-white/20'}`}
      >
        {lenses.map((lens) => (
          <button
            key={lens.id}
            onClick={() => setActiveLens(lens.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              activeLens === lens.id
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lens.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LensSwitcher;
