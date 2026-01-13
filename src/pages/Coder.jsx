/* eslint-disable react/no-unescaped-entities */
import { usePortfolio } from "../context/PortfolioContext";

const Coder = () => {
  const { activeLens } = usePortfolio();

  // --- LENS-BASED CODE SNIPPETS ---
  const snippets = {
    recruiter: (
      <>
        <span className="text-pink-400">const</span> <span className="text-white">amos</span> = {"{"}
        <br />
        <span className="ml-4 text-slate-400">// Building for impact</span>
        <br />
        <span className="ml-4">role</span>: <span className="text-yellow-400">'Software Engineer'</span>,
        <br />
        <span className="ml-4">focus</span>: <span className="text-yellow-400">'Social Impact Tech'</span>,
        <br />
        <span className="ml-4">mission</span>: <span className="text-yellow-400">'Bridging digital gaps'</span>,
        <br />
        <span className="ml-4 text-pink-600">createImpact</span>: <span className="text-amber-400">async</span> () {"=>"} {"{"}
        <br />
        <span className="ml-8 text-pink-400">return</span> <span className="text-amber-400">await</span> deliver(value);
        <br />
        <span className="ml-4">{"}"}</span>
        <br />
        {"}"};
      </>
    ),
    engineer: (
      <>
        <span className="text-pink-400">class</span> <span className="text-cyan-400">ResilientEngineer</span> {"{"}
        <br />
        <span className="ml-4 text-slate-400">// Optimizing for 2026 stack</span>
        <br />
        <span className="ml-4">stack</span> = [<span className="text-green-400">'React_19'</span>, <span className="text-green-400">'Gemini_3'</span>, <span className="text-green-400">'Rust'</span>];
        <br />
        <span className="ml-4">edgeAware</span> = <span className="text-blue-400">true</span>;
        <br /><br />
        <span className="ml-4 text-pink-600">optimize</span>(latency) {"{"}
        <br />
        <span className="ml-8 text-pink-400">if</span> (latency {" > "} 500ms) {"{"} 
        <br />
        <span className="ml-12 text-pink-400">return</span> <span className="text-white">this</span>.triggerWASM();
        <br />
        <span className="ml-8">{"}"}</span>
        <br />
        <span className="ml-4">{"}"}</span>
        <br />
        {"}"}
      </>
    ),
    resilient: (
      <>
        <span className="text-slate-500">// Low-Bandwidth Priority Mode</span>
        <br />
        <span className="text-pink-400">function</span> <span className="text-white">handleConstraints</span>() {"{"}
        <br />
        <span className="ml-4 text-pink-400">const</span> <span className="text-white">config</span> = {"{"}
        <br />
        <span className="ml-8">images</span>: <span className="text-yellow-400">'paused'</span>,
        <br />
        <span className="ml-8">ai_model</span>: <span className="text-yellow-400">'gemini-3-flash'</span>,
        <br />
        <span className="ml-8">sync</span>: <span className="text-yellow-400">'background'</span>
        <br />
        <span className="ml-4">{"}"};</span>
        <br />
        <span className="ml-4 text-pink-400">return</span> <span className="text-white">resilientArchitecture</span>(config);
        <br />
        {"}"}
      </>
    )
  };

  return (
    <div className="w-full h-full border border-slate-700 relative rounded-2xl shadow-2xl overflow-hidden bg-slate-950/50 backdrop-blur-xl">
      {/* Window Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 border-b border-slate-800 flex justify-between items-center px-4 bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <div className="bg-red-500/50 w-2.5 h-2.5 rounded-full"></div>
          <div className="bg-yellow-500/50 w-2.5 h-2.5 rounded-full"></div>
          <div className="bg-green-500/50 w-2.5 h-2.5 rounded-full"></div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {activeLens}_lens.js
        </div>
      </div>

      {/* Code Content Area */}
      <div className="pt-12 pb-6 px-4 sm:px-6 h-full overflow-y-auto scrollbar-hide">
        <pre className="text-slate-300 font-mono text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre animate-fadeIn">
          {snippets[activeLens] || snippets.recruiter}
        </pre>
      </div>
      
      {/* Visual terminal indicator */}
      <div className="absolute bottom-2 right-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
        <span className="text-[9px] font-mono text-cyan-900 uppercase">System Ready</span>
      </div>
    </div>
  );
};

export default Coder;