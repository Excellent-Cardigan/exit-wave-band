import { Play, Pause } from 'lucide-react';

interface TrackCardProps {
  title: string;
  album: string;
  duration: string;
  image: string;
  bpm?: number;
  isPlaying?: boolean;
  isActive?: boolean;
  onPlayPause?: () => void;
}

export default function TrackCard({
  title,
  album,
  duration,
  image,
  bpm,
  isPlaying = false,
  isActive = true,
  onPlayPause,
}: TrackCardProps) {
  const beatPulseStyle = isPlaying && bpm
    ? { animation: `beat-pulse ${(60 / bpm).toFixed(2)}s ease-out infinite` }
    : undefined;

  return (
    <div className="bg-[#fafeef] flex flex-col border-2 border-[#838b6a]">
      {/* Image section */}
      <div className="relative p-5 h-[260px] sm:h-[376px]">
        <div className="relative w-full h-full overflow-hidden border-2 border-[#838b6a]">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[rgba(131,139,106,0.7)]" />
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={onPlayPause}
                aria-label={isPlaying ? 'Pause' : `Play ${title}`}
                className="w-20 h-20 bg-[#c7ff1d] flex items-center justify-center hover:brightness-110 transition-all duration-200"
                style={beatPulseStyle}
              >
                {isPlaying ? (
                  <Pause size={32} className="text-[#36430f]" />
                ) : (
                  <Play size={32} className="text-[#36430f] ml-1" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2 pb-4 border-b-2 border-[rgba(131,139,106,0.4)]">
          <div className="flex items-end w-full gap-2">
            <h2
              className="flex-1 text-[#36430f] text-[22px] sm:text-[32px] uppercase leading-none"
              style={{
                fontFamily: "'ohno-fatface', serif",
                letterSpacing: '-1.28px',
                fontFeatureSettings: "'dlig' 1",
              }}
            >
              {title}
            </h2>
            <span className="text-mono text-base text-[#6f8825] leading-none shrink-0">
              {duration}
            </span>
          </div>
          <p className="text-mono text-xs text-[rgba(131,139,106,0.8)] tracking-[0.54px]">
            {album.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center justify-between h-4">
          <span className="text-mono text-xs text-[rgba(131,139,106,0.6)] tracking-[0.48px]">
            ◆ EXIT.WAVE
          </span>
          <span className="text-mono text-xs text-[rgba(131,139,106,0.6)] tracking-[0.48px]">
            MMXXVI
          </span>
        </div>
      </div>
    </div>
  );
}
