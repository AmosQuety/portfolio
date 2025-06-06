import { useState } from "react";
import { FaEnvelope, FaCheck } from "react-icons/fa";

const CopyEmailButton = () => {
  const [isCopied, setIsCopied] = useState(false);
  const email = "amosnabasa4@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setIsCopied(true);

    // Reset the "Copied" state after a few seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  return (
    <div className="text-center mt-12">
      <p className="text-slate-400 mb-3">
        Prefer to use your own email client?
      </p>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-slate-800 border border-slate-700
                   text-slate-300 font-semibold transition-all duration-300
                   hover:border-cyan-400/50 hover:text-cyan-300"
      >
        {isCopied ? (
          <>
            <FaCheck className="text-green-400" />
            <span>Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <FaEnvelope />
            <span>Copy My Email Address</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CopyEmailButton;
