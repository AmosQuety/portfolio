/* eslint-disable react/no-unescaped-entities */

const Coder = () => {
  return (
    <div className="w-full h-full border-2 border-gray-600 relative rounded-lg shadow-lg overflow-hidden">
      {/* Window Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 border-b-2 border-gray-600 flex items-center px-3">
        <div className="flex items-center space-x-2">
          <div className="bg-red-500 w-3 h-3 rounded-full"></div>
          <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
          <div className="bg-green-500 w-3 h-3 rounded-full"></div>
        </div>
      </div>

      {/* Code Content Area */}
      <div className="pt-10 h-full overflow-x-auto">
        <div className="p-3 sm:p-4 md:p-6">
          <pre className="text-gray-200 font-mono text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre">
            {/* --- START: Mission-Driven Professional Snippet --- */}
            <span className="text-pink-400">const</span>{" "}
            <span className="text-white">amos</span>{" "}
            <span className="text-gray-200">=</span>{" "}
            <span className="text-gray-200">{"{"}</span>
            <br />
            <span className="ml-4">role</span>
            <span className="text-gray-200">:</span>{" "}
            <span className="text-yellow-400">'Software Engineer'</span>
            <span className="text-gray-200">,</span>
            <br />
            <span className="ml-4">mission</span>
            <span className="text-gray-200">:</span>{" "}
            <span className="text-yellow-400">
              'Building tech for underserved communities'
            </span>
            <span className="text-gray-200">,</span>
            <br />
            <span className="ml-4">methodologies</span>
            <span className="text-gray-200">:</span>{" "}
            <span className="text-gray-200">[</span>
            <span className="text-green-400">'User-Centric Design'</span>
            <span className="text-gray-200">,</span>{" "}
            <span className="text-green-400">'Agile'</span>
            <span className="text-gray-200">,</span>{" "}
            <span className="text-green-400">'Impact-Driven Dev'</span>
            <span className="text-gray-200">],</span>
            <br />
            <span className="ml-4 text-pink-600">createImpact</span>
            <span className="text-gray-200">:</span>{" "}
            <span className="text-amber-400">async</span>{" "}
            <span className="text-gray-200">()</span>{" "}
            <span className="text-gray-200">=></span>{" "}
            <span className="text-gray-200">{"{"}</span>
            <br />
            {"  "}
            <span className="ml-6 text-pink-400">const</span>{" "}
            <span className="text-white">project</span>{" "}
            <span className="text-gray-200">=</span>{" "}
            <span className="text-amber-400">await</span>{" "}
            <span className="text-white">ideate</span>
            <span className="text-gray-200">(</span>
            <span className="text-green-400">'newChallenge'</span>
            <span className="text-gray-200">);</span>
            <br />
            {"  "}
            <span className="ml-6 text-pink-400">return</span>{" "}
            <span className="text-amber-400">await</span>{" "}
            <span className="text-white">deliver</span>
            <span className="text-gray-200">(</span>
            <span className="text-white">project</span>
            <span className="text-gray-200">);</span>
            <br />
            <span className="ml-4 text-gray-200">{"}"},</span>
            <br />
            <span className="text-gray-200">{"}"}</span>
            <span className="text-gray-200">;</span>
            {/* --- END: Mission-Driven Professional Snippet --- */}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Coder;
