import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import TrackCard from '../components/TrackCard';
import { tracks } from '../data/tracks';

export default function Signal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Load new track when active index changes
  useEffect(() => {
    if (!audioRef.current) return;
    const wasPlaying = isPlaying;
    audioRef.current.pause();
    audioRef.current.src = tracks[activeIndex].audioSrc;
    audioRef.current.load();
    if (wasPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [activeIndex]);

  // Sync play/pause state to audio element
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Wheel navigation between tracks
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY > 0 && activeIndex < tracks.length - 1) {
          setActiveIndex(prev => prev + 1);
          setIsPlaying(false);
        } else if (e.deltaY < 0 && activeIndex > 0) {
          setActiveIndex(prev => prev - 1);
          setIsPlaying(false);
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
  }, [activeIndex]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { y: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.y < -swipeThreshold && activeIndex < tracks.length - 1) {
      setActiveIndex(prev => prev + 1);
      setIsPlaying(false);
    } else if (info.offset.y > swipeThreshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8e1d3] text-[#2b2820] relative">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-8 py-24">
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

        {/* Stacked cards */}
        <div
          ref={containerRef}
          className="relative flex items-start justify-center min-h-[500px] sm:min-h-[700px] pt-8"
        >
          {tracks.map((track, index) => {
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
                  isPlaying={isPlaying}
                  isActive={isActive}
                  onPlayPause={() => setIsPlaying(prev => !prev)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Track counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 text-mono text-sm text-[#2b2820]/60 tracking-wider"
        >
          TRANSMISSION {activeIndex + 1} OF {tracks.length}
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
          <p className="text-serif text-[#2b2820]/70 text-base italic leading-relaxed max-w-2xl mx-auto">
            "The exit is not an ending — it is a rite of passage. A frequency. A door that only opens from one side."
          </p>
          <div className="mt-4 text-mono text-[10px] text-[#2b2820]/40 tracking-widest">
            — FROM THE SEVERANCE PROTOCOLS
          </div>
        </motion.div>
      </div>

      <FooterWithResistance />
    </div>
  );
}
