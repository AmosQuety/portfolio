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
    <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2 uppercase tracking-widest">
        <FaEnvelope className="text-cyan-400" />
        Message
      </h3>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-5"
        id="contact-form"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
          >
            Name
          </label>
          <input
            type="text"
            name="from_name"
            id="name"
            required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
          >
            Email
          </label>
          <input
            type="email"
            name="from_email"
            id="email"
            required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            placeholder="name@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
            placeholder="Say whats on your mind ..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 uppercase tracking-widest scale-100 hover:scale-[1.02]"
        >
          Initiate Send
        </button>
      </form>
    </div>
  );
};
