import { ContactForm } from "../contact/ContactForm";
import { SocialLinks } from "../contact/SocialLinks";
import { motion } from "framer-motion";

export const ContactSection = () => (
  <section
    id="contact"
    className="py-16 md:py-24 bg-slate-900 text-slate-300 border-t border-slate-800"
  >
    <div className="container mx-auto px-4 max-w-5xl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold mb-12 text-center text-slate-100 uppercase tracking-widest font-['Geist']"
      >
        Get In <span className="text-cyan-400">Touch</span>
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm />
        <SocialLinks />
      </div>
    </div>
  </section>
);
