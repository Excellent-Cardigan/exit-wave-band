import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import Footer from './Footer';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function FooterWithResistance() {
  const navigate = useNavigate();
  const [scrollResistance, setScrollResistance] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const resistanceAccumulator = useRef(0);
  const lastScrollY = useRef(window.scrollY);
  const konamiProgress = useRef(0);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiProgress.current]) {
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI.length) {
          konamiProgress.current = 0;
          navigate('/terminal');
        }
      } else {
        konamiProgress.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Scroll resistance listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (currentScrollY >= maxScroll - 5 && e.deltaY > 0) {
        e.preventDefault();

        resistanceAccumulator.current += e.deltaY;
        const resistancePercent = Math.min(resistanceAccumulator.current / 10, 100);
        setScrollResistance(resistancePercent);

        if (resistancePercent > 20) setShowHint(true);

        if (resistanceAccumulator.current > 500) {
          navigate('/terminal');
          resistanceAccumulator.current = 0;
          setScrollResistance(0);
          setShowHint(false);
        }
      } else {
        if (resistanceAccumulator.current > 0) {
          resistanceAccumulator.current = Math.max(0, resistanceAccumulator.current - 50);
          setScrollResistance(Math.min(resistanceAccumulator.current / 10, 100));
          if (resistanceAccumulator.current === 0) setShowHint(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current && resistanceAccumulator.current > 0) {
        resistanceAccumulator.current = 0;
        setScrollResistance(0);
        setShowHint(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate]);

  return (
    <div className="relative">
      {/* Scroll resistance indicator */}
      <AnimatePresence>
        {scrollResistance > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 h-2 bg-[#004df1]/20 z-50 pointer-events-none"
            >
              <motion.div
                className="h-full bg-[#004df1]"
                style={{ width: `${scrollResistance}%` }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </motion.div>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              >
                <div className="bg-[#07070d] border-2 border-[#4fd1d1] px-6 py-3 text-mono text-xs text-[#4fd1d1] tracking-wider">
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    █ KEEP SCROLLING TO ACCESS SECRET TERMINAL
                  </motion.span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
