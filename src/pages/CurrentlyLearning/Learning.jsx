import { LearningCard } from "../../pages/CurrentlyLearning/LearningCard";
import { motion } from "framer-motion";
import { SiRust, SiDocker } from "react-icons/si";
import { FaNetworkWired, FaMobileAlt } from "react-icons/fa";

export const Learning = () => {
  const learningGoals = [
    {
      icon: SiRust,
      name: "Rust",
      context:
        "Actively learning the ownership model and concurrency patterns by building a small multi-threaded web server from scratch.",
      colorClass: "text-orange-400",
    },
    {
      icon: FaNetworkWired,
      name: "System Design Principles",
      context:
        "Studying common architectural patterns (e.g., Microservices, Event-Driven).",
      colorClass: "text-yellow-400",
    },
    {
      icon: SiDocker,
      name: "Docker & Containerization",
      context:
        "Improving my DevOps skills by containerizing personal projects and exploring Docker Compose for scalable environments.",
      colorClass: "text-blue-400",
    },
    {
      icon: FaMobileAlt,
      name: "Offline-first Design",
      context:
        "Exploring service workers and IndexedDB for offline resilience in low-bandwidth apps—ensuring high availability and UX.",
      colorClass: "text-green-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-slate-900 p-6 md:p-10 rounded-2xl border border-slate-800 shadow-xl"
    >
      <h3 className="text-2xl md:text-3xl font-bold mb-8 text-slate-100 flex items-center gap-4">
        <motion.span
          className="text-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          ⟳
        </motion.span>
        <span className="tracking-tight">Currently Learning</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {learningGoals.map((goal, index) => (
          <motion.div
            key={goal.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <LearningCard {...goal} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
