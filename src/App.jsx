import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import { ConnectivityProvider, useConnectivity } from "./context/ConnectivityContext";
import { SystemConsole } from "./components/SystemConsole";

const AppContent = () => {
  const { isHighContrast, isLargeFont } = usePortfolio();
  const { isOffline } = useConnectivity();
  
  return (
    <div className={`
      ${isHighContrast ? 'high-contrast' : ''} 
      ${isLargeFont ? 'large-font' : ''} 
      ${isOffline ? 'crt-flicker' : ''}
      min-h-screen bg-slate-900 overflow-x-hidden
    `}>
      <SystemConsole />
      {isOffline && <div className="slow-scanline" />}
      <BrowserRouter>
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const App = () => {
  return (
    <PortfolioProvider>
      <ConnectivityProvider>
        <AppContent />
      </ConnectivityProvider>
    </PortfolioProvider>
  );
};

export default App;
