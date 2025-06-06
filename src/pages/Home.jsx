/* eslint-disable react/no-unescaped-entities */

// Import section-specific components that will be used in the 'sections' array
import About from "./About"; // Assuming these are in the same 'pages' directory or adjust path
import ExperienceSection from "./ExperienceSection";
import Skills from "./Skills";
import Education from "./Education";
import Projects from "./projects/Projects";
import Coder from "./Coder"; // For the intro section

// The Header component remains external as per the previous structure
import Header from "../components/Header"; // Adjust path if needed

// ---------------------------------------------------------------------------
// Inlined PageSection Component (previously src/components/PageSection.jsx)
// ---------------------------------------------------------------------------
import PropTypes from "prop-types";
import { ContactSection } from "./Sections/ContactSection";
import { Learning } from "./CurrentlyLearning/Learning";

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

// ---------------------------------------------------------------------------
// Inlined Configuration (previously src/config/pageSections.js)
// ---------------------------------------------------------------------------
// Define a consistent scroll margin for all sections

// Define the sections of your page
const sections = [
  {
    id: "about",
    navText: "ABOUT",
    Component: About,
    wrapperClassName: "mt-16 md:mt-24", // Spacing after the intro section
  },
  {
    id: "education",
    navText: "EDUCATION",
    Component: Education,
    // Let Education component handle its own internal padding and layout.
    // Add top margin for spacing from the 'About' section.
    wrapperClassName: "mt-16 md:mt-24",
  },
  {
    id: "experience",
    navText: "EXPERIENCE",
    Component: ExperienceSection,
    // Let ExperienceSection handle its own internal padding and layout.
    // Add top margin for spacing from the 'Education' section.
    wrapperClassName: "mt-16 md:mt-24",
  },
  {
    id: "skills",
    navText: "SKILLS",
    Component: Skills,
    // Let Skills component handle its own internal padding and layout.
    // Add top margin for spacing from the 'Experience' section.
    wrapperClassName: "mt-16 md:mt-24",
  },
  {
    id: "projects",
    navText: "PROJECTS",
    Component: Projects,
    // py-10 from before could be part of the component's internal padding or here.
    // For consistency, better inside the component or as a top margin.
    wrapperClassName: "mt-16 md:mt-24 py-10", // Or just "mt-16 md:mt-24" and Projects handles py-10
  },
];

// Navigation items derived from the sections array
const navItems = sections.map((section) => ({
  href: `#${section.id}`,
  text: section.navText,
}));
// ---------------------------------------------------------------------------
// End of Inlined Code
// ---------------------------------------------------------------------------

// Constants for the Home page layout and content
const SITE_TITLE = "Nabasa Amos";
// This padding-top for the main content area should correspond to your header's height
const RESUME_FILE_NAME = "My CV.pdf";

// If header is h-16 (4rem / 64px)
const SCROLL_MARGIN_TOP_CLASS = "scroll-mt-16";
const HEADER_HEIGHT_PADDING_CLASS = "pt-16";

// If header is h-20 (5rem / 80px)
// const SCROLL_MARGIN_TOP_CLASS = "scroll-mt-20";
// const HEADER_HEIGHT_PADDING_CLASS = "pt-20";

function Home() {
  return (
    <div className="bg-darkBlue text-white min-h-screen">
      <Header navItems={navItems} siteTitle={SITE_TITLE} />

      {/* Main content area with padding to offset fixed header */}
      <main className={`px-4 sm:px-8 lg:px-20  ${HEADER_HEIGHT_PADDING_CLASS}`}>
        {/* Intro Section (Unique layout, handled separately) */}
        <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-16 pt-10">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-9">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-300 mb-12">
              <div className="text-white leading-relaxed">
                <div>Hello,</div>
                <span>
                  I'm <span className="text-pink-400">{SITE_TITLE}</span>,
                </span>
              </div>
              <div className="my-2 sm:my-3"> a passionate</div>
              <div className="text-amber-600">Software Developer.</div>
            </div>

            {/* <div className="flex justify-center lg:justify-start gap-4 sm:gap-5 mb-6 sm:mb-8 text-xl sm:text-2xl text-gray-300">
              <FaYoutube className="hover:text-red-500 transition duration-300 cursor-pointer" />
              <FaGithub className="hover:text-gray-400 transition duration-300 cursor-pointer" />
              <FaLinkedin className="hover:text-blue-400 transition duration-300 cursor-pointer" />
              <FaTwitter className="hover:text-blue-400 transition duration-300 cursor-pointer" />
            </div> */}
            <div className="mt-4 mb-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              {/* Contact Me Button (mailto link) */}
              <button
                onClick={() => {
                  const contactForm = document.getElementById("contact-form");
                  if (contactForm) {
                    contactForm.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white text-center px-6 py-2.5 rounded-2xl shadow-lg transition duration-300 block"
              >
                Contact Me
              </button>
              {/* Get Resume Button (Download Link) */}
              <a
                href={`/${RESUME_FILE_NAME}`} // Path relative to the public folder
                download={RESUME_FILE_NAME} // Suggests the filename for download
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-center px-6 py-2.5 rounded-2xl shadow-lg transition duration-300 block"
              >
                Get Resume
              </a>
              {/* <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-2xl shadow-lg transition duration-300">
                Get Resume
              </button> */}
            </div>
          </div>
          <div className="w-full lg:w-1/2 mt-10 lg:mt-0 rounded-lg shadow-lg p-3 sm:p-6 text-gray-300">
            <Coder />
          </div>
        </div>

        {/* Dynamically Rendered Sections from the 'sections' array */}
        {sections.map(
          ({ id, Component, wrapperClassName, componentProps = {} }) => (
            <PageSection
              key={id}
              id={id}
              className={wrapperClassName}
              scrollMarginClass={SCROLL_MARGIN_TOP_CLASS}
            >
              <Component {...componentProps} />{" "}
              {/* Pass any specific props if defined */}
            </PageSection>
          )
        )}

        <ContactSection />

        <Learning />

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-400 text-sm py-6 border-t border-gray-700">
          © {new Date().getFullYear()} {SITE_TITLE}. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
}

export default Home;
