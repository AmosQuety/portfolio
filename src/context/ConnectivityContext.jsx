import React, { createContext, useContext, useState, useEffect } from 'react';

const ConnectivityContext = createContext();

export const ConnectivityProvider = ({ children }) => {
  const [isLowDataMode, setIsLowDataMode] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleLowDataMode = () => setIsLowDataMode((prev) => !prev);

  return (
    <ConnectivityContext.Provider value={{ isLowDataMode, isOffline, toggleLowDataMode }}>
      {children}
    </ConnectivityContext.Provider>
  );
};

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
};
