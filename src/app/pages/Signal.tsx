import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import TrackCard from '../components/TrackCard';
import { useKirbyData } from '../hooks/useKirbyData';
import { useAudio } from '../context/AudioContext';
import type { KirbyTrack } from '../types/kirby';

export default function Signal() {
  const { data: tracks, loading: tracksLoading, error: tracksError } = useKirbyData<KirbyTrack[]>('tracks.json');
  const trackList = tracks ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPlaying, currentTrack, togglePlay, pause } = useAudio();

  // Wheel navigation between tracks
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY > 0 && activeIndex < trackList.length - 1) {
          setActiveIndex(prev => prev + 1);
          pause();
        } else if (e.deltaY < 0 && activeIndex > 0) {
          setActiveIndex(prev => prev - 1);
          pause();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [activeIndex, trackList.length, pause]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.y < -swipeThreshold && activeIndex < trackList.length - 1) {
      setActiveIndex(prev => prev + 1);
      pause();
    } else if (info.offset.y > swipeThreshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      pause();
    }
  };

  const activeTrack = trackList[activeIndex] ?? null;
  const activeTrackIsPlaying = isPlaying && currentTrack?.id === activeTrack?.id;

  return (
    <div className="min-h-screen bg-[#e8e1d3] text-[#2b2820] relative">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-8 py-24">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h1 className="text-blackletter text-3xl text-[#3a8a7a] mb-3">
            The Signal
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-px bg-[#8b7e6a]" />
            <span className="text-mono text-xs text-[#2b2820]/60 tracking-widest">TRANSMISSIONS</span>
            <div className="w-12 h-px bg-[#8b7e6a]" />
          </div>
        </motion.div>

        {/* Error state */}
        {tracksError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mb-8 border-2 border-[#c85a3e] bg-[#d4cbb8] p-6 flex items-center gap-3"
          >
            <AlertCircle className="text-[#c85a3e] shrink-0" size={18} />
            <div>
              <div className="text-mono text-xs text-[#c85a3e] tracking-widest mb-1">SIGNAL INTERRUPTED</div>
              <div className="text-mono text-xs text-[#2b2820]/60">{tracksError}</div>
            </div>
          </motion.div>
        )}

        {/* Stacked cards */}
        <div
          ref={containerRef}
          className="relative flex items-start justify-center min-h-[500px] sm:min-h-[700px] pt-8"
        >
          {tracksLoading ? (
            // Skeleton placeholder cards
            [0, 1, 2].map(skeletonIndex => (
              <motion.div
                key={skeletonIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 - skeletonIndex * 0.3 }}
                transition={{ duration: 0.8, delay: skeletonIndex * 0.1 }}
                className="absolute w-full max-w-2xl"
                style={{ transform: `scale(${1 - skeletonIndex * 0.08}) translateY(${skeletonIndex * 30}px)`, zIndex: 10 - skeletonIndex }}
              >
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.3 }}
                  className="bg-[#d4cbb8] border-2 border-[#8b7e6a] aspect-[3/4]"
                />
              </motion.div>
            ))
          ) : (
            trackList.map((track, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;
              const isVisible = offset >= 0 && offset <= 2;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={track.id}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  initial={{ scale: 1 - offset * 0.08, y: offset * 30, opacity: 0 }}
                  animate={{
                    scale: 1 - offset * 0.08,
                    y: offset * 30,
                    opacity: 1 - offset * 0.4,
                    zIndex: 10 - offset,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  className="absolute w-full max-w-2xl cursor-grab active:cursor-grabbing"
                  style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                >
                  <TrackCard
                    title={track.title}
                    album={track.album}
                    duration={track.duration}
                    image={track.image}
                    bpm={track.bpm}
                    isPlaying={activeTrackIsPlaying && isActive}
                    isActive={isActive}
                    onPlayPause={() => togglePlay(track, trackList)}
                  />
                </motion.div>
              );
            })
          )}
        </div>

        {/* Track counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 text-mono text-sm text-[#2b2820]/60 tracking-wider"
        >
          {tracksLoading ? '— LOADING —' : `TRANSMISSION ${activeIndex + 1} OF ${trackList.length}`}
        </motion.div>

        {/* Hidden tracks indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="border-2 border-[#8b7e6a] bg-[#d4cbb8] p-6 mt-12 max-w-2xl mx-auto"
        >
          <div className="text-mono text-xs text-[#2b2820]/60 text-center tracking-widest">
            + 12 ADDITIONAL TRANSMISSIONS ARCHIVED [RESTRICTED ACCESS]
          </div>
        </motion.div>

        {/* Lore text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mt-16"
        >
          <p className="text-blackletter italic text-[#2b2820]/70 text-base leading-relaxed max-w-2xl mx-auto">
            "The exit is not an ending — it is a rite of passage. A frequency. A door that only opens from one side."
          </p>
          <div className="mt-4 text-mono text-[10px] text-[#2b2820]/40 tracking-widest">
            — FROM THE SEVERANCE PROTOCOLS
          </div>
        </motion.div>
      </main>

      <FooterWithResistance />
    </div>
  );
}
