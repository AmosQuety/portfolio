import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaWhatsapp,
  FaTerminal,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CopyEmailButton from "../CopyEmailButton";

const socialLinks = [
  {
    icon: <FaLinkedin className="text-blue-400" size={20} />,
    name: "LinkedIn",
    url: "https://linkedin.com/in/nabasa-amos",
    color: "hover:bg-blue-400/10",
  },
  {
    icon: <FaTwitter className="text-sky-400" size={20} />,
    name: "X/Twitter",
    url: "https://x.com/amosnabasa7",
    color: "hover:bg-sky-400/10",
  },
  {
    icon: <FaGithub className="text-purple-400" size={20} />,
    name: "GitHub",
    url: "https://github.com/AmosQuety",
    color: "hover:bg-purple-400/10",
  },

  {
    icon: <FaWhatsapp className="text-green-400" size={20} />,
    name: "WhatsApp",
    url: "https://wa.me/256703293471",
    color: "hover:bg-green-400/10",
  },
];

export const SocialLinks = () => {
  const handleEmailClick = (e, url) => {
    // Only prevent default for email links
    if (url.startsWith("mailto:")) {
      e.preventDefault();
      window.location.href = url;
    }
    // Other links will follow their normal behavior
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-slate-800/40 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-2xl"
    >
      <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2 uppercase tracking-widest">
        <FaTerminal className="text-pink-400" />
        Connect with me
      </h3>

      <div className="space-y-4">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target={link.url.startsWith("mailto:") ? "_self" : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => handleEmailClick(e, link.url)}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${link.color} border border-slate-700/50`}
          >
            <div className="p-2 rounded-lg bg-slate-700/50">{link.icon}</div>
            <span className="font-medium text-slate-300">{link.name}</span>
          </a>
        ))}
      </div>
      <CopyEmailButton />
    </motion.div>
  );
};
