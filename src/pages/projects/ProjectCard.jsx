import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaCode, FaUserShield, FaMobileAlt } from "react-icons/fa"; 
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import PrismIdentityLab from "./PrismIdentityLab"; 
import PyCodeCommenterSandbox from "./PyCodeCommenterSandbox";
import { usePortfolio } from "../../context/PortfolioContext";
import { useConnectivity } from "../../context/ConnectivityContext";
import ArchitectureXRay from "../../components/ArchitectureXRay";
import { QRCodeSVG } from 'qrcode.react'; 

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

function ProjectCard({ project }) {
  const [showDemo, setShowDemo] = useState(false);
  const { activeLens } = usePortfolio();
  const { isLowDataMode } = useConnectivity();
  const videoRef = useRef(null);
  const IconComponent = project.icon || FaCode;
  const [showQR, setShowQR] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current && !isLowDataMode) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // In a real scenario, you'd add 'apkLink' to your projects array in Projects.jsx
  // For now, we use your provided link for any title containing "Track" or "Lingo"
  const isMobileApp = project.title.toLowerCase().includes('track') 
  const apkLink = project.apkLink || "https://github.com/AmosQuety/RentalTrack/releases/download/asset/Rental.new.apk";

  return (
    <motion.div
      layout
      transition={isLowDataMode ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
      whileHover={isLowDataMode ? {} : { scale: 1.02 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${isLowDataMode ? 'bg-slate-800' : 'bg-slate-800/80 backdrop-blur-sm'} p-6 rounded-lg shadow-lg border border-slate-700/50 flex flex-col 
                 transition-shadow duration-300 ease-in-out hover:shadow-cyan-500/10 hover:border-cyan-400/30 group/card`}
    >
      {/* --- CARD HEADER --- */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-400/10 p-2.5 rounded-lg">
            <IconComponent className="text-cyan-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 group">
            {project.liveLink ? (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                {project.title}
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2 text-cyan-400/50">
                  →
                </span>
              </a>
            ) : (
              project.title
            )}
          </h3>
        </div>
      </div>

      {/* --- VISUAL PREVIEW --- */}
      <div className="mb-6 min-h-[180px] overflow-hidden">
        {(project.video && !isLowDataMode && !videoError) ? (
          <div className={`w-full rounded-xl bg-gradient-to-br from-slate-700/50 via-slate-800 to-cyan-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden group/visual ${
            isMobileApp ? 'h-[400px]' : 'aspect-video'
          }`}>
            <video
              ref={videoRef}
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/visual:scale-105"
              loading="lazy"
            />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full"></div>
          </div>
        ) : activeLens === 'engineer' ? (
          <ArchitectureXRay 
            {...(project.title.trim().toLowerCase() === "xemora" ? {
              backend: 'FastAPI/Node',
              data: 'Supabase/Vector',
              scores: { speed: 92, security: 98, cost: 85 }
            } : project.title.trim().toLowerCase() === "refugelink" ? {
              backend: 'Node/Express',
              data: 'PostgreSQL',
              scores: { speed: 85, security: 80, cost: 95 }
            } : {})}
          />
        ) : (activeLens === 'recruiter' || videoError || isLowDataMode) ? (
          <div className={`w-full rounded-xl bg-gradient-to-br from-slate-700/50 via-slate-800 to-cyan-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden group/visual ${
            isMobileApp ? 'h-[400px]' : 'aspect-video'
          }`}>
            {project.image ? (
              <img 
                src={project.image} 
                alt={project.title} 
                className="h-full w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover/visual:scale-105" 
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent)] opacity-0 group-hover/visual:opacity-100 transition-opacity duration-700"></div>
                <div className={`p-4 rounded-full ${isLowDataMode ? 'bg-slate-700' : 'bg-cyan-400/10'}`}>
                   <IconComponent className="text-cyan-400 opacity-50" size={48} />
                </div>
              </>
            )}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full"></div>
          </div>
        ) : null}
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto">
        <div className="mb-4 text-slate-400">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="bg-slate-700/60 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 text-slate-400 relative">
          
          {/* MOBILE SCAN FEATURE  */}
          {isMobileApp && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowQR(true)}
                onMouseLeave={() => setShowQR(false)}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 border border-emerald-400/30 px-3 py-1.5 rounded-lg hover:bg-emerald-400 hover:text-slate-900 transition-all shadow-lg"
              >
                <FaMobileAlt /> Scan to Install
              </button>

              <AnimatePresence>
                {showQR && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full mb-4 right-0 p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 flex flex-col items-center"
                  >
                    <QRCodeSVG value={apkLink} size={140} level="H" includeMargin={true} />
                    <span className="text-[10px] text-slate-900 font-black mt-2 uppercase tracking-tighter">Direct APK Download</span>
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {project.title.trim().toLowerCase() === "xemora" && (
            <button
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-2 text-xs font-bold text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-lg hover:bg-cyan-400 hover:text-slate-900 transition-all shadow-lg z-20"
            >
              <FaUserShield /> Verify Identity (Demo)
            </button>
          )}

          {project.title.trim().toLowerCase() === "pycodecommenter" && (
            <button
              onClick={() => setShowSandbox(true)}
              className="flex items-center gap-2 text-xs font-bold text-green-400 border border-green-400/30 px-3 py-1.5 rounded-lg hover:bg-green-400 hover:text-slate-900 transition-all shadow-lg z-20"
            >
              <FaCode /> Try Sandbox
            </button>
          )}
          
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
              <FaGithub size={20} />
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
              <FaExternalLinkAlt size={18} />
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDemo && (
          <PrismIdentityLab onClose={() => setShowDemo(false)} />
        )}
        {showSandbox && (
          <PyCodeCommenterSandbox onClose={() => setShowSandbox(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    githubLink: PropTypes.string,
    liveLink: PropTypes.string,
  }).isRequired,
};

export default ProjectCard;