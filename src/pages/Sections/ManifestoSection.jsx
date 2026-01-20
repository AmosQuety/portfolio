import React from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaLightbulb, FaTools, FaQuoteLeft } from 'react-icons/fa';

const ManifestoCard = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="bg-[#fdfcf0] p-8 md:p-10 rounded-sm shadow-xl border-l-8 border-amber-900 relative rotate-1 hover:rotate-0 transition-transform duration-500"
  >
    <div className="absolute top-4 right-4 text-amber-900/10">
      <FaQuoteLeft size={40} />
    </div>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-amber-900 text-amber-50 rounded-lg">
        <Icon size={20} />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-amber-900 font-serif">{title}</h3>
    </div>
    <div className="text-amber-950/80 leading-relaxed font-serif text-lg space-y-4">
      {children}
    </div>
    <div className="mt-8 pt-4 border-t border-amber-900/10 flex justify-between items-center italic text-amber-900/40 text-sm">
      <span>#ConstraintFirst</span>
      <span>2026_LOG_AMOS</span>
    </div>
  </motion.div>
);

export const ManifestoSection = () => {
  return (
    <section id="manifesto" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-500 mb-6 uppercase tracking-[0.2em] font-['Geist']">
            The Manifesto
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Engineering for the next billion users requires more than just pixels—it requires a philosophy of constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ManifestoCard title="Constraint-First Engineering" icon={FaTools} delay={0.1}>
            <p>
              I build for the user who doesn't have the luxury of a 1Gbps Fiber connection or the latest iPhone. To me, a **constraint** isn't a limitation—it's a design directive.
            </p>
            <p>
              When we assume "infinite" bandwidth, we build bloated, fragile systems. When we assume "zero" bandwidth, we build **resilient** architectures that excel everywhere.
            </p>
          </ManifestoCard>

          <ManifestoCard title="The Human Latency" icon={FaLightbulb} delay={0.3}>
            <p>
              Technical latency is measured in milliseconds. **Human latency** is measured in frustration. 
            </p>
            <p>
              A farming app that takes 10 seconds to load in a rural field is a failed tool. My mission is to bridge the gap between "Elite Tech" and "Local Reality" using smart-synching, WASM optimization, and AI that works as a silent guardian, not a bandwidth hog.
            </p>
          </ManifestoCard>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 p-12 bg-amber-900/10 border border-amber-900/30 rounded-3xl text-center backdrop-blur-sm"
        >
          <p className="text-2xl md:text-3xl text-amber-200 font-serif italic">
            "We don't just innovate because we can; we innovate because it matters."
          </p>
          <div className="mt-4 text-amber-500 font-bold tracking-widest uppercase text-sm">
            — Nabasa Amos
          </div>
        </motion.div>
      </div>
    </section>
  );
};
