import { motion } from 'motion/react';
import { Link, useParams } from 'react-router';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import IlluminatedText from '../components/IlluminatedText';
import { useKirbyData } from '../hooks/useKirbyData';
import type { KirbyDispatch } from '../types/kirby';

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DispatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = useKirbyData<KirbyDispatch[]>('dispatches.json');
  const transmission = data?.find(t => t.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen text-[#e6e6e6]" style={{ background: '#010313' }}>
        <Navigation />
        <div className="container mx-auto px-8 py-40 text-center">
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-mono text-xs text-[#397eff] tracking-widest"
          >
            RECEIVING TRANSMISSION...
          </motion.div>
        </div>
      </div>
    );
  }

  if (!transmission) {
    return (
      <div className="min-h-screen text-[#e6e6e6]" style={{ background: '#010313' }}>
        <Navigation />
        <div className="container mx-auto px-8 py-40 text-center">
          <div className="text-mono text-xs text-[#397eff] tracking-widest mb-4">
            TRANSMISSION NOT FOUND
          </div>
          <Link
            to="/dispatches"
            className="text-mono text-xs text-[#397eff] tracking-widest hover:text-[#e6e6e6] transition-colors"
          >
            ← ALL DISPATCHES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#e6e6e6]" style={{ background: '#010313' }}>
      <Navigation />

      <div className="container mx-auto px-4 sm:px-8 py-24 max-w-2xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <Link
            to="/dispatches"
            className="text-mono text-xs tracking-widest text-[#e6e6e6]/40 hover:text-[#397eff] transition-colors inline-flex items-center gap-2"
          >
            ← ALL DISPATCHES
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          {/* Transmission ID + date */}
          <div className="flex items-center gap-4 mb-5 text-mono text-xs tracking-widest text-[#e6e6e6]/40">
            <span className="text-[#397eff]">{transmission.transmissionId}</span>
            <span>·</span>
            <span>{formatDate(transmission.date)}</span>
          </div>

          {/* Title */}
          <h1 className="text-display text-4xl sm:text-5xl text-[#e6e6e6] leading-tight mb-8">
            {transmission.title}
          </h1>

          {/* Rule */}
          <div
            className="w-full h-px bg-[#004df1]/40"
            style={{ boxShadow: '0 0 8px rgba(0,77,241,0.25)' }}
          />
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          <IlluminatedText
            text={transmission.body}
            dropCap
            dropCapLines={4}
            dropCapColor="signal"
            fontSize={16}
            lineHeightMultiplier={1.8}
          />
        </motion.div>

        {/* Footer rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 pt-12 border-t border-[#004df1]/10"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/dispatches"
              className="text-mono text-xs tracking-widest text-[#e6e6e6]/40 hover:text-[#397eff] transition-colors inline-flex items-center gap-2"
            >
              ← ALL DISPATCHES
            </Link>
            <span className="text-mono text-xs text-[#e6e6e6]/20 tracking-widest">
              {transmission.transmissionId} / END
            </span>
          </div>
        </motion.div>
      </div>

      <FooterWithResistance />
    </div>
  );
}
