// components/LearningCard.js
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export const LearningCard = ({ icon: Icon, name, context, colorClass }) => (
  // The Magic: Gradient Border. Parent is the border, child is the content.
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="h-full p-[1.5px] rounded-xl bg-gradient-to-b from-slate-700/80 to-slate-800/20
               hover:from-cyan-400/50 hover:to-slate-800/20 transition-all duration-300 group
               shadow-lg hover:shadow-cyan-500/10"
  >
    <div className="h-full bg-slate-800/90 backdrop-blur-sm p-5 rounded-[11px] flex items-start gap-4">
      {/* Icon Container */}
      <div
        className={`mt-1 flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-slate-700/60 
                   ${colorClass} group-hover:bg-cyan-900/50 group-hover:text-cyan-300 transition-all duration-300`}
      >
        <Icon size={22} />
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <h4 className="font-bold text-slate-100 text-lg mb-1 group-hover:text-cyan-300 transition-colors duration-300">
          {name}
        </h4>
        <p className="text-sm text-slate-400 leading-relaxed">{context}</p>
      </div>
    </div>
  </motion.div>
);

LearningCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  name: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  colorClass: PropTypes.string,
};
