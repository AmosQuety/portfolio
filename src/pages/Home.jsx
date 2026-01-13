/* eslint-disable react/no-unescaped-entities */
import About from "./About"; 
import ExperienceSection from "./ExperienceSection";
import Skills from "./Skills";
import Education from "./Education";
import Projects from "./projects/Projects";
import Coder from "./Coder"; 
import Header from "../components/Header"; 
import GeminiConcierge from "../components/GeminiConcierge";
import ConnectivitySlider from "../components/ConnectivitySlider";
import { useState } from "react";
import PropTypes from "prop-types";
import { ContactSection } from "./Sections/ContactSection";
import { Learning } from "./CurrentlyLearning/Learning";
import { usePortfolio } from "../context/PortfolioContext";
import CodeReview from "./Sections/CodeReview";
import TransparencyFooter from "../components/TransparencyFooter";

const PageSection = ({ id, children, className = "", scrollMarginClass }) => {
  return (
    <section id={id} className={`${className} ${scrollMarginClass}`}>
      {children}
    </section>
  );
};

PageSection.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  scrollMarginClass: PropTypes.string,
};

const sections = [
  { id: "about", navText: "ABOUT", Component: About, wrapperClassName: "mt-16 md:mt-24" },
  { id: "education", navText: "EDUCATION", Component: Education, wrapperClassName: "mt-16 md:mt-24" },
  { id: "experience", navText: "EXPERIENCE", Component: ExperienceSection, wrapperClassName: "mt-16 md:mt-24" },
  { id: "skills", navText: "SKILLS", Component: Skills, wrapperClassName: "mt-16 md:mt-24" },
  { id: "projects", navText: "PROJECTS", Component: Projects, wrapperClassName: "mt-16 md:mt-24 py-10" },
];

const navItems = sections.map((section) => ({
  href: `#${section.id}`,
  text: section.navText,
}));

const SITE_TITLE = "Nabasa Amos";
const RESUME_FILE_NAME = "Nabasa_Amos_CV.pdf";
const SCROLL_MARGIN_TOP_CLASS = "scroll-mt-16";
const HEADER_HEIGHT_PADDING_CLASS = "pt-16";

function Home() {
  const [connection, setConnection] = useState("fast");
  const { activeLens } = usePortfolio();

  const isResilientMode = activeLens === 'resilient';
  const isEngineerMode = activeLens === 'engineer';

  return (
    <div className="bg-darkBlue text-white  min-h-screen">
      <Header navItems={navItems} siteTitle={SITE_TITLE} />
      
      {/* Visual Empathy Overlay for Resilient Lens */}
      {isResilientMode && (
        <div className="fixed inset-0 z-[999] pointer-events-none opacity-[0.03]"
             style={{
               background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                            linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))`,
               backgroundSize: '100% 2px, 3px 100%'
             }}
        />
      )}

      <main className={`px-4 sm:px-8 lg:px-20 ${HEADER_HEIGHT_PADDING_CLASS} transition-all duration-700 ${isResilientMode ? 'grayscale-[0.8] contrast-[1.2]' : ''}`}>
        {/* Intro Section */}
        <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-16 pt-10">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-9">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-300 mb-12">
              <div className="text-white leading-relaxed">
                <div>Hello,</div>
                <span>I'm <span className="text-pink-400">{SITE_TITLE}</span>,</span>
              </div>
              <div className="my-2 sm:my-3"> a passionate</div>
              <div className="text-amber-600">Software Developer.</div>
            </div>

            <div className="mt-4 mb-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl shadow-lg transition duration-300"
              >
                Contact Me
              </button>
              <a href={`/${RESUME_FILE_NAME}`} download className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-center px-6 py-2.5 rounded-2xl shadow-lg transition duration-300">
                Get Resume
              </a>
            </div>
          </div>

          {/* ADAPTIVE CODER SECTION (Hidden in Resilient Lens) */}
          <div className="w-full lg:w-1/2 mt-10 lg:mt-0 rounded-lg shadow-lg p-3 sm:p-6 text-gray-300 min-h-[300px] flex items-center justify-center">
            {isResilientMode ? (
              <div className="border border-dashed border-slate-700 p-10 rounded-2xl text-center w-full bg-slate-900/40">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Resilience Lens Active</p>
                <p className="text-sm text-slate-300 italic">"Visual intensity reduced for low-end hardware empathy."</p>
              </div>
            ) : connection === 'fast' ? (
              <Coder /> 
            ) : (
              <div className="border border-dashed border-slate-700 p-10 rounded-2xl text-center w-full bg-slate-900/40">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Efficiency Mode</p>
                <p className="text-sm text-slate-300 italic">"Visual assets paused to prioritize {connection === 'offline' ? 'local' : 'low-bandwidth'} performance."</p>
              </div>
            )}
          </div>
        </div>

        {/* Passing 'connection' prop to all components in sections */}
        {sections.map(({ id, Component, wrapperClassName }) => (
          <PageSection key={id} id={id} className={wrapperClassName} scrollMarginClass={SCROLL_MARGIN_TOP_CLASS}>
            <Component connection={connection} /> 
          </PageSection>
        ))}

        {isEngineerMode && <CodeReview />}

        <ContactSection />
        <Learning />
        
        {/* Simulator moved to bottom-left */}
        <ConnectivitySlider connection={connection} setConnection={setConnection} />
        <GeminiConcierge connection={connection} />

        <TransparencyFooter siteTitle={SITE_TITLE} />
      </main>
    </div>
  );
}

export default Home;