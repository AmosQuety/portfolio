import React, { createContext, useContext, useState } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [activeLens, setActiveLens] = useState('recruiter');

  return (
    <PortfolioContext.Provider value={{ activeLens, setActiveLens }}>
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
