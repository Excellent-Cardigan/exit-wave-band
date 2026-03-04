import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { AudioProvider } from '../context/AudioContext';
import GlobalPlayer from './GlobalPlayer';
import { useAudio } from '../context/AudioContext';

// Inner layout reads from AudioProvider context to conditionally add bottom padding
function LayoutInner() {
  const location = useLocation();
  const { currentTrack } = useAudio();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={currentTrack ? 'pb-24' : ''}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <GlobalPlayer />
    </>
  );
}

export default function Layout() {
  return (
    <AudioProvider>
      <LayoutInner />
    </AudioProvider>
  );
}
