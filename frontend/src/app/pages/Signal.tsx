import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import { useKirbyData } from '../hooks/useKirbyData';
import { useAudio } from '../context/AudioContext';
import type { KirbyTrack } from '../types/kirby';

// ---------------------------------------------------------------------------
// ParticleField — 100 drifting ambient particles on a canvas
// ---------------------------------------------------------------------------
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.05,
      radius: Math.random() * 1.5 + 0.4,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,77,241,${p.opacity * 0.6})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

// ---------------------------------------------------------------------------
// ScanLines — horizontal scan-line texture overlay
// ---------------------------------------------------------------------------
function ScanLines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        background:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// GrainOverlay — SVG noise texture blended over the scene
// ---------------------------------------------------------------------------
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        opacity: 0.07,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// CardFrame — MTG-inspired dark track card
// ---------------------------------------------------------------------------
const CARD_WIDTH = 340;
const CORNER_PX = 14;

interface CardFrameProps {
  track: KirbyTrack;
  isActive: boolean;
  isCurrentlyPlaying: boolean;
  onPlay: () => void;
}

function CardFrame({ track, isActive, isCurrentlyPlaying, onPlay }: CardFrameProps) {
  const cornerBorders = [
    { top: 0, left: 0, borderTop: '1px solid rgba(0,77,241,0.5)', borderLeft: '1px solid rgba(0,77,241,0.5)' },
    { top: 0, right: 0, borderTop: '1px solid rgba(0,77,241,0.5)', borderRight: '1px solid rgba(0,77,241,0.5)' },
    { bottom: 0, left: 0, borderBottom: '1px solid rgba(0,77,241,0.5)', borderLeft: '1px solid rgba(0,77,241,0.5)' },
    { bottom: 0, right: 0, borderBottom: '1px solid rgba(0,77,241,0.5)', borderRight: '1px solid rgba(0,77,241,0.5)' },
  ];

  return (
    <div
      style={{
        width: CARD_WIDTH,
        background: 'rgba(10,10,12,0.85)',
        border: '1px solid rgba(0,77,241,0.15)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Corner accents */}
      {cornerBorders.map((style, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: CORNER_PX,
            height: CORNER_PX,
            zIndex: 2,
            pointerEvents: 'none',
            ...style,
          }}
        />
      ))}

      {/* Art window — 16:10 */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
        <img
          src={track.image}
          alt={track.title}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'saturate(0.7) contrast(1.1) brightness(0.85)',
            display: 'block',
          }}
        />
        {/* Gradient fade from art into card body */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,12,0.65) 100%)',
          }}
        />
        {/* Play/pause button */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={onPlay}
              aria-label={isCurrentlyPlaying ? 'Pause' : `Play ${track.title}`}
              style={{
                width: 56,
                height: 56,
                background: '#004df1',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#0040cc';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#004df1';
              }}
            >
              {isCurrentlyPlaying ? (
                <Pause size={20} color="#e6e6e6" />
              ) : (
                <Play size={20} color="#e6e6e6" style={{ marginLeft: 2 }} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Track metadata */}
      <div
        style={{
          padding: '16px 20px 12px',
          borderTop: '1px solid rgba(0,77,241,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 400,
              color: 'rgba(220,215,205,0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
              lineHeight: 1.2,
              flex: 1,
            }}
          >
            {track.title}
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: 'rgba(220,215,205,0.4)',
              letterSpacing: '0.05em',
              paddingLeft: 12,
              paddingTop: 2,
              flexShrink: 0,
            }}
          >
            {track.duration}
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: 'rgba(220,215,205,0.25)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {track.album}
        </p>
      </div>

      {/* Card footer */}
      <div
        style={{
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(0,77,241,0.1)',
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: 'rgba(0,77,241,0.6)',
            letterSpacing: '0.15em',
          }}
        >
          ◆ EXIT.WAVE
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: 'rgba(220,215,205,0.2)',
            letterSpacing: '0.1em',
          }}
        >
          MMXXVI
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Signal page
// ---------------------------------------------------------------------------
export default function Signal() {
  const { data: tracks, loading: tracksLoading } = useKirbyData<KirbyTrack[]>('tracks.json');
  const trackList = tracks ?? [];
  const [activeCard, setActiveCard] = useState(0);
  const { isPlaying, currentTrack, togglePlay } = useAudio();

  // Auto-rotate carousel every 6s
  useEffect(() => {
    if (trackList.length <= 1) return;
    const intervalId = setInterval(() => {
      setActiveCard(prev => (prev + 1) % trackList.length);
    }, 6000);
    return () => clearInterval(intervalId);
  }, [trackList.length]);

  const getCardTransform = (index: number) => {
    const offset = index - activeCard;
    const absOffset = Math.abs(offset);
    return {
      x: offset * CARD_WIDTH,
      scale: absOffset === 0 ? 1.0 : 0.82,
      opacity: absOffset === 0 ? 1.0 : absOffset === 1 ? 0.3 : 0.0,
      blur: absOffset === 0 ? 0 : 2,
      zIndex: absOffset === 0 ? 10 : 5,
    };
  };

  const activeTrack = trackList[activeCard] ?? null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#010313',
        color: 'rgba(220,215,205,0.9)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ParticleField />
      <ScanLines />
      <GrainOverlay />

      {/* Blurred background — active track art */}
      {activeTrack?.image && (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 1, overflow: 'hidden' }}
        >
          <img
            src={activeTrack.image}
            alt=""
            style={{
              width: '120%',
              height: '120%',
              objectFit: 'cover',
              transform: 'scale(1.2)',
              filter: 'blur(40px) saturate(0.3) brightness(0.15)',
              marginLeft: '-10%',
              marginTop: '-10%',
              transition: 'all 1.2s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, rgba(10,10,12,0.4) 0%, rgba(10,10,12,0.85) 70%, #010313 100%)',
            }}
          />
        </div>
      )}

      {/* Decorative 6-column background grid — desktop only */}
      {!tracksLoading && trackList.length > 0 && (
        <div
          aria-hidden="true"
          className="hidden sm:grid"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1,
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 0,
            pointerEvents: 'none',
            opacity: 0.06,
          }}
        >
          {Array.from({ length: 6 }, (_, colIndex) => {
            const track = trackList[colIndex % trackList.length];
            return track ? (
              <img
                key={colIndex}
                src={track.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : null;
          })}
        </div>
      )}

      {/* Navigation sits above the scene */}
      <div style={{ position: 'relative', zIndex: 60 }}>
        <Navigation />
      </div>

      <main
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          paddingTop: 80,
          paddingBottom: 140,
        }}
      >
        {/* Carousel viewport */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 380,
            marginTop: 40,
          }}
        >
          {tracksLoading ? (
            <div
              style={{
                width: CARD_WIDTH,
                height: 320,
                background: 'rgba(0,77,241,0.04)',
                border: '1px solid rgba(0,77,241,0.1)',
              }}
            />
          ) : (
            trackList.map((track, index) => {
              const { x, scale, opacity, blur, zIndex } = getCardTransform(index);
              const isActive = index === activeCard;
              const isCurrentlyPlaying = isPlaying && currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => !isActive && setActiveCard(index)}
                  style={{
                    position: 'absolute',
                    transform: `translateX(${x}px) scale(${scale})`,
                    opacity,
                    filter: blur > 0 ? `blur(${blur}px)` : 'none',
                    zIndex,
                    transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                >
                  <CardFrame
                    track={track}
                    isActive={isActive}
                    isCurrentlyPlaying={isCurrentlyPlaying}
                    onPlay={() => togglePlay(track, trackList)}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Carousel indicator dots */}
        {!tracksLoading && trackList.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 48, alignItems: 'center' }}>
            {trackList.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCard(index)}
                aria-label={`Go to track ${index + 1}`}
                style={{
                  width: index === activeCard ? 24 : 8,
                  height: 4,
                  background:
                    index === activeCard ? '#004df1' : 'rgba(0,77,241,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            ))}
          </div>
        )}
      </main>

      <FooterWithResistance />
    </div>
  );
}
