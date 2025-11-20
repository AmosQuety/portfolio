// sections/Projects.js

import { FaLeaf, FaLanguage, FaMobileAlt } from "react-icons/fa"; // Added FaMobileAlt
import { SiPypi } from "react-icons/si";
import { BsBuilding } from "react-icons/bs";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

function Projects() {
  const projects = [
    {
      title: "RentalTrack",
      icon: FaMobileAlt, // New icon for mobile app
      description: "Offline-first React Native property management app for landlords to track tenants, rent payments, and automate reminders. Features SQLite database, local notifications, and comprehensive analytics.",
      technologies: ["React Native", "TypeScript", "SQLite", "Expo", "Node.js"],
      githubLink: null, // You can add your GitHub repo link if available
      liveLink: "https://drive.google.com/file/d/110kPGSJT9Gp4vVRQyHor5Qlf8PKCAlZK/view?usp=sharing", // Your APK download link
    },
    {
      title: "Crop Advisor",
      icon: FaLeaf,
      description: "AI-driven web app for crop/fertilizer recommendations with 60% higher accuracy. Optimized UI for low-bandwidth rural users.",
      technologies: ["Python", "Flask", "React", "Machine Learning"],
      githubLink: null,
      liveLink: null,
    },
    {
      title: "LugaLingo",
      icon: FaLanguage,
      description: "Gamified language-learning app with personalized lessons & 30% higher user retention through progress tracking.",
      technologies: ["React", "Node.js", "Firebase"],
      githubLink: null,
      liveLink: null,
    },
    {
      title: "HostelEase",
      icon: BsBuilding,
      description: "Streamlined hostel booking system for 500+ students, reducing administrative overhead and manual registration by 50%.",
      technologies: ["React", "Node.js", "MongoDB"],
      githubLink: "https://github.com/AmosQuety/HostelEase",
      liveLink: null,
    },
    {
      title: "PyCodeCommenter",
      icon: SiPypi,
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
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold mb-12 text-center text-slate-100"
        >
          My <span className="text-cyan-400">Projects</span>
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
          viewport={{ once: true, amount: 0.2 }}
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