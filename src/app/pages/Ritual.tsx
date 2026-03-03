import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import { Send, Mail, AlertCircle } from 'lucide-react';
import { useContactForm } from '../hooks/useContactForm';

export default function Ritual() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { formStatus, errorMessage, submitForm } = useContactForm();

  // Reset form fields after successful submission
  useEffect(() => {
    if (formStatus === 'sent') {
      const resetTimer = setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [formStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#e8e1d3] text-[#2b2820] relative flex flex-col">
      <Navigation />

      <div className="flex-1 container mx-auto px-4 sm:px-8 py-24 max-w-3xl">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-blackletter text-3xl text-[#3a8a7a] mb-3">
            Ritual Contact
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-[#8b7e6a]" />
            <span className="text-mono text-xs text-[#2b2820]/60 tracking-widest">
              TRANSMISSION INTERFACE
            </span>
            <div className="w-16 h-px bg-[#8b7e6a]" />
          </div>
        </motion.div>

        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <p className="text-serif text-base leading-relaxed text-[#2b2820]/80 italic mb-6 text-center">
            "The door only opens from one side. But those who know the frequency can send a signal through."
          </p>
          <p className="text-mono text-sm text-[#2b2820]/70 leading-relaxed text-center">
            Transmit your message through the membrane. All signals are received. Not all will be answered.
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-[#d4cbb8] border-2 border-[#8b7e6a] p-4 sm:p-8 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-mono text-xs text-[#2b2820]/70 mb-2 tracking-wider"
              >
                DESIGNATION
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#e8e1d3] border-2 border-[#8b7e6a] px-4 py-3 text-mono text-sm text-[#2b2820] focus:border-[#3a8a7a] focus:outline-none transition-colors duration-300"
                placeholder="Your name or alias"
              />
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-mono text-xs text-[#2b2820]/70 mb-2 tracking-wider"
              >
                RETURN FREQUENCY
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#e8e1d3] border-2 border-[#8b7e6a] px-4 py-3 text-mono text-sm text-[#2b2820] focus:border-[#3a8a7a] focus:outline-none transition-colors duration-300"
                placeholder="your@email.com"
              />
            </div>

            {/* Message field */}
            <div>
              <label
                htmlFor="message"
                className="block text-mono text-xs text-[#2b2820]/70 mb-2 tracking-wider"
              >
                TRANSMISSION
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                className="w-full bg-[#e8e1d3] border-2 border-[#8b7e6a] px-4 py-3 text-mono text-sm text-[#2b2820] focus:border-[#3a8a7a] focus:outline-none transition-colors duration-300 resize-none"
                placeholder="Enter your message..."
              />
            </div>

            {/* Error message */}
            {formStatus === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-[#c85a3e] bg-[#d4cbb8] p-4 flex items-center gap-3"
              >
                <AlertCircle className="text-[#c85a3e] shrink-0" size={16} />
                <div>
                  <div className="text-mono text-xs text-[#c85a3e] tracking-widest mb-1">SIGNAL INTERRUPTED</div>
                  <div className="text-mono text-xs text-[#2b2820]/60">{errorMessage}</div>
                </div>
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={formStatus === 'sending' || formStatus === 'sent'}
              whileHover={{ scale: formStatus === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: formStatus === 'idle' ? 0.98 : 1 }}
              className={`w-full py-4 border-2 text-mono text-sm tracking-wider flex items-center justify-center gap-3 transition-all duration-300 ${
                formStatus === 'sent'
                  ? 'border-[#3a8a7a] bg-[#3a8a7a] text-[#e8e1d3]'
                  : formStatus === 'sending'
                  ? 'border-[#8b7e6a] bg-[#8b7e6a] text-[#e8e1d3] opacity-70'
                  : formStatus === 'error'
                  ? 'border-[#c85a3e] text-[#c85a3e] hover:bg-[#c85a3e] hover:text-[#e8e1d3]'
                  : 'border-[#3a8a7a] text-[#3a8a7a] hover:bg-[#3a8a7a] hover:text-[#e8e1d3]'
              }`}
            >
              {formStatus === 'sending' && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <AlertCircle size={18} />
                  </motion.div>
                  TRANSMITTING...
                </>
              )}
              {formStatus === 'sent' && (
                <>
                  <Mail size={18} />
                  SIGNAL RECEIVED
                </>
              )}
              {(formStatus === 'idle' || formStatus === 'error') && (
                <>
                  <Send size={18} />
                  SEND TRANSMISSION
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Additional contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Booking */}
          <div className="bg-[#d4cbb8] border-2 border-[#8b7e6a] p-6">
            <div className="text-mono text-xs text-[#2b2820]/70 mb-3 tracking-wider">
              BOOKING / PERFORMANCE RITUALS
            </div>
            <a
              href="mailto:booking@exit.wave"
              className="text-mono text-sm text-[#3a8a7a] hover:text-[#2b2820] transition-all duration-300"
            >
              booking@exit.wave
            </a>
          </div>

          {/* Press */}
          <div className="bg-[#d4cbb8] border-2 border-[#8b7e6a] p-6">
            <div className="text-mono text-xs text-[#2b2820]/70 mb-3 tracking-wider">
              PRESS / MEDIA INQUIRIES
            </div>
            <a
              href="mailto:press@exit.wave"
              className="text-mono text-sm text-[#3a8a7a] hover:text-[#2b2820] transition-all duration-300"
            >
              press@exit.wave
            </a>
          </div>
        </motion.div>

        {/* Closing lore */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-serif text-base text-[#2b2820]/70 italic leading-relaxed">
            "We are the ones who were cast out, who left, who chose the void."
          </p>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 border-2 border-[#c85a3e] bg-[#d4cbb8] p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertCircle className="text-[#c85a3e]" size={20} />
            <span className="text-mono text-xs text-[#c85a3e] tracking-wider">NOTICE</span>
          </div>
          <p className="text-mono text-xs text-[#2b2820]/70 leading-relaxed">
            This is a ritual chamber, not a press kit. Signals received through this channel are heard by the Order directly. Be intentional.
          </p>
        </motion.div>
      </div>

      <FooterWithResistance />
    </div>
  );
}
