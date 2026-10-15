import { useState, useEffect } from 'react';
import { GodRays } from '@paper-design/shaders-react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';

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
  const { currentTrack, isPlaying, togglePlay, progress } = useAudio();

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
        {/* Hero — Cinematic full-bleed */}
        <section className="relative overflow-hidden" style={{ minHeight: '100svh', background: '#010313' }}>
          {/* God Rays shader */}
          <GodRays
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            width={1280}
            height={720}
            colors={['#004cf0', '#387eff', '#0042db', '#01031347']}
            colorBack="#010313"
            colorBloom="#004cf0"
            bloom={1}
            intensity={0.68}
            density={0.16}
            spotty={1}
            midSize={0.24}
            midIntensity={0.32}
            speed={0.24}
            scale={2}
            offsetY={-0.75}
          />
          {/* Key light — blue, upper left */}
          <div style={{
            position: 'absolute', top: -180, left: -60,
            width: 900, height: 900,
            background: 'radial-gradient(ellipse, rgba(0,77,241,0.22) 0%, rgba(0,40,180,0.08) 45%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Fill light — right side */}
          <div style={{
            position: 'absolute', top: 0, right: -100,
            width: 500, height: '100%',
            background: 'radial-gradient(ellipse 60% 80% at 100% 40%, rgba(0,30,120,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 420,
            background: 'linear-gradient(to top, #010313 0%, rgba(1,3,19,0.92) 40%, rgba(1,3,19,0.5) 70%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Edition label — desktop only, centered */}
          <div className="hidden sm:block" style={{ position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
            <span className="text-mono" style={{ fontSize: 8, letterSpacing: '0.35em', color: 'rgba(0,77,241,0.35)' }}>
              SIGNAL HARVEST · VOL. I · MMXXVI
            </span>
          </div>

          {/* Track info — desktop, bottom left */}
          {featuredTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden sm:flex"
              style={{ position: 'absolute', bottom: 44, left: 52, flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span className="text-mono" style={{ fontSize: 8, letterSpacing: '0.25em', color: 'rgba(0,77,241,0.6)' }}>◆ EXIT.WAVE</span>
                <div style={{ width: 32, height: 1, background: 'rgba(0,77,241,0.3)' }} />
                <span className="text-mono" style={{ fontSize: 8, letterSpacing: '0.18em', color: 'rgba(230,230,230,0.2)' }}>{featuredTrack.album.toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-blaze)', fontWeight: 500, fontSize: 108, lineHeight: '85%', letterSpacing: '-0.015em', color: '#e6e6e6' }}>
                  {featuredTrack.title.split(' ')[0]}
                </div>
                {featuredTrack.title.split(' ').slice(1).join(' ') && (
                  <div style={{ fontFamily: 'var(--font-blaze)', fontWeight: 500, fontSize: 108, lineHeight: '85%', letterSpacing: '-0.015em', color: '#004df1' }}>
                    {featuredTrack.title.split(' ').slice(1).join(' ')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 2 }}>
                <span className="text-mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(230,230,230,0.35)' }}>{featuredTrack.duration}</span>
                <div style={{ width: 1, height: 10, background: 'rgba(0,77,241,0.25)' }} />
                <span className="text-mono" style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(0,77,241,0.5)' }}>{featuredTrack.bpm} BPM</span>
                <div style={{ width: 1, height: 10, background: 'rgba(0,77,241,0.25)' }} />
                <span className="text-mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(230,230,230,0.18)', textTransform: 'uppercase' }}>{featuredTrack.status}</span>
              </div>
            </motion.div>
          )}

          {/* Play button — desktop, bottom right */}
          {featuredTrack && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => togglePlay(featuredTrack, kirbyTracks)}
              className="hidden sm:flex"
              style={{ position: 'absolute', bottom: 52, right: 60, flexDirection: 'column', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#004df1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPlaying && currentTrack?.id === featuredTrack.id
                  ? <Pause size={22} color="#010313" />
                  : <Play size={22} color="#010313" />}
              </div>
              <span className="text-mono" style={{ fontSize: 7, letterSpacing: '0.25em', color: 'rgba(0,77,241,0.4)' }}>
                {isPlaying && currentTrack?.id === featuredTrack.id ? 'PAUSE' : 'PLAY'}
              </span>
            </motion.button>
          )}

          {/* Mobile layout — track info + play, bottom */}
          {featuredTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="flex sm:hidden"
              style={{ position: 'absolute', bottom: 40, left: 24, right: 24, flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                <span className="text-mono" style={{ fontSize: 7, letterSpacing: '0.25em', color: 'rgba(0,77,241,0.6)' }}>◆ EXIT.WAVE</span>
                <div style={{ width: 24, height: 1, background: 'rgba(0,77,241,0.3)' }} />
                <span className="text-mono" style={{ fontSize: 7, letterSpacing: '0.15em', color: 'rgba(230,230,230,0.2)' }}>{featuredTrack.album.toUpperCase()}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-blaze)', fontWeight: 500, fontSize: 72, lineHeight: '85%', letterSpacing: '-0.015em', color: '#e6e6e6' }}>
                  {featuredTrack.title.split(' ')[0]}
                </div>
                {featuredTrack.title.split(' ').slice(1).join(' ') && (
                  <div style={{ fontFamily: 'var(--font-blaze)', fontWeight: 500, fontSize: 72, lineHeight: '85%', letterSpacing: '-0.015em', color: '#004df1' }}>
                    {featuredTrack.title.split(' ').slice(1).join(' ')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 4 }}>
                <span className="text-mono" style={{ fontSize: 9, letterSpacing: '0.08em', color: 'rgba(230,230,230,0.3)' }}>{featuredTrack.duration}</span>
                <div style={{ width: 1, height: 9, background: 'rgba(0,77,241,0.25)' }} />
                <span className="text-mono" style={{ fontSize: 8, letterSpacing: '0.15em', color: 'rgba(0,77,241,0.5)' }}>{featuredTrack.bpm} BPM</span>
                <button
                  onClick={() => togglePlay(featuredTrack, kirbyTracks)}
                  style={{ width: 52, height: 52, borderRadius: '50%', background: '#004df1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  {isPlaying && currentTrack?.id === featuredTrack.id
                    ? <Pause size={16} color="#010313" />
                    : <Play size={16} color="#010313" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(0,77,241,0.1)' }}>
            <motion.div
              style={{ height: '100%', background: '#004df1' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
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
