// sections/Projects.js

import { FaLeaf, FaLanguage } from "react-icons/fa"; // Example custom icons
import { SiPypi } from "react-icons/si"; // Specific icon for PyPI
import { BsBuilding } from "react-icons/bs"; // Example icon for HostelEase
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard"; // Import the new component

function Projects() {
  const projects = [
    {
      title: "Crop Advisor",
      icon: FaLeaf, // Custom Icon!
      description:
        "AI-driven web app for crop/fertilizer recommendations with 60% higher accuracy. Optimized UI for low-bandwidth rural users.",
      technologies: ["Python", "Flask", "React", "Machine Learning"],
      githubLink: null, // Gracefully handled
      liveLink: null, // Gracefully handled
    },
    {
      title: "LugaLingo",
      icon: FaLanguage, // Custom Icon!
      description:
        "Gamified language-learning app with personalized lessons & 30% higher user retention through progress tracking.",
      technologies: ["React", "Node.js", "Firebase"],
      githubLink: null,
      liveLink: null,
    },
    {
      title: "HostelEase",
      icon: BsBuilding, // Custom Icon!
      description:
        "Streamlined hostel booking system for 500+ students, reducing administrative overhead and manual registration by 50%.",
      technologies: ["React", "Node.js", "MongoDB"],
      githubLink: "https://github.com/AmosQuety/HostelEase",
      liveLink: null,
    },
    {
      title: "PyCodeCommenter",
      icon: SiPypi, // Custom Icon!
      description:
        "Automated Google-style docstring generator for Python using AST parsing, saving developers significant documentation time.",
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
