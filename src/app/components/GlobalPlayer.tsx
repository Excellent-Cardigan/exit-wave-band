import { AnimatePresence, motion } from 'motion/react';
import { SkipBack, SkipForward, Volume2, Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, progress, volume, togglePlay, next, previous, setVolume } = useAudio();

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="border-t-2 border-[#8b7e6a] bg-[#d4cbb8]">
            {/* Progress bar — full width at top */}
            <div className="h-1 bg-[#8b7e6a]/20 relative">
              <div
                className="absolute top-0 left-0 h-full bg-[#3a8a7a] transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-3 sm:p-4 flex items-center gap-3">
              {/* Thumbnail */}
              <div className="w-10 h-10 sm:w-16 sm:h-16 border-2 border-[#8b7e6a] overflow-hidden flex-shrink-0">
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'sepia(0.15) contrast(1.1)' }}
                />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="text-blackletter text-xs sm:text-sm text-[#2b2820] leading-tight truncate">
                  {currentTrack.title}
                </div>
                <div className="text-mono text-[9px] text-[#2b2820]/50 tracking-widest truncate">
                  {currentTrack.album.toUpperCase()}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={previous}
                  aria-label="Previous track"
                  className="w-8 h-8 border border-[#8b7e6a] text-[#2b2820] hover:bg-[#8b7e6a] hover:text-[#e8e1d3] transition-all flex items-center justify-center"
                >
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={() => togglePlay(currentTrack)}
                  aria-label={isPlaying ? 'Pause' : `Play ${currentTrack.title}`}
                  className="w-10 h-10 border-2 border-[#3a8a7a] bg-[#3a8a7a] text-[#e8e1d3] hover:bg-transparent hover:text-[#3a8a7a] transition-all flex items-center justify-center"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button
                  onClick={next}
                  aria-label="Next track"
                  className="w-8 h-8 border border-[#8b7e6a] text-[#2b2820] hover:bg-[#8b7e6a] hover:text-[#e8e1d3] transition-all flex items-center justify-center"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Volume — desktop only */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0 w-32">
                <Volume2 size={14} className="text-[#2b2820]/60" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  aria-label="Volume"
                  className="flex-1 h-1 appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3a8a7a 0%, #3a8a7a ${volume}%, rgba(139, 126, 106, 0.2) ${volume}%, rgba(139, 126, 106, 0.2) 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
