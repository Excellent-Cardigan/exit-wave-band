import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import { Play, Pause } from 'lucide-react';

const tracks = [
  { 
    title: "Moth's Lament", 
    album: "Night Hymns",
    duration: "4:32",
    image: "https://images.unsplash.com/photo-1665933595176-82ab2338afea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW90aCUyMHdpbmdzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcyNDc0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    title: "Mounting Mountain Cemetery", 
    album: "Severance",
    duration: "5:47",
    image: "https://images.unsplash.com/photo-1768927159325-89dfade96f96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1ldGVyeSUyMG1vdW50YWluJTIwbmlnaHR8ZW58MXx8fHwxNzcyNDc0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

export default function Signal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate waveform data
  const waveformData = useRef<number[]>([]);

  useEffect(() => {
    // Generate organic waveform data
    const points = 150;
    const data = [];
    for (let i = 0; i < points; i++) {
      const base = Math.sin(i * 0.08) * 0.4;
      const detail = Math.sin(i * 0.25) * 0.25;
      const noise = (Math.random() - 0.5) * 0.15;
      data.push(Math.abs(base + detail + noise) + 0.1);
    }
    waveformData.current = data;
  }, [activeIndex]);

  // Draw waveform (Dropbox style - flat bottom with peaks)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawWaveform = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const data = waveformData.current;
      const barWidth = width / data.length;

      ctx.clearRect(0, 0, width, height);

      // Draw waveform bars from bottom up
      data.forEach((amplitude, i) => {
        const x = i * barWidth;
        const barHeight = amplitude * height;
        
        // Determine if this section has been played
        const progress = isPlaying ? currentTime : 0;
        const barProgress = i / data.length;
        const hasPlayed = barProgress < progress;

        ctx.fillStyle = hasPlayed && isPlaying ? '#3a8a7a' : '#4a7c9e';
        ctx.globalAlpha = hasPlayed && isPlaying ? 0.9 : 0.4;

        // Draw from bottom up
        ctx.fillRect(
          x,
          height - barHeight,
          Math.max(barWidth - 1, 1),
          barHeight
        );
      });

      ctx.globalAlpha = 1;
    };

    drawWaveform();

    const animate = () => {
      drawWaveform();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, activeIndex]);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.01;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.deltaY > 0 && activeIndex < tracks.length - 1) {
          setActiveIndex(activeIndex + 1);
          setIsPlaying(false);
          setCurrentTime(0);
        } else if (e.deltaY < 0 && activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeIndex]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    const swipeThreshold = 50;
    
    if (info.offset.y < -swipeThreshold && activeIndex < tracks.length - 1) {
      setActiveIndex(activeIndex + 1);
      setIsPlaying(false);
      setCurrentTime(0);
    } else if (info.offset.y > swipeThreshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#e8e1d3] text-[#2b2820] relative">
      <Navigation />
      
      <div className="container mx-auto px-8 py-24">
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

        {/* Stacked cards container */}
        <div 
          ref={containerRef}
          className="relative flex items-start justify-center min-h-[700px] pt-8"
        >
          {tracks.map((track, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;
            const isVisible = offset >= 0 && offset <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={track.title}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ 
                  scale: 1 - offset * 0.08,
                  y: offset * 30,
                  opacity: 0,
                }}
                animate={{ 
                  scale: 1 - offset * 0.08,
                  y: offset * 30,
                  opacity: 1 - offset * 0.4,
                  zIndex: 10 - offset,
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260,
                  damping: 30,
                }}
                className="absolute w-full max-w-2xl cursor-grab active:cursor-grabbing"
                style={{ 
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className={`mtg-card-frame overflow-hidden transition-all duration-300 ${
                  isActive ? '' : 'opacity-70'
                }`}>
                  {/* Ornamental top border */}
                  <div className="h-6 bg-[#8b7e6a] flex items-center justify-center">
                    <div className="w-full h-full" />
                  </div>

                  {/* Track image with inner border */}
                  <div className="relative p-3 bg-[#d4cbb8]">
                    <div className="mtg-card-inner-border relative aspect-video overflow-hidden">
                      <img 
                        src={track.image} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                        style={{ filter: 'sepia(0.15) contrast(1.1)' }}
                      />
                      
                      {/* Play overlay */}
                      {isActive && (
                        <div className="absolute inset-0 bg-[#1a1816]/60 flex items-end justify-center pb-6">
                          <button
                            onClick={handlePlayPause}
                            className={`w-16 h-16 border-2 transition-all duration-300 flex items-center justify-center ${
                              isPlaying 
                                ? 'border-[#1A1EFF] bg-[#e8e1d3] text-[#1A1EFF] hover:bg-[#1A1EFF] hover:text-[#e8e1d3]'
                                : 'border-[#3a8a7a] bg-[#e8e1d3] text-[#3a8a7a] hover:bg-[#3a8a7a] hover:text-[#e8e1d3]'
                            }`}
                          >
                            {isPlaying ? (
                              <Pause size={24} />
                            ) : (
                              <Play size={24} className="ml-0.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Track info section */}
                  <div className="p-6 bg-[#d4cbb8]">
                    {/* Title bar with ornamental design */}
                    <div className="mb-4 pb-3 border-b-2 border-[#8b7e6a]/40">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h2 className="text-blackletter text-3xl text-[#1A1EFF] mb-1 leading-tight">
                            {track.title}
                          </h2>
                          <div className="text-mono text-[10px] text-[#2b2820]/50 tracking-widest">
                            {track.album.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-mono text-sm text-[#c9a353] font-medium">
                            {track.duration}
                          </div>
                          <div className="text-mono text-[9px] text-[#2b2820]/40 tracking-wider">
                            DURATION
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Waveform */}
                    {isActive && (
                      <div className="relative h-20 mb-4 mtg-card-inner-border bg-[#e8e1d3] p-2">
                        <canvas
                          ref={canvasRef}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    {/* Attribution */}
                    <div className="flex items-center justify-between text-mono text-[10px] text-[#2b2820]/40 tracking-widest">
                      <span>◆ EXIT.WAVE</span>
                      <span>MMXXVI</span>
                    </div>
                  </div>

                  {/* Ornamental bottom border */}
                  <div className="h-4 bg-[#8b7e6a]" />
                </div>
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