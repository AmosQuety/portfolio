import { useEffect } from "react"; // Don't forget useEffect
import { motion, useAnimation, useReducedMotion } from "framer-motion";

const Skills = () => {
  const skills = [
    { name: "NodeJS", logo: "nodejs.png" },
    { name: "Mobile App Dev't", logo: "app.png" },
    { name: "Javascript", logo: "js.png" },
    { name: "PHP", logo: "php.png" },
    { name: "AI", logo: "robot.png" },
    { name: "React", logo: "react.png" },
    { name: "MongoDB", logo: "mongodb.png" },
  ];

  // Duplicate skills for a smoother continuous animation, especially with "reverse"
  // This ensures there's enough content to scroll back and forth without empty gaps.
  const duplicatedSkills = [...skills, ...skills];

  const controls = useAnimation(); // Hook to control animations
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    animate: {
      x: ["100%", "-100%"], // Moves the content from off-screen right to off-screen left
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "reverse", // Patrols back and forth
          duration: 30, // Adjusted duration, feel free to tweak for speed
          ease: "linear",
        },
      },
    },
  };

  // Variant for users who prefer reduced motion (animation will be static)
  const reducedMotionContainerVariants = {
    animate: {
      x: 0, // Static position
      transition: { duration: 0 },
    },
  };

  // Start animation on mount, respecting reduced motion preference
  useEffect(() => {
    if (!prefersReducedMotion) {
      controls.start("animate"); // Start the "animate" variant
    } else {
      controls.start(reducedMotionContainerVariants.animate); // Go directly to the static state
    }
    // Optional: Stop animation on component unmount
    return () => controls.stop();
  }, [controls, prefersReducedMotion, reducedMotionContainerVariants.animate]);

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
          <h2 className="text-purple-500 text-center text-3xl md:text-4xl font-bold mb-10 py-2 px-4 rounded-md bg-opacity-50 tracking-wide">
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
                  className="flex-shrink-0 
                             w-[120px] h-[150px]       /* Base size (extra small screens) */
                             sm:w-[140px] sm:h-[170px] /* Small screens and up */
                             md:w-[150px] md:h-[180px] /* Medium screens and up */
                             lg:w-[160px] lg:h-[190px] /* Large screens and up */
                             rounded-xl p-3 sm:p-4 border border-purple-700 
                             shadow-lg bg-gradient-to-br from-[#1f1f2e] to-[#2e2e44] 
                             flex flex-col items-center justify-center
                             transition-all duration-300 ease-in-out
                             hover:shadow-2xl hover:shadow-purple-500/60 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-purple-500"
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
