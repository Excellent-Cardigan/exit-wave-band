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
    submitForm({ name: formData.name, email: formData.email, message: formData.message });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,77,241,0.04)',
    border: '1px solid rgba(0,77,241,0.3)',
    padding: '12px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    color: '#e6e6e6',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const inputFocusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = '#004df1';
      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0,77,241,0.2)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = 'rgba(0,77,241,0.3)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  const submitButtonStyle: React.CSSProperties =
    formStatus === 'sent'
      ? { background: 'rgba(0,77,241,0.15)', border: '1px solid #004df1', color: '#e6e6e6' }
      : formStatus === 'sending'
      ? { background: 'rgba(0,77,241,0.06)', border: '1px solid rgba(0,77,241,0.2)', color: 'rgba(230,230,230,0.4)' }
      : formStatus === 'error'
      ? { background: 'transparent', border: '1px solid #c85a3e', color: '#c85a3e' }
      : { background: '#004df1', border: '1px solid #004df1', color: '#e6e6e6' };

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{ background: '#010313', color: '#e6e6e6' }}
    >
      <Navigation />

      <main className="flex-1 container mx-auto px-4 sm:px-8 py-24 max-w-3xl">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-display text-3xl mb-3" style={{ color: '#e6e6e6' }}>
            Ritual Contact
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px" style={{ background: 'rgba(0,77,241,0.3)' }} />
            <span className="text-mono text-xs tracking-widest" style={{ color: 'rgba(0,77,241,0.6)' }}>
              TRANSMISSION INTERFACE
            </span>
            <div className="w-16 h-px" style={{ background: 'rgba(0,77,241,0.3)' }} />
          </div>
        </motion.div>

        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <p
            className="text-display italic text-base leading-relaxed mb-6 text-center"
            style={{ color: 'rgba(230,230,230,0.65)' }}
          >
            "The door only opens from one side. But those who know the frequency can send a signal through."
          </p>
          <p className="text-mono text-sm leading-relaxed text-center" style={{ color: 'rgba(230,230,230,0.3)' }}>
            Transmit your message through the membrane. All signals are received. Not all will be answered.
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="p-4 sm:p-8 mb-12"
          style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.2)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-mono text-xs mb-2 tracking-wider" style={{ color: 'rgba(0,77,241,0.6)' }}>
                DESIGNATION
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Your name or alias"
                className="dark-input"
                {...inputFocusHandlers}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-mono text-xs mb-2 tracking-wider" style={{ color: 'rgba(0,77,241,0.6)' }}>
                RETURN FREQUENCY
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="your@email.com"
                className="dark-input"
                {...inputFocusHandlers}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-mono text-xs mb-2 tracking-wider" style={{ color: 'rgba(0,77,241,0.6)' }}>
                TRANSMISSION
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="Enter your message..."
                className="dark-input"
                {...inputFocusHandlers}
              />
            </div>

            {/* Error */}
            {formStatus === 'error' && errorMessage && (
              <motion.div
                role="alert"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 flex items-center gap-3"
                style={{ border: '1px solid #c85a3e', background: 'rgba(200,90,62,0.05)' }}
              >
                <AlertCircle className="text-[#c85a3e] shrink-0" size={16} />
                <div>
                  <div className="text-mono text-xs text-[#c85a3e] tracking-widest mb-1">SIGNAL INTERRUPTED</div>
                  <div className="text-mono text-xs" style={{ color: 'rgba(230,230,230,0.4)' }}>
                    {errorMessage}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={formStatus === 'sending' || formStatus === 'sent'}
              whileHover={{ scale: formStatus === 'idle' ? 1.02 : 1 }}
              whileTap={{ scale: formStatus === 'idle' ? 0.98 : 1 }}
              className="w-full py-4 text-mono text-sm tracking-wider flex items-center justify-center gap-3 transition-all duration-300"
              style={submitButtonStyle}
            >
              {formStatus === 'sending' && (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <AlertCircle size={18} />
                  </motion.div>
                  TRANSMITTING...
                </>
              )}
              {formStatus === 'sent' && (<><Mail size={18} />SIGNAL RECEIVED</>)}
              {(formStatus === 'idle' || formStatus === 'error') && (<><Send size={18} />SEND TRANSMISSION</>)}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            className="p-6"
            style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.15)' }}
          >
            <div className="text-mono text-xs mb-3 tracking-wider" style={{ color: 'rgba(0,77,241,0.6)' }}>
              BOOKING / PERFORMANCE RITUALS
            </div>
            <a
              href="mailto:booking@exit.wave"
              className="text-mono text-sm transition-colors duration-300"
              style={{ color: 'rgba(230,230,230,0.7)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#e6e6e6'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(230,230,230,0.7)'; }}
            >
              booking@exit.wave
            </a>
          </div>

          <div
            className="p-6"
            style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.15)' }}
          >
            <div className="text-mono text-xs mb-3 tracking-wider" style={{ color: 'rgba(0,77,241,0.6)' }}>
              PRESS / MEDIA INQUIRIES
            </div>
            <a
              href="mailto:press@exit.wave"
              className="text-mono text-sm transition-colors duration-300"
              style={{ color: 'rgba(230,230,230,0.7)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#e6e6e6'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(230,230,230,0.7)'; }}
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
          <p className="text-display italic text-base leading-relaxed" style={{ color: 'rgba(230,230,230,0.35)' }}>
            "We are the ones who were cast out, who left, who chose the void."
          </p>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 p-6 text-center"
          style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.15)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertCircle className="text-[#c85a3e]" size={20} />
            <span className="text-mono text-xs text-[#c85a3e] tracking-wider">NOTICE</span>
          </div>
          <p className="text-mono text-xs leading-relaxed" style={{ color: 'rgba(230,230,230,0.3)' }}>
            This is a ritual chamber, not a press kit. Signals received through this channel are heard by the Order directly. Be intentional.
          </p>
        </motion.div>
      </main>

      <FooterWithResistance />
    </div>
  );
}
