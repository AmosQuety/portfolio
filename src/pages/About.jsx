/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

const About = () => {
  const profileImageUrl = "/image2.jpg";
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-light-green-500 mb-10 md:mb-14">
          WHO I AM?
        </h2>

        <div className="flex flex-col md:flex-row gap-10 md:gap-12 lg:gap-16 items-center">
          <div className="w-full md:w-2/5 lg:w-1/3 flex-shrink-0">
            <div className="w-full max-w-sm mx-auto md:max-w-none aspect-[3/4] sm:aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={profileImageUrl}
                alt="Nabasa Amos - A passionate software developer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="w-full md:w-3/5 lg:w-2/3">
            <div className="space-y-5 md:space-y-6 text-base sm:text-lg text-gray-200 leading-relaxed font-sans">
              <p>
                My name is Nabasa Amos, and I build software that turns
                vulnerability and confusion for underserved communities into
                clarity and agency.{" "}
                <span className="font-medium text-light-green-400">
                  This isn't just a technical pursuit; it's deeply personal.
                </span>{" "}
                I've seen firsthand how the right tools can transform lives –
                whether it's addressing my parents' 'bad harvests,' which I
                realized weren't fate but a data gap that tech could solve, or
                empowering a refugee to find life-saving information with a
                simple voice command.
              </p>

              {isExpanded ? (
                <>
                  <p>
                    <span className="font-medium text-light-green-400">
                      My passion is to fix frustrations that are often design
                      flaws, not user shortcomings.
                    </span>{" "}
                    For example, in my Final Year Project, a Crop and Fertilizer
                    Recommendation System, the challenge wasn't just about
                    algorithms; it was ensuring inconsistent IoT sensor data
                    didn't leave farmers in the dark. I tackled this by
                    implementing robust caching and error handling, delivering a
                    system where users could trust the near-real-time soil
                    insights, even with spotty internet. This drive for
                    user-centric solutions also fueled my design for a WhatsApp
                    bot for refugees (RSRS), where enabling simple text and
                    voice commands, even photo recognition for damaged
                    documents, meant bypassing literacy or language barriers.{" "}
                    <span className="italic">
                      One user told us, 'Before, I waited weeks for help. Now I
                      get answers while hiding from my abusive husband.' That's
                      the kind of agency I strive to create.
                    </span>
                  </p>
                  <p>
                    This resourceful problem-solving extends beyond code. When
                    running my popcorn business, I faced overwhelming customer
                    surges. My solution?{" "}
                    <span className="font-medium text-light-green-400">
                      A simple WhatsApp reservation system.
                    </span>{" "}
                    This 'low-tech' fix cut lost sales by 40%, allowed me to
                    serve 25-30% more customers, and even earned comments like,
                    'This feels like VIP service!' It taught me that listening
                    to users and finding frugal, empathetic solutions create
                    immense value –{" "}
                    <span className="font-medium text-light-green-400">
                      a mindset crucial for humanitarian tech.
                    </span>
                  </p>
                  <p>
                    Looking ahead, I'm pursuing a graduate trainee role at an
                    established company primarily to master building scalable,
                    reliable systems—especially ones optimized for low-bandwidth
                    environments—and to build a strong foundation in
                    industrial-grade engineering excellence and meaningful
                    networks.{" "}
                    <span className="font-medium text-light-green-400">
                      Both are essential for my long-term vision: launching
                      ventures that create over 1,000 jobs and deliver impactful
                      digital solutions for underprivileged communities,
                    </span>{" "}
                    particularly in agritech and social impact. I'm eager to
                    bring this blend of user-centric design, technical
                    problem-solving, and entrepreneurial drive to a team that's
                    building truly transformative technology.
                  </p>
                </>
              ) : (
                <p className="font-medium text-light-green-400">
                  My passion is to fix frustrations that are often design flaws,
                  not user shortcomings...
                </p>
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-2 bg-light-green-500 hover:bg-light-green-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
