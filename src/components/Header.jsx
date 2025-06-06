// src/components/Header.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const HamburgerIcon = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className="text-white focus:outline-none md:hidden" // Hide on md screens and up
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12" // X icon for close
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7" // Hamburger icon
        />
      )}
    </svg>
  </button>
);

HamburgerIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const Header = ({ navItems, siteTitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu if a nav link is clicked (for single-page app navigation)
  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Optional: Close mobile menu if screen size increases past mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        // 768px is Tailwind's `md` breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <header
      className="fixed top-0 left-0 w-full h-16 sm:h-20 p-5 flex justify-between items-center bg-darkBlue bg-opacity-90 shadow-md z-50"
      // Consider a fixed height like h-15 or h-20 if you want more predictability
      // For example: className="fixed top-0 left-0 w-full h-15 md:h-20 p-5 flex justify-between items-center ..."
    >
      {/* Site Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-light-green-200">
        {siteTitle}
      </h1>

      {/* Hamburger Menu Button - Visible on small screens */}
      <div className="md:hidden">
        <HamburgerIcon onClick={toggleMobileMenu} isOpen={isMobileMenuOpen} />
      </div>

      {/* Desktop Navigation - Visible on medium screens and up */}
      <nav className="hidden md:flex gap-6 lg:gap-8 text-base lg:text-lg font-medium">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hover:text-pink-400 transition duration-300"
          >
            {item.text}
          </a>
        ))}
      </nav>

      {/* Mobile Navigation Menu - Conditionally rendered */}
      {isMobileMenuOpen && (
        <nav
          className="absolute top-full left-0 w-full bg-darkBlue shadow-lg md:hidden flex flex-col items-center py-4 space-y-3"
          // `top-full` positions it right below the header.
          // Ensure header has a defined height or `top-full` is based on its content height.
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavLinkClick} // Close menu on click
              className="text-white hover:text-pink-400 transition duration-300 text-lg py-2"
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

Header.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  siteTitle: PropTypes.string.isRequired,
};

export default Header;
