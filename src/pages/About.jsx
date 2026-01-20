import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { motion } from "framer-motion";

const About = () => {
  const { activeLens } = usePortfolio();
  const profileImageUrl = "/image2.jpg";
  const [isExpanded, setIsExpanded] = useState(false);

  const isResilientMode = activeLens === 'resilient';
  const isEngineerMode = activeLens === 'engineer';

  return (
    <div className="text-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-cyan-400 mb-10 md:mb-14 uppercase tracking-widest font-['Geist']">
          Who I Am
        </h2>

        <div className="flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Profile Image */}
          <div className="w-full md:w-2/5 lg:w-1/3 flex-shrink-0">
            <div className="w-full max-w-sm mx-auto md:max-w-none aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
              <img
                src={profileImageUrl}
                alt="Nabasa Amos"
                className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full md:w-3/5 lg:w-2/3">
            <div className={`space-y-6 text-base sm:text-lg text-gray-200 leading-relaxed p-6 sm:p-8 rounded-3xl transition-all duration-500 ${
              isResilientMode ? 'bg-slate-950 border-white/5' : 'bg-slate-800/30 backdrop-blur-md border border-slate-700/50 shadow-2xl'
            }`}>
              
              <p className="text-xl sm:text-2xl font-light">
                Hi, I'm <span className="text-cyan-400 font-bold">Amos</span>. I build software that helps people get things done, especially when the situation is difficult.
              </p>

              <p>
                {isEngineerMode 
                  ? "My focus is on making sure apps don't break when the internet is slow or the hardware is old. I like the challenge of building for the real world, not just for high-end offices." 
                  : "I don't just care about the code; I care about the people using it. I've seen how a simple tool—like a WhatsApp bot or a basic soil sensor—can change a person's day or even their life."}
              </p>

              {activeLens === 'recruiter' && (
                <p className="text-slate-400 italic">
                  "I grew up watching my parents deal with 'bad harvests' and seeing neighbors struggle to find basic info. That’s why I build things that work where it matters most."
                </p>
              )}

              {isExpanded ? (
                <div className="space-y-6 pt-4 animate-fadeIn">
                  <p>
                    Take my final year project: a Recommendation System for farmers. The hardest part wasn't the AI—it was the fact that sensors in the field lose connection all the time. I built it to handle that mess, so farmers could still get advice even when the internet flickered. 
                  </p>
                  
                  <div className="p-4 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-r-xl">
                    <p className="text-sm">
                      <span className="font-bold text-cyan-400">The Popcorn Lesson:</span> Before I was a developer, I ran a popcorn business. When it got too busy, I didn't buy fancy software. I just built a simple WhatsApp reservation system. It cut my lost sales by 40% and made my customers feel like VIPs. It taught me that <span className="text-white">simple, smart solutions create the most value.</span>
                    </p>
                  </div>

                  <p>
                    Now, I’m looking to join a team where I can master high-level engineering while keeping this "people-first" mindset. My long-term goal is to build tech that creates thousands of jobs and helps communities that the rest of the world often overlooks.
                  </p>
                </div>
              ) : (
                <p className="text-cyan-500/60 text-sm font-medium">
                  My goal is to find smart, simple ways to solve big problems...
                </p>
              )}

              {!isResilientMode && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-6 px-8 py-3 bg-slate-700/50 hover:bg-cyan-500 text-white text-sm font-bold rounded-full transition-all duration-300 border border-slate-600 hover:border-cyan-400 flex items-center gap-2 group"
                >
                  {isExpanded ? "Show Less" : "Read My Story"}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;