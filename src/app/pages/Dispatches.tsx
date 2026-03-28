import { motion } from 'motion/react';
import { Link } from 'react-router';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import IlluminatedText from '../components/IlluminatedText';
import { transmissions } from '../data/transmissions';

function formatDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Dispatches() {
  return (
    <div className="min-h-screen bg-[#07070d] text-[#e8e4d9]">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-8 py-24 max-w-3xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-mono text-3xl tracking-wider text-[#4fd1d1] mb-3">
            DISPATCHES
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-24 h-px bg-[#4fd1d1]" style={{ boxShadow: '0 0 8px #4fd1d1' }} />
            <span className="text-mono text-xs text-[#e8e4d9]/40 tracking-widest">
              FIELD TRANSMISSIONS FROM THE ORDER
            </span>
          </div>
        </motion.div>

        {/* Transmission list */}
        <div className="space-y-16">
          {transmissions.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30, delay: i * 0.12 }}
              className="border-t border-[#4fd1d1]/20 pt-10"
            >
              {/* Transmission ID + date */}
              <div className="flex items-center gap-4 mb-4 text-mono text-xs tracking-widest text-[#e8e4d9]/40">
                <span className="text-[#4fd1d1]/60">{t.transmissionId}</span>
                <span>·</span>
                <span>{formatDate(t.date)}</span>
              </div>

              {/* Title */}
              <h2 className="text-blackletter text-3xl text-[#e8e4d9] mb-6 leading-tight">
                {t.title}
              </h2>

              {/* Excerpt with small drop cap */}
              <IlluminatedText
                text={t.excerpt}
                dropCap
                dropCapLines={2}
                dropCapColor={i % 2 === 0 ? 'signal' : 'accent'}
                fontSize={15}
                lineHeightMultiplier={1.8}
                className="mb-6"
              />

              {/* Read link */}
              <Link
                to={`/dispatches/${t.slug}`}
                className="text-mono text-xs tracking-widest text-[#4fd1d1] hover:text-[#e8e4d9] transition-colors group inline-flex items-center gap-2"
              >
                READ TRANSMISSION
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Footer lore */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 pt-12 border-t border-[#4fd1d1]/10 text-center"
        >
          <p className="text-serif text-sm text-[#e8e4d9]/30 italic tracking-wide">
            "like a signal in the static"
          </p>
        </motion.div>
      </div>

      <FooterWithResistance />
    </div>
  );
}
