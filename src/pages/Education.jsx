function Education() {
  const education = [
    {
      institution: "Mbarara University of Science and Technology",
      degree: "Bachelor of Science in Software Engineering",
      period: "2021 - 2025",
      details: [
        "Specialized in full-stack development, AI fundamentals, and agile project management",
        "Final Year Project: Crop and Fertilizer Recommendation System (IoT & ML)",
        "Key coursework: Distributed Systems, Human-Computer Interaction, Data Structures",
      ],
      logo: "/must.png", // Assuming you have a logo image in public folder
    },
  ];

  return (
    <section
      id="education"
      className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-light-green-500 uppercase tracking-widest font-['Geist']">
          Education
        </h2>

        <div className="space-y-8 md:space-y-10">
          {education.map((edu) => (
            <div
              key={edu.institution}
              className="group relative bg-gray-800/70 hover:bg-gray-800/90 p-6 md:p-8 rounded-2xl shadow-xl border-l-4 border-light-green-500 transition-all duration-300 hover:shadow-2xl overflow-hidden"
            >
              {/* Optional decorative element */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-light-green-500/10 rounded-full group-hover:bg-light-green-500/20 transition-all duration-500"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Institution Logo - optional */}
                  {edu.logo && (
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-white/5 p-2 flex items-center justify-center">
                      <img
                        src={edu.logo}
                        alt={`${edu.institution} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {edu.degree}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-light-green-500/20 text-light-green-400 rounded-full text-sm font-medium">
                        {edu.period}
                      </span>
                    </div>

                    <p className="text-lg font-medium text-light-green-400 mb-4">
                      {edu.institution}
                    </p>

                    <ul className="space-y-3">
                      {edu.details.map((detail) => (
                        <li key={detail} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-light-green-500 mt-0.5 mr-2 flex-shrink-0"
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
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;
