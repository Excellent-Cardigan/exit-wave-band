import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import TrackCard from '../components/TrackCard';
import { useKirbyData } from '../hooks/useKirbyData';
import { useAudio } from '../context/AudioContext';
import type { KirbyTrack } from '../types/kirby';

// ---------------------------------------------------------------------------
// Status badge styles — dark palette
// ---------------------------------------------------------------------------
const STATUS_BADGE_STYLES: Record<KirbyTrack['status'], { borderColor: string; color: string }> = {
  demo:   { borderColor: 'rgba(0,77,241,0.35)', color: 'rgba(230,230,230,0.5)' },
  'b-side': { borderColor: 'rgba(0,77,241,0.55)', color: 'rgba(0,77,241,0.85)' },
  final:  { borderColor: '#004df1', color: '#e6e6e6' },
};

// ---------------------------------------------------------------------------
// TrackRow — single row in the archive table
// ---------------------------------------------------------------------------
interface TrackRowProps {
  track: KirbyTrack;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  onPlay: () => void;
  isCurrentlyPlaying: boolean;
}

function TrackRow({ track, index, isHovered, onHover, onPlay, isCurrentlyPlaying }: TrackRowProps) {
  const badgeStyle = STATUS_BADGE_STYLES[track.status];

  return (
    <div
      onClick={onPlay}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
      aria-label={isCurrentlyPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
      onKeyDown={e => e.key === 'Enter' && onPlay()}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto auto auto 32px',
        gap: 16,
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid rgba(0,77,241,0.12)',
        cursor: 'pointer',
        background: isHovered
          ? 'linear-gradient(90deg, rgba(0,77,241,0.08) 0%, transparent 100%)'
          : 'transparent',
        transition: 'background 0.25s ease',
      }}
    >
      {/* # */}
      <span
        className="text-mono"
        style={{ fontSize: 11, color: 'rgba(0,77,241,0.45)', letterSpacing: '0.05em' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Track name + album */}
      <div style={{ minWidth: 0 }}>
        <div
          className="text-display"
          style={{
            fontSize: 17,
            fontWeight: 400,
            color: '#e6e6e6',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.title}
        </div>
        <div
          className="hidden sm:block text-mono"
          style={{
            fontSize: 10,
            color: 'rgba(230,230,230,0.25)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: 3,
          }}
        >
          {track.album}
        </div>
      </div>

      {/* Status badge */}
      <span
        className="text-mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.12em',
          padding: '2px 6px',
          border: `1px solid ${badgeStyle.borderColor}`,
          color: badgeStyle.color,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {track.status}
      </span>

      {/* BPM — desktop only */}
      <span
        className="hidden sm:block text-mono"
        style={{ fontSize: 11, color: 'rgba(230,230,230,0.2)', letterSpacing: '0.05em', textAlign: 'right' }}
      >
        {track.bpm}
      </span>

      {/* Duration */}
      <span
        className="text-mono"
        style={{ fontSize: 11, color: 'rgba(230,230,230,0.3)', letterSpacing: '0.05em', textAlign: 'right' }}
      >
        {track.duration}
      </span>

      {/* Play indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered || isCurrentlyPlaying ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {isCurrentlyPlaying ? (
          <Pause size={14} color="#004df1" />
        ) : (
          <Play size={14} color="rgba(0,77,241,0.7)" />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
export default function Home() {
  const { data: tracks, loading: tracksLoading } = useKirbyData<KirbyTrack[]>('tracks.json');
  const { currentTrack, isPlaying, togglePlay } = useAudio();

  const [scrolled, setScrolled] = useState(false);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  const kirbyTracks = tracks ?? [];
  const featuredTrack = kirbyTracks.find(t => t.featured) ?? kirbyTracks[0] ?? null;
  const demoTracks = kirbyTracks.filter(t => t.status === 'demo' || t.status === 'b-side');
  const latestDemo = demoTracks[0] ?? null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{ minHeight: '100vh', background: '#010313', color: '#e6e6e6' }}
      className="flex flex-col"
    >
      {/* Dual-state nav */}
      <AnimatePresence>
        {!scrolled && latestDemo && (
          <motion.div
            key="demo-pill"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <Link
              to="/signal"
              className="text-mono"
              style={{
                fontSize: 12,
                letterSpacing: '0.12em',
                border: '1px solid #004df1',
                background: 'rgba(1,3,19,0.92)',
                backdropFilter: 'blur(12px)',
                color: '#e6e6e6',
                padding: '10px 24px',
                whiteSpace: 'nowrap',
                display: 'block',
                transition: 'all 0.2s ease',
              }}
            >
              {latestDemo.title} — NEW DEMO →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="nav"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <Navigation />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero — Featured Track with Background Cards */}
        <section className="relative py-16 px-8 overflow-hidden">
          {/* Masonry grid background — desktop only */}
          {!tracksLoading && kirbyTracks.length > 0 && (
            <div className="absolute inset-0 -mx-32 hidden sm:grid grid-cols-6 gap-0">
              {[...Array(3)].map((_, rowIndex) =>
                kirbyTracks.map((track, trackIndex) => (
                  <motion.div
                    key={`${rowIndex}-${trackIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.05, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: (rowIndex * kirbyTracks.length + trackIndex) * 0.05,
                    }}
                    className={trackIndex % 3 === 0 ? 'col-span-2' : 'col-span-1'}
                  >
                    <div className="overflow-hidden h-full">
                      <img
                        src={track.image}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        style={{ filter: 'saturate(0.3) contrast(1.1) brightness(0.6)' }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Gradient fade at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to top, #010313, transparent)' }}
          />

          {/* Featured card */}
          <div className="relative z-20 container mx-auto max-w-7xl flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
            {tracksLoading ? (
              <div className="w-full max-w-2xl">
                <motion.div
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    aspectRatio: '3/4',
                    background: 'rgba(0,77,241,0.04)',
                    border: '1px solid rgba(0,77,241,0.15)',
                  }}
                />
              </div>
            ) : featuredTrack ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full max-w-2xl"
              >
                <TrackCard
                  title={featuredTrack.title}
                  album={featuredTrack.album}
                  duration={featuredTrack.duration}
                  image={featuredTrack.image}
                  bpm={featuredTrack.bpm}
                  isPlaying={isPlaying && currentTrack?.id === featuredTrack.id}
                  onPlayPause={() => togglePlay(featuredTrack, kirbyTracks)}
                />
              </motion.div>
            ) : null}
          </div>
        </section>

        {/* Demo Archive — TrackRow table */}
        <section className="py-8 sm:py-16 px-4 sm:px-8">
          <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,77,241,0.2)' }} />
                <span
                  className="text-mono"
                  style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(0,77,241,0.6)', textTransform: 'uppercase' }}
                >
                  DEMO ARCHIVE
                </span>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,77,241,0.2)' }} />
              </div>

              {/* Entry count + version */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <span
                  className="text-mono"
                  style={{ fontSize: 10, color: 'rgba(230,230,230,0.2)', letterSpacing: '0.1em' }}
                >
                  {tracksLoading ? 'LOADING...' : `${kirbyTracks.length} ENTRIES FOUND`}
                </span>
                <span
                  className="text-mono"
                  style={{ fontSize: 10, color: 'rgba(230,230,230,0.12)', letterSpacing: '0.1em' }}
                >
                  v0.15.0
                </span>
              </div>

              {/* Column headers — desktop only */}
              <div
                className="hidden sm:grid"
                style={{
                  gridTemplateColumns: '28px 1fr auto auto auto 32px',
                  gap: 16,
                  paddingBottom: 10,
                  borderBottom: '1px solid rgba(0,77,241,0.15)',
                  marginBottom: 4,
                }}
              >
                {['#', 'TRACK_NAME', 'STATUS', 'BPM', 'TIME', ''].map((label, i) => (
                  <span
                    key={i}
                    className="text-mono"
                    style={{
                      fontSize: 9,
                      color: 'rgba(230,230,230,0.15)',
                      letterSpacing: '0.15em',
                      textAlign: i >= 3 ? 'right' : 'left',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Track rows */}
              {tracksLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
                  {[1, 2, 3].map(skeletonIndex => (
                    <motion.div
                      key={skeletonIndex}
                      animate={{ opacity: [0.15, 0.3, 0.15] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.2 }}
                      style={{
                        height: 48,
                        background: 'rgba(0,77,241,0.04)',
                        border: '1px solid rgba(0,77,241,0.08)',
                      }}
                    />
                  ))}
                </div>
              ) : (
                kirbyTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                  >
                    <TrackRow
                      track={track}
                      index={index}
                      isHovered={hoveredTrack === index}
                      onHover={setHoveredTrack}
                      onPlay={() => togglePlay(track, kirbyTracks)}
                      isCurrentlyPlaying={isPlaying && currentTrack?.id === track.id}
                    />
                  </motion.div>
                ))
              )}

              {/* Archive footer */}
              <div
                className="text-mono"
                style={{
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(0,77,241,0.08)',
                  fontSize: 9,
                  color: 'rgba(0,77,241,0.3)',
                  letterSpacing: '0.1em',
                }}
              >
                <span className="animate-pulse">█</span> END_OF_TRANSMISSION
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <FooterWithResistance />
    </div>
  );
}
