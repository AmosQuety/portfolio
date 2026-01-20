import React, { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [activeLens, setActiveLens] = useState('recruiter');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);

  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const toggleLargeFont = () => setIsLargeFont(prev => !prev);
  const toggleConsole = () => setIsConsoleOpen(prev => !prev);

  return (
    <PortfolioContext.Provider value={{ 
      activeLens, setActiveLens, 
      isHighContrast, toggleHighContrast,
      isLargeFont, toggleLargeFont,
      isConsoleOpen, setIsConsoleOpen, toggleConsole
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
