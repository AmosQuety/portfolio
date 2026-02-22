// sections/Projects.js

import { FaLanguage, FaMobileAlt, FaWhatsapp, FaBrain, FaCapsules, FaTv } from "react-icons/fa"; // Added FaBrain
import { SiPypi } from "react-icons/si";
import { BsBuilding } from "react-icons/bs";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

// Project Mockups
import xemoraImg from "../../assets/projects/prism_ai.png";
import xemoraVideo from "../../assets/projects/Xemora.mp4";
import refugeLinkImg from "../../assets/projects/refugelink.png";
import rentalTrackImg from "../../assets/projects/rentaltrack.png";
import lugaLingoImg from "../../assets/projects/lugalingo.png";
import hostelEaseImg from "../../assets/projects/hostelease.png";
import pyCodeCommenterImg from "../../assets/projects/pycodecommenter.png";
import pharmaSearchImg from "../../assets/projects/pharmasearch.png";
import serieDownloaderImg from "../../assets/projects/seriedownloader.png";

function Projects() {
  const projects = [
    {
      title: "Xemora",
      icon: FaBrain,
      image: xemoraImg,
      video: xemoraVideo,
      description: "Production-grade biometric SaaS combining Computer Vision & GenAI. Features Face ID login, liveness detection, and RAG document analysis using a microservices architecture (Node.js + Python).",
      technologies: ["React", "GraphQL", "Python", "FastAPI", "Gemini API", "DeepFace", "Supabase"],
      githubLink: "https://github.com/AmosQuety/Super-AI-App",
      liveLink: "http://prism-vision.vercel.app", 
    },
     {
      title: "PharmaSearch",
      icon: FaCapsules,
      image: pharmaSearchImg,
      description: "A B2B pharmaceutical platform connecting pharmacists and wholesalers across Uganda. Features real-time medicine availability search with fuzzy matching, wholesaler verification, and an inventory management dashboard.",
      technologies: ["React", "Node.js", "Express", "Supabase", "PostgreSQL", "Tailwind CSS"],
      githubLink: "https://github.com/AmosQuety/Drug-Site",
      liveLink: "https://drug-site-three.vercel.app",
    },
    
    {
      title: "Serie Downloader",
      icon: FaTv,
      image: serieDownloaderImg,
      description: "A high-performance desktop media center and automated downloader built with the Electron-Vite ecosystem. Transforms local libraries into a streaming-like experience with rich metadata enrichment and automated installers.",
      technologies: ["Electron", "React", "TypeScript", "Vite", "SQLite", "Zustand", "Playwright"],
      githubLink: "https://github.com/AmosQuety/Serie-Downloader",
      liveLink: "https://github.com/AmosQuety/Serie-Downloader/releases", // Directing to releases for the desktop app
    },
    {
      title: "RefugeLink",
      icon: FaWhatsapp,
      image: refugeLinkImg,
      description: "AI-powered WhatsApp chatbot providing 24/7 refugee assistance in Mbarara, Uganda. Delivers instant access to registration info, food assistance, shelter, and emergency contacts via conversational interface.",
      technologies: ["TypeScript", "Node.js", "Express", "Twilio API", "Supabase", "PostgreSQL", "Render"],
      githubLink: "https://github.com/AmosQuety/RefugeLink", 
      liveLink: "https://wa.me/14155238886?text=join%20mail-iron", 
    },
    {
      title: "RentalTrack",
      icon: FaMobileAlt,
      image: rentalTrackImg,
      description: "Offline React Native property management app for landlords to track tenants, rent payments, and automate reminders. Features SQLite database, local notifications, and comprehensive analytics.",
      technologies: ["React Native", "TypeScript", "SQLite", "Expo", "Node.js"],
      githubLink: "https://github.com/AmosQuety/RentalTrack", 
      liveLink: "https://drive.google.com/file/d/110kPGSJT9Gp4vVRQyHor5Qlf8PKCAlZK/view?usp=sharing", 
    },
    
    {
      title: "LugaLingo",
      icon: FaLanguage,
      image: lugaLingoImg,
      description: "A gamified language-learning application focused on teaching Luganda through structured lessons, progress tracking, and achievement-based motivation.",
      technologies: ["React", "Node.js", "Firebase"],
      githubLink: null,
      liveLink: null,
      // not fully finished yet
    },
    {
      title: "HostelEase",
      icon: BsBuilding,
      image: hostelEaseImg,
      description: "A web-based hostel booking and management system that allows students to browse, reserve, and confirm hostel accommodation remotely, while enabling administrators to manage availability, allocations, and records digitally",
      technologies: ["React", "Node.js", "MongoDB"],
      githubLink: "https://github.com/AmosQuety/HostelEase",
      liveLink: null,
    },
    {
      title: "PyCodeCommenter",
      icon: SiPypi,
      image: pyCodeCommenterImg,
      description: "Automated Google-style docstring generator for Python using AST parsing, saving developers significant documentation time.",
      technologies: ["Python", "AST", "PyPI"],
      githubLink: "https://github.com/AmosQuety/PyCodeCommenter",
      liveLink: "https://pypi.org/project/pycodecommenter/",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <section
      id="projects"
      className="py-16 md:py-24 bg-slate-900 text-slate-300"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold mb-12 text-center text-cyan-400 uppercase tracking-widest font-['Geist']"
        >
          View Projects
        </motion.h2>

        {/* APK Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-cyan-400/20"
        >
          <h3 className="text-cyan-400 font-semibold mb-2">📱 Testing Mobile Apps</h3>
          <p className="text-sm text-slate-400">
            To test my Android apps: Click the download link, allow "Install from unknown sources" when prompted, 
            and tap "Install anyway" if Play Protect warns you. These are safe portfolio demo apps.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "-100px 0px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;