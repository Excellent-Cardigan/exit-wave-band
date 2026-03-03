import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/signal', label: 'MUSIC' },
  { to: '/coven', label: 'COVEN' },
  { to: '/ritual', label: 'CONTACT' },
];

export default function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="container mx-auto">
        <nav className="bg-[#e8e1d3]/80 backdrop-blur-md border-2 border-[#8b7e6a] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-blackletter text-xl text-[#2b2820]">
              EXIT.WAVE
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-mono text-xs tracking-widest">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition-colors group flex items-center gap-1.5 ${
                    isActive(link.to) ? 'text-[#3a8a7a]' : 'text-[#2b2820]/80 hover:text-[#3a8a7a]'
                  }`}
                >
                  <span className={`transition-opacity ${
                    isActive(link.to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    {isActive(link.to) ? '◆' : '•'}
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop status */}
            <div className="hidden md:flex items-center text-mono text-xs text-[#2b2820]/60">
              <span className="border border-[#2b2820]/60 px-2 py-0.5">ACTIVE</span>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#2b2820] p-1"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-[#8b7e6a]/40">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`text-mono text-xs tracking-widest transition-colors ${
                        isActive(link.to) ? 'text-[#3a8a7a]' : 'text-[#2b2820]/80'
                      }`}
                    >
                      {isActive(link.to) ? '◆ ' : '— '}{link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </div>
  );
}
