import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/signal', label: 'MUSIC' },
  { to: '/coven', label: 'COVEN' },
  { to: '/dispatches', label: 'DISPATCHES' },
  { to: '/ritual', label: 'CONTACT' },
];

export default function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="container mx-auto">
        <nav
          style={{
            background: 'rgba(1,3,19,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(0,77,241,0.35)',
            padding: '16px 32px',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="text-display text-xl"
              style={{ color: '#e6e6e6' }}
            >
              EXIT.WAVE
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-mono text-xs tracking-widest">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="transition-colors group flex items-center gap-1.5"
                  style={{
                    color: isActive(link.to) ? '#e6e6e6' : 'rgba(230,230,230,0.45)',
                  }}
                >
                  <span
                    style={{
                      color: '#004df1',
                      opacity: isActive(link.to) ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    ◆
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              style={{ color: '#e6e6e6', background: 'none', border: 'none', cursor: 'pointer' }}
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
                <div
                  className="flex flex-col gap-4 pt-4 mt-4"
                  style={{ borderTop: '1px solid rgba(0,77,241,0.2)' }}
                >
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="text-mono text-xs tracking-widest transition-colors"
                      style={{
                        color: isActive(link.to) ? '#e6e6e6' : 'rgba(230,230,230,0.45)',
                      }}
                    >
                      {isActive(link.to) ? (
                        <span style={{ color: '#004df1' }}>◆ </span>
                      ) : (
                        '— '
                      )}
                      {link.label}
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
