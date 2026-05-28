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
    <div
      style={{
        background: '#010313',
        border: '1px solid #004df1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <div className="relative p-5">
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: '4/3',
            border: '1px solid rgba(0,77,241,0.4)',
          }}
        >
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            style={{ filter: 'saturate(0.5) contrast(1.1) brightness(0.75)' }}
          />
          {/* Blue duotone overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,77,241,0.25)', mixBlendMode: 'multiply' }}
          />
          {/* Play button */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={onPlayPause}
                aria-label={isPlaying ? 'Pause' : `Play ${title}`}
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: 80,
                  height: 80,
                  background: '#004df1',
                  border: 'none',
                  cursor: 'pointer',
                  ...beatPulseStyle,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#0040cc';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#004df1';
                }}
              >
                {isPlaying ? (
                  <Pause size={32} color="#e6e6e6" />
                ) : (
                  <Play size={32} color="#e6e6e6" style={{ marginLeft: 3 }} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info section */}
      <div className="flex flex-col gap-4 px-6 pt-0 pb-6">
        {/* Title row */}
        <div
          className="flex flex-col gap-2 pb-4"
          style={{ borderBottom: '1px solid rgba(0,77,241,0.2)' }}
        >
          <div className="flex items-end w-full gap-2">
            <h2
              className="flex-1 uppercase leading-none text-display"
              style={{
                fontSize: '5vw',
                fontWeight: 400,
                color: '#e6e6e6',
                letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              {title}
            </h2>
            <span
              className="leading-none shrink-0 text-mono"
              style={{ fontSize: 16, color: 'rgba(0,77,241,0.7)' }}
            >
              {duration}
            </span>
          </div>
          <p
            className="text-mono"
            style={{
              fontSize: 11,
              color: 'rgba(230,230,230,0.3)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {album}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between h-4">
          <span
            className="text-mono"
            style={{ fontSize: 10, color: 'rgba(0,77,241,0.5)', letterSpacing: '0.1em' }}
          >
            ◆ EXIT.WAVE
          </span>
          <span
            className="text-mono"
            style={{ fontSize: 10, color: 'rgba(230,230,230,0.2)', letterSpacing: '0.08em' }}
          >
            MMXXVI
          </span>
        </div>
      </div>
    </div>
  );
}
