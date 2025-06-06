import { useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

export const ContactForm = () => {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formRef.current) return;

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent successfully!");
      formRef.current.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("EmailJS Error:", error);
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700/50 shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
        <FaEnvelope className="text-cyan-400" />
        Send me a message
      </h3>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4"
        id="contact-form"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-400 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            name="from_name"
            id="name"
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-400 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="from_email"
            id="email"
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-slate-400 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent"
            placeholder="Your message here..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-2"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};
