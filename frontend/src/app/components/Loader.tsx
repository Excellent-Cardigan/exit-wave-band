import { motion } from 'motion/react';
import Sigil from './Sigil';

export default function Loader() {
  return (
    <motion.div
      key="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'var(--color-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Grid — 32px cells, signal blue lines */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,77,241,0.18) 31px, rgba(0,77,241,0.18) 32px)',
            'repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(0,77,241,0.18) 31px, rgba(0,77,241,0.18) 32px)',
          ].join(', '),
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial fade — dark center clearing to grid at edges */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 60% at 50% 50%, var(--color-void) 0%, var(--color-void) 18%, rgba(1,3,19,0.92) 32%, rgba(1,3,19,0.55) 50%, rgba(1,3,19,0.1) 68%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Center content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px',
        }}
      >
        {/* Glow halo behind icon */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(0,77,241,0.18) 0%, rgba(0,77,241,0.06) 50%, transparent 75%)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sigil size={80} />
          </motion.div>
        </div>

        {/* Label + dots */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(230,230,230,0.45)',
            }}
          >
            Initializing Signal
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-signal)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar — bottom edge */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'rgba(0,77,241,0.1)',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, var(--color-signal) 60%, rgba(0,77,241,0.4) 100%)',
          }}
        />
      </div>
    </motion.div>
  );
}
