/* eslint-disable react/no-unescaped-entities */
const ExperienceSection = () => {
  const experiences = [
    {
      role: "Software Developer Intern",
      company: "CAMTech Uganda",
      period: "Sept 2023 - Oct 2023",
      highlights: [
        "Built health-focused voicebot (Python, ESP32, ChatGPT API) enabling 100+ users to access health info via touchless voice queries",
        "Led cross-functional team as Project Manager, delivering the MVP on time",
      ],
    },
    {
      role: "Full Stack Developer Intern",
      company: "John Vince Engineering",
      period: "June 2024 - July 2024",
      highlights: [
        "Developed HostelEase (React, Node.js, MongoDB) booking system used by 500+ students",
        "Reduced manual registration efforts by 50% with secure auth and real-time availability filters",
      ],
    },
    {
      role: "Software Contributor",
      company: "Ment-Well Hackathon",
      period: "October 2023",
      highlights: [
        "Prototyped mental health chatbot with AI/Conversational UI in team sprint",
        "Implemented natural language processing for user interactions",
      ],
    },
    {
      role: "Leadership & Volunteering",
      company: "St. Luke's Chapel",
      period: "2023 - 2024",
      highlights: [
        "Mentored 20+ members and coordinated outreach programs",
        "Organized tech skills workshops for community youth",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="w-full bg-gradient-to-b from-gray-900 to-black py-12 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-light-green-500 mb-4 tracking-tight">
            Professional Experience
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            My journey through impactful roles and contributions
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-light-green-500/30"
            >
              {/* Decorative element */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-light-green-500/10 rounded-full group-hover:bg-light-green-500/20 transition-all duration-500"></div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {exp.role}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-light-green-500/20 text-light-green-400 rounded-full text-sm font-medium">
                    {exp.period}
                  </span>
                </div>

                <p className="text-lg text-light-green-400 font-medium mb-4">
                  {exp.company}
                </p>

                <ul className="space-y-3">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-light-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Skills tag cloud at bottom */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-300 mb-6">
            Technologies I've Worked With
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "Python",
              "React",
              "Node.js",
              "MongoDB",
              "JavaScript",
              "TypeScript",
              "Flask",
              "Firebase",
              "AWS",
              "Docker",
              "Git",
              "TensorFlow",
              "REST APIs",
              "React Native",
              "Tailwind CSS",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm font-medium hover:bg-light-green-500/20 hover:text-light-green-400 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
