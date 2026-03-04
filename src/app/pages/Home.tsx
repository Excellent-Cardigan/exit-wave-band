import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import TrackCard from '../components/TrackCard';
import { useKirbyData } from '../hooks/useKirbyData';
import { useAudio } from '../context/AudioContext';
import type { KirbyTrack } from '../types/kirby';

const STATUS_COLORS: Record<KirbyTrack['status'], string> = {
  demo: 'border-[#c85a3e] text-[#c85a3e]',
  'b-side': 'border-[#c9a353] text-[#c9a353]',
  final: 'border-[#3a8a7a] text-[#3a8a7a]',
};

export default function Home() {
  const { data: tracks, loading: tracksLoading } = useKirbyData<KirbyTrack[]>('tracks.json');
  const { currentTrack, isPlaying, togglePlay } = useAudio();

  const [scrolled, setScrolled] = useState(false);

  const kirbyTracks = tracks ?? [];
  const featuredTrack = kirbyTracks.find(t => t.featured) ?? kirbyTracks[0] ?? null;
  const demoTracks = kirbyTracks.filter(t => t.status === 'demo' || t.status === 'b-side');
  const latestDemo = demoTracks[0] ?? null;

  // Scroll detection for dual-state nav
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#e8e1d3] flex flex-col">
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
              className="text-mono text-xs tracking-widest border border-[#3a8a7a] bg-[#d4cbb8]/90 backdrop-blur-md text-[#3a8a7a] px-6 py-2 hover:bg-[#3a8a7a] hover:text-[#e8e1d3] transition-all whitespace-nowrap block"
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

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero section - Featured Track with Background Cards */}
        <section className="relative py-16 px-8 overflow-hidden">
          {/* Masonry Grid Background — hidden on mobile */}
          {!tracksLoading && kirbyTracks.length > 0 && (
            <div className="absolute inset-0 -mx-32 hidden sm:grid grid-cols-6 gap-0">
              {[...Array(3)].map((_, rowIndex) => (
                kirbyTracks.map((track, trackIndex) => (
                  <motion.div
                    key={`${rowIndex}-${trackIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 0.8, delay: (rowIndex * kirbyTracks.length + trackIndex) * 0.05 }}
                    className={`${trackIndex % 3 === 0 ? 'col-span-2' : 'col-span-1'}`}
                  >
                    <div className="mtg-card-frame overflow-hidden h-full">
                      <div className="h-4 bg-[#8b7e6a]" />
                      <div className="p-2 bg-[#d4cbb8]">
                        <div className="mtg-card-inner-border aspect-video overflow-hidden">
                          <img
                            src={track.image}
                            alt={track.title}
                            className="w-full h-full object-cover"
                            style={{ filter: 'sepia(0.15) contrast(1.1)' }}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-[#d4cbb8]">
                        <h3 className="text-blackletter text-sm truncate">{track.title}</h3>
                      </div>
                      <div className="h-3 bg-[#8b7e6a]" />
                    </div>
                  </motion.div>
                ))
              ))}
            </div>
          )}

          {/* Fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#e8e1d3] to-transparent pointer-events-none z-10" />

          {/* Featured Card - Center */}
          <div className="relative z-20 container mx-auto max-w-7xl flex items-center justify-center min-h-[400px] sm:min-h-[600px]">
            {tracksLoading ? (
              <div className="w-full max-w-2xl">
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-[#d4cbb8] border-2 border-[#8b7e6a] aspect-[3/4]"
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

        {/* Terminal Track List */}
        <section className="py-8 sm:py-16 px-4 sm:px-8">
          <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-2 border-[#8b7e6a] bg-[#1a1816] p-4 sm:p-8 text-[#4fd1d1]"
            >
              {/* Terminal Header */}
              <div className="text-mono text-xs mb-6 pb-4 border-b border-[#4fd1d1]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#4fd1d1]/70">EXIT.WAVE DEMO ARCHIVE</span>
                  <span className="text-[#4fd1d1]/50">v0.14.0</span>
                </div>
                <div className="text-[10px] text-[#4fd1d1]/50">
                  {tracksLoading ? 'LOADING...' : `${demoTracks.length} ENTRIES FOUND`}
                </div>
              </div>

              {tracksLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(skeletonIndex => (
                    <motion.div
                      key={skeletonIndex}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.2 }}
                      className="h-8 bg-[#4fd1d1]/10 border border-[#4fd1d1]/10"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* Table Header — desktop only */}
                  <div className="hidden sm:grid text-mono text-[10px] mb-3 pb-2 border-b border-[#4fd1d1]/20 grid-cols-12 gap-4 text-[#4fd1d1]/60 tracking-widest">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">TRACK_NAME</div>
                    <div className="col-span-2">STATUS</div>
                    <div className="col-span-1">BPM</div>
                    <div className="col-span-2">STEMS</div>
                    <div className="col-span-2 text-right">ACTION</div>
                  </div>

                  {/* Track Rows */}
                  <div className="space-y-1">
                    {demoTracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="text-mono text-xs py-3 border-b border-[#4fd1d1]/10 hover:bg-[#4fd1d1]/5 transition-colors"
                      >
                        {/* Mobile row */}
                        <div className="flex items-center justify-between gap-2 sm:hidden">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[#4fd1d1]/50 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                            <span className="text-[#4fd1d1] truncate">{track.title}</span>
                          </div>
                          <button
                            onClick={() => togglePlay(track, kirbyTracks)}
                            aria-label={isPlaying && currentTrack?.id === track.id ? 'Pause' : `Play ${track.title}`}
                            className="shrink-0 px-3 py-1 border border-[#4fd1d1] text-[#4fd1d1] hover:bg-[#4fd1d1] hover:text-[#1a1816] transition-all text-[10px] tracking-widest"
                          >
                            {isPlaying && currentTrack?.id === track.id ? 'PAUSE' : 'PLAY'}
                          </button>
                        </div>

                        {/* Desktop row */}
                        <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1 text-[#4fd1d1]/50">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="col-span-4 text-[#4fd1d1]">{track.title}</div>
                          <div className="col-span-2">
                            <span className={`px-2 py-0.5 border text-[9px] tracking-wider ${STATUS_COLORS[track.status]}`}>
                              {track.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="col-span-1 text-[#4fd1d1]/70">{track.bpm}</div>
                          <div className="col-span-2 text-[#4fd1d1]/70">
                            {track.stems ? '✓ AVAILABLE' : '✗ N/A'}
                          </div>
                          <div className="col-span-2 text-right">
                            <button
                              onClick={() => togglePlay(track, kirbyTracks)}
                              aria-label={isPlaying && currentTrack?.id === track.id ? 'Pause' : `Play ${track.title}`}
                              className="px-3 py-1 border border-[#4fd1d1] text-[#4fd1d1] hover:bg-[#4fd1d1] hover:text-[#1a1816] transition-all text-[10px] tracking-widest"
                            >
                              {isPlaying && currentTrack?.id === track.id ? 'PAUSE' : 'PLAY'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Terminal Footer */}
              <div className="text-mono text-[9px] text-[#4fd1d1]/40 mt-6 pt-4 border-t border-[#4fd1d1]/20">
                <span className="animate-pulse">█</span> END_OF_TRANSMISSION
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterWithResistance />
    </div>
  );
}
