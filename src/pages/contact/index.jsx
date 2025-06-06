import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { SocialLinks } from "./SocialLinks";

const index = () => {
  return (
    <section
      id="contact"
      className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-slate-900 text-slate-300"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold mb-12 text-center text-slate-100"
        >
          Get In <span className="text-yellow-400">Touch</span>
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ContactForm />
          <SocialLinks />
        </div>
      </div>
    </section>
  );
};

export default index;
