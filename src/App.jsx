import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import PageNotFound from "./pages/pageNotFound/PageNotFound";
import { PortfolioProvider } from "./context/PortfolioContext";

const App = () => {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
};

export default App;
