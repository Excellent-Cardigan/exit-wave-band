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
          <div
            style={{
              background: 'rgba(1,3,19,0.97)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid #004df1',
            }}
          >
            {/* Progress bar */}
            <div
              className="h-0.5 relative"
              style={{ background: 'rgba(0,77,241,0.15)' }}
            >
              <div
                className="absolute top-0 left-0 h-full transition-[width] duration-100"
                style={{ width: `${progress}%`, background: '#004df1' }}
              />
            </div>

            <div className="p-3 sm:p-4 flex items-center gap-3">
              {/* Thumbnail */}
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 overflow-hidden flex-shrink-0"
                style={{ border: '1px solid rgba(0,77,241,0.4)' }}
              >
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.6) contrast(1.05)' }}
                />
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-xs sm:text-sm leading-tight truncate text-display"
                  style={{ color: '#e6e6e6', fontWeight: 400 }}
                >
                  {currentTrack.title}
                </div>
                <div
                  className="text-mono tracking-widest truncate"
                  style={{ fontSize: 9, color: 'rgba(0,77,241,0.6)' }}
                >
                  {currentTrack.album.toUpperCase()}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={previous}
                  aria-label="Previous track"
                  className="w-8 h-8 flex items-center justify-center transition-opacity"
                  style={{ color: 'rgba(230,230,230,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={() => togglePlay(currentTrack)}
                  aria-label={isPlaying ? 'Pause' : `Play ${currentTrack.title}`}
                  className="w-10 h-10 flex items-center justify-center transition-all"
                  style={{ background: '#004df1', border: 'none', cursor: 'pointer' }}
                >
                  {isPlaying ? (
                    <Pause size={16} color="#e6e6e6" />
                  ) : (
                    <Play size={16} color="#e6e6e6" style={{ marginLeft: 1 }} />
                  )}
                </button>
                <button
                  onClick={next}
                  aria-label="Next track"
                  className="w-8 h-8 flex items-center justify-center transition-opacity"
                  style={{ color: 'rgba(230,230,230,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Volume — desktop only */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0 w-32">
                <Volume2 size={14} style={{ color: 'rgba(230,230,230,0.35)' }} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  aria-label="Volume"
                  className="flex-1 h-0.5 appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #004df1 0%, #004df1 ${volume}%, rgba(0,77,241,0.15) ${volume}%, rgba(0,77,241,0.15) 100%)`
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
