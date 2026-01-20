import { useEffect } from "react"; // Don't forget useEffect
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const Skills = () => {
  const { activeLens } = usePortfolio();
  const skills = [
    { name: "NodeJS", logo: "nodejs.png", useCase: "Event-driven Microservices & Rapid Backend Scaling" },
    { name: "Mobile App Dev't", logo: "app.png", useCase: "Offline-First Architectures with React Native" },
    { name: "Javascript", logo: "js.png", useCase: "Modern ES6+ Logic & Async Pattern Mastery" },
    { name: "PHP", logo: "php.png", useCase: "Legacy System Integration & Stability" },
    { name: "AI", logo: "robot.png", useCase: "Generative Agentic Flows with Gemini & RAG" },
    { name: "React", logo: "react.png", useCase: "High-Performance Component Composition (React 19)" },
    { name: "MongoDB", logo: "mongodb.png", useCase: "Flexible NoSQL Schema Design & Vector Search" },
  ];

  const duplicatedSkills = [...skills, ...skills];

  const controls = useAnimation(); 
  const prefersReducedMotion = useReducedMotion();
  const isResilientMode = activeLens === 'resilient';

  const containerVariants = {
    animate: {
      x: ["100%", "-100%"], 
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "reverse", 
          duration: 30, 
          ease: "linear",
        },
      },
    },
  };

  const reducedMotionContainerVariants = {
    animate: {
      x: 0, 
      transition: { duration: 0 },
    },
  };

  useEffect(() => {
    if (!prefersReducedMotion && !isResilientMode) {
      controls.start("animate"); 
    } else {
      controls.start(reducedMotionContainerVariants.animate); 
    }
    return () => controls.stop();
  }, [controls, prefersReducedMotion, isResilientMode]);

  // Handler to pause animation on mouse enter
  const handleMouseEnter = () => {
    if (!prefersReducedMotion) {
      controls.stop();
    }
  };

  // Handler to resume animation on mouse leave
  const handleMouseLeave = () => {
    if (!prefersReducedMotion) {
      controls.start("animate"); // Resume the "animate" variant
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-[#0d1224] via-black to-purple-900 py-16 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {" "}
        {/* Responsive container padding */}
        <div className="flex flex-col items-center">
          <div className="h-[3px] w-2/3 max-w-md bg-gradient-to-r from-transparent via-purple-600 to-transparent mb-6" />
          <h2 className="text-purple-500 text-center text-3xl md:text-4xl font-bold mb-10 py-2 px-4 rounded-md bg-opacity-50 uppercase tracking-widest font-['Geist']">
            Skills
          </h2>

          {/* Viewport for the scrolling animation. Hover events are attached here. */}
          <button
            type="button"
            className="relative overflow-hidden w-full cursor-pointer focus:outline-none" // Added cursor-pointer as a hint
            aria-label="Pause or resume skills animation"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMouseEnter();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                handleMouseLeave();
              }
            }}
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
            tabIndex={0}
            style={{ background: "none", border: "none", padding: 0 }}
          >
            <motion.div
              className="flex space-x-4 sm:space-x-6 md:space-x-8" // Responsive spacing between cards
              variants={
                prefersReducedMotion
                  ? reducedMotionContainerVariants
                  : containerVariants
              }
              animate={controls} // Animation is now controlled by the 'controls' object
            >
              {duplicatedSkills.map((skill, index) => (
                <div
                  key={`${skill.name}-${index}`} // More unique key for duplicated items
                  className={`flex-shrink-0 
                             ${activeLens === 'engineer' ? 'w-[180px] h-[220px]' : 'w-[120px] h-[150px] sm:w-[140px] sm:h-[170px] md:w-[150px] md:h-[180px] lg:w-[160px] lg:h-[190px]'} 
                             rounded-xl p-3 sm:p-4 border border-purple-700 
                             shadow-lg bg-gradient-to-br from-[#1f1f2e] to-[#2e2e44] 
                             flex flex-col items-center justify-center
                             transition-all duration-300 ease-in-out
                             hover:shadow-2xl hover:shadow-purple-500/60 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-purple-500`}
                  // Responsive card sizes and hover effect
                >
                  <img
                    src={skill.logo} // Make sure these paths are correct (e.g., in /public folder)
                    alt={`${skill.name} logo`}
                    className="object-contain mb-2 sm:mb-3
                               h-10 w-10              /* Base image size */
                               sm:h-12 sm:w-12        /* Small screens */
                               md:h-14 md:w-14        /* Medium screens */
                               lg:h-16 lg:w-16        /* Large screens */
                               " // Responsive image sizes
                  />
                  <p
                    className="text-white text-center font-semibold
                                text-xs                /* Base text size */
                                sm:text-sm             /* Small screens and up */
                                "
                  >
                    {skill.name}
                  </p>
                  {activeLens === 'engineer' && (
                    <p className="text-[10px] text-purple-300 text-center mt-2 leading-tight opacity-90 italic">
                      {skill.useCase}
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
