import { motion } from 'motion/react';
import { Link, useParams } from 'react-router';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import IlluminatedText from '../components/IlluminatedText';
import { transmissions } from '../data/transmissions';

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DispatchDetail() {
  const { slug } = useParams<{ slug: string }>();
  const transmission = transmissions.find(t => t.slug === slug);

  if (!transmission) {
    return (
      <div className="min-h-screen bg-[#07070d] text-[#e8e4d9]">
        <Navigation />
        <div className="container mx-auto px-8 py-40 text-center">
          <div className="text-mono text-xs text-[#4fd1d1]/60 tracking-widest mb-4">
            TRANSMISSION NOT FOUND
          </div>
          <Link
            to="/dispatches"
            className="text-mono text-xs text-[#4fd1d1] tracking-widest hover:text-[#e8e4d9] transition-colors"
          >
            ← ALL DISPATCHES
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070d] text-[#e8e4d9]">
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
            className="text-mono text-xs tracking-widest text-[#e8e4d9]/40 hover:text-[#4fd1d1] transition-colors inline-flex items-center gap-2"
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
          <div className="flex items-center gap-4 mb-5 text-mono text-xs tracking-widest text-[#e8e4d9]/40">
            <span className="text-[#4fd1d1]/70">{transmission.transmissionId}</span>
            <span>·</span>
            <span>{formatDate(transmission.date)}</span>
          </div>

          {/* Title */}
          <h1 className="text-blackletter text-4xl sm:text-5xl text-[#e8e4d9] leading-tight mb-8">
            {transmission.title}
          </h1>

          {/* Rule */}
          <div
            className="w-full h-px bg-[#4fd1d1]/40"
            style={{ boxShadow: '0 0 8px #4fd1d140' }}
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
          className="mt-20 pt-12 border-t border-[#4fd1d1]/10"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/dispatches"
              className="text-mono text-xs tracking-widest text-[#e8e4d9]/40 hover:text-[#4fd1d1] transition-colors inline-flex items-center gap-2"
            >
              ← ALL DISPATCHES
            </Link>
            <span className="text-mono text-xs text-[#e8e4d9]/20 tracking-widest">
              {transmission.transmissionId} / END
            </span>
          </div>
        </motion.div>
      </div>

      <FooterWithResistance />
    </div>
  );
}
