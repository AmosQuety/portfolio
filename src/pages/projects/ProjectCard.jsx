import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";
import PropTypes from "prop-types";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

function ProjectCard({ project }) {
  // Use a fallback icon if a custom one isn't provided
  const IconComponent = project.icon || FaCode;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-slate-700/50 flex flex-col 
                 transition-all duration-300 ease-in-out hover:shadow-cyan-500/10 hover:border-cyan-400/30"
    >
      {/* --- CARD HEADER --- */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-400/10 p-2.5 rounded-lg">
            <IconComponent className="text-cyan-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-100 group">
            {/* If there's a live link, make the title the primary link */}
            {project.liveLink ? (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.title}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-2 text-cyan-400/50">
                  →
                </span>
              </a>
            ) : (
              project.title
            )}
          </h3>
        </div>
      </div>

      {/* --- DESCRIPTION --- */}
      <p className="mb-6 text-slate-400 text-sm leading-relaxed">
        {project.description}
      </p>

      {/* --- FOOTER (TECHNOLOGIES & LINKS) --- */}
      <div className="mt-auto">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-slate-700/60 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 text-slate-400">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors"
              aria-label={`View source code for ${project.title}`}
            >
              <FaGithub size={20} />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors"
              aria-label={`View live demo for ${project.title}`}
            >
              <FaExternalLinkAlt size={18} />
            </a>
          )}
        </div>
      </div>
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
