import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Dithering } from '@paper-design/shaders-react';
import { AudioProvider } from '../context/AudioContext';
import GlobalPlayer from './GlobalPlayer';
import { useAudio } from '../context/AudioContext';

// Inner layout reads from AudioProvider context to conditionally add bottom padding
function LayoutInner() {
  const location = useLocation();
  const { currentTrack } = useAudio();

  return (
    <>
      {/* Dithering shader — fixed background layer, sits just above the void bg color */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '60vh',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.6,
          mixBlendMode: 'screen',
        }}
      >
        <Dithering
          width={1280}
          height={720}
          colorBack="#09090b"
          colorFront="#2432ff"
          shape="wave"
          type="8x8"
          size={1.8}
          speed={0.36}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{ position: 'relative', zIndex: 1 }}
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
