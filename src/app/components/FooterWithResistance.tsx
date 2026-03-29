import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import Footer from './Footer';

export default function FooterWithResistance() {
  const navigate = useNavigate();
  const footerRef = useRef<HTMLDivElement>(null);
  const [scrollResistance, setScrollResistance] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let resistanceAccumulator = 0;
    let lastScrollY = window.scrollY;

    const handleWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Check if we're at the bottom and trying to scroll down
      if (currentScrollY >= maxScroll - 5 && e.deltaY > 0) {
        e.preventDefault();
        
        resistanceAccumulator += e.deltaY;
        const resistancePercent = Math.min(resistanceAccumulator / 10, 100);
        setScrollResistance(resistancePercent);

        // Show hint after some resistance
        if (resistancePercent > 20 && !showHint) {
          setShowHint(true);
        }

        // Navigate to terminal after enough resistance
        if (resistanceAccumulator > 500) {
          navigate('/terminal');
          resistanceAccumulator = 0;
          setScrollResistance(0);
          setShowHint(false);
        }
      } else {
        // Reset if scrolling up or not at bottom
        if (resistanceAccumulator > 0) {
          resistanceAccumulator = Math.max(0, resistanceAccumulator - 50);
          setScrollResistance(Math.min(resistanceAccumulator / 10, 100));
          if (resistanceAccumulator === 0) {
            setShowHint(false);
          }
        }
      }

      lastScrollY = currentScrollY;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Reset resistance if scrolling up
      if (currentScrollY < lastScrollY && scrollResistance > 0) {
        setScrollResistance(0);
        setShowHint(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navigate, scrollResistance, showHint]);

  return (
    <div ref={footerRef} className="relative">
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
