import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import FooterWithResistance from '../components/FooterWithResistance';

const tracks = [
  { 
    id: 'moths-lament',
    title: "Moth's Lament", 
    album: "Night Hymns",
    duration: "4:32",
    status: "final",
    bpm: 128,
    stems: true,
    image: "https://images.unsplash.com/photo-1665933595176-82ab2338afea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW90aCUyMHdpbmdzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcyNDc0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true
  },
  { 
    id: 'cemetery',
    title: "Mounting Mountain Cemetery", 
    album: "Severance",
    duration: "5:47",
    status: "final",
    bpm: 115,
    stems: true,
    image: "https://images.unsplash.com/photo-1768927159325-89dfade96f96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1ldGVyeSUyMG1vdW50YWluJTIwbmlnaHR8ZW58MXx8fHwxNzcyNDc0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: 'ritual-chant',
    title: "Ritual Chant", 
    album: "Demos Vol. 1",
    duration: "3:21",
    status: "demo",
    bpm: 95,
    stems: false,
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5kbGVzJTIwcml0dWFsJTIwZGFya3xlbnwxfHx8fDE3NzI1NjA4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: 'severance-hymn',
    title: "Severance Hymn", 
    album: "Demos Vol. 1",
    duration: "4:15",
    status: "demo",
    bpm: 108,
    stems: false,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBtaXN0JTIwZGFya3xlbnwxfHx8fDE3NzI1NjA4ODB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: 'void-walker',
    title: "Void Walker", 
    album: "Demos Vol. 1",
    duration: "5:03",
    status: "b-side",
    bpm: 122,
    stems: true,
    image: "https://images.unsplash.com/photo-1514999037859-b486988734f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3QlMjB2b2lkfGVufDF8fHx8MTc3MjU2MTEwMHww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  { 
    id: 'eclipse-ritual',
    title: "Eclipse Ritual", 
    album: "Demos Vol. 1",
    duration: "4:48",
    status: "demo",
    bpm: 130,
    stems: false,
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY2xpcHNlJTIwbW9vbnxlbnwxfHx8fDE3NzI1NjExMjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<typeof tracks[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);

  const featuredTrack = tracks.find(t => t.featured) || tracks[0];
  const latestDemo = tracks.find(t => t.status === 'demo') || tracks[2];
  const otherTracks = tracks.filter(t => t.id !== featuredTrack.id);
  const demoTracks = tracks.filter(t => t.status === 'demo' || t.status === 'b-side');

  // Handle scroll for nav state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handlePlayTrack = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextTrack = tracks[(currentIndex + 1) % tracks.length];
    setCurrentTrack(nextTrack);
    setProgress(0);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length];
    setCurrentTrack(prevTrack);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#e8e1d3] flex flex-col">
      {/* Small CTA Nav - Initial State */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <Link
              to={`/signal#${latestDemo.id}`}
              className="flex items-center gap-3 bg-[#3d3629]/90 backdrop-blur-sm border-2 border-[#8b7e6a] px-6 py-3 hover:bg-[#3d3629] transition-all group"
            >
              <span className="text-mono text-[10px] text-[#c9a353] tracking-widest">
                v0.14.0
              </span>
              <span className="text-mono text-xs text-[#e8e1d3] tracking-wide">
                {latestDemo.title} — NEW DEMO
              </span>
              <span className="text-[#c9a353] transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation - Scrolled State */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <div className="container mx-auto">
              <nav className="bg-[#e8e1d3]/80 backdrop-blur-md border-2 border-[#8b7e6a] px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* Logo/Brand */}
                  <Link to="/" className="text-blackletter text-xl text-[#2b2820]">
                    EXIT.WAVE
                  </Link>

                  {/* Center Nav */}
                  <div className="flex items-center gap-8 text-mono text-xs tracking-widest">
                    <Link 
                      to="/signal" 
                      className="text-[#2b2820]/70 hover:text-[#3a8a7a] transition-colors"
                    >
                      MUSIC
                    </Link>
                    <Link 
                      to="/coven" 
                      className="text-[#2b2820]/70 hover:text-[#3a8a7a] transition-colors"
                    >
                      COVEN
                    </Link>
                    <Link 
                      to="/ritual" 
                      className="text-[#2b2820]/70 hover:text-[#3a8a7a] transition-colors"
                    >
                      CONTACT
                    </Link>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center gap-2 text-mono text-xs text-[#2b2820]/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3a8a7a] animate-pulse" />
                    <span>SIGNAL ACTIVE</span>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">
        {/* Hero section - Featured Track with Background Cards */}
        <section className="relative py-16 px-8 overflow-hidden">
          {/* Masonry Grid Background */}
          <div className="absolute inset-0 -mx-32 grid grid-cols-6 gap-0">
            {/* Repeat cards to fill the space */}
            {[...Array(3)].map((_, rowIndex) => (
              tracks.map((track, trackIndex) => (
                <motion.div
                  key={`${rowIndex}-${trackIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ duration: 0.8, delay: (rowIndex * tracks.length + trackIndex) * 0.05 }}
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

          {/* Fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#e8e1d3] to-transparent pointer-events-none z-10" />

          {/* Featured Card - Center */}
          <div className="relative z-20 container mx-auto max-w-7xl flex items-center justify-center min-h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-2xl"
            >
              <div className="mtg-card-frame overflow-hidden">
                {/* Top border */}
                <div className="h-6 bg-[#8b7e6a]" />

                {/* Track image */}
                <div className="relative p-3 bg-[#d4cbb8]">
                  <div className="mtg-card-inner-border relative aspect-video overflow-hidden">
                    <img 
                      src={featuredTrack.image} 
                      alt={featuredTrack.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'sepia(0.15) contrast(1.1)' }}
                    />
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-[#1a1816]/60 flex items-end justify-center pb-6">
                      <button
                        onClick={() => handlePlayTrack(featuredTrack)}
                        className="w-20 h-20 border-2 border-[#3a8a7a] bg-[#e8e1d3] text-[#3a8a7a] hover:bg-[#3a8a7a] hover:text-[#e8e1d3] transition-all duration-300 flex items-center justify-center"
                      >
                        {isPlaying && currentTrack?.id === featuredTrack.id ? (
                          <Pause size={32} />
                        ) : (
                          <Play size={32} className="ml-1" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Track info */}
                <div className="p-6 bg-[#d4cbb8]">
                  <div className="mb-4 pb-3 border-b-2 border-[#8b7e6a]/40">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h2 className="text-blackletter text-3xl text-[#2b2820] mb-1 leading-tight">
                          {featuredTrack.title}
                        </h2>
                        <div className="text-mono text-xs text-[#2b2820]/50 tracking-widest">
                          {featuredTrack.album.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-mono text-lg text-[#c9a353] font-medium">
                          {featuredTrack.duration}
                        </div>
                        <div className="text-mono text-[9px] text-[#2b2820]/40 tracking-wider">
                          DURATION
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attribution */}
                  <div className="flex items-center justify-between text-mono text-xs text-[#2b2820]/40 tracking-widest">
                    <span>◆ EXIT.WAVE</span>
                    <span>MMXXVI</span>
                  </div>
                </div>

                {/* Bottom border */}
                <div className="h-4 bg-[#8b7e6a]" />
              </div>

              {/* Featured badge */}
              
            </motion.div>
          </div>
        </section>

        {/* Terminal Track List */}
        <section className="py-16 px-8">
          <div className="container mx-auto px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-2 border-[#8b7e6a] bg-[#1a1816] p-8 text-[#4fd1d1]"
            >
              {/* Terminal Header */}
              <div className="text-mono text-xs mb-6 pb-4 border-b border-[#4fd1d1]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#4fd1d1]/70">EXIT.WAVE DEMO ARCHIVE</span>
                  <span className="text-[#4fd1d1]/50">v0.14.0</span>
                </div>
                <div className="text-[10px] text-[#4fd1d1]/50">
                  {demoTracks.length} ENTRIES FOUND
                </div>
              </div>

              {/* Table Header */}
              <div className="text-mono text-[10px] mb-3 pb-2 border-b border-[#4fd1d1]/20 grid grid-cols-12 gap-4 text-[#4fd1d1]/60 tracking-widest">
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
                    className="text-mono text-xs py-3 border-b border-[#4fd1d1]/10 grid grid-cols-12 gap-4 items-center hover:bg-[#4fd1d1]/5 transition-colors"
                  >
                    <div className="col-span-1 text-[#4fd1d1]/50">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="col-span-4 text-[#4fd1d1]">
                      {track.title}
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-0.5 border text-[9px] tracking-wider ${
                        track.status === 'demo' 
                          ? 'border-[#c85a3e] text-[#c85a3e]' 
                          : track.status === 'b-side'
                          ? 'border-[#c9a353] text-[#c9a353]'
                          : 'border-[#3a8a7a] text-[#3a8a7a]'
                      }`}>
                        {track.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="col-span-1 text-[#4fd1d1]/70">
                      {track.bpm}
                    </div>
                    <div className="col-span-2 text-[#4fd1d1]/70">
                      {track.stems ? '✓ AVAILABLE' : '✗ N/A'}
                    </div>
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="px-3 py-1 border border-[#4fd1d1] text-[#4fd1d1] hover:bg-[#4fd1d1] hover:text-[#1a1816] transition-all text-[10px] tracking-widest"
                      >
                        {isPlaying && currentTrack?.id === track.id ? 'PAUSE' : 'PLAY'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Terminal Footer */}
              <div className="text-mono text-[9px] text-[#4fd1d1]/40 mt-6 pt-4 border-t border-[#4fd1d1]/20">
                <span className="animate-pulse">█</span> END_OF_TRANSMISSION
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Sticky Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
            style={{ width: '90vw' }}
          >
            <div className="border-2 border-[#8b7e6a] bg-[#d4cbb8] p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 border-2 border-[#8b7e6a] overflow-hidden flex-shrink-0">
                  <img 
                    src={currentTrack.image} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                    style={{ filter: 'sepia(0.15) contrast(1.1)' }}
                  />
                </div>

                {/* Track Info */}
                <div className="flex-shrink-0 w-48">
                  <div className="text-blackletter text-sm text-[#2b2820] leading-tight">
                    {currentTrack.title}
                  </div>
                  <div className="text-mono text-[9px] text-[#2b2820]/50 tracking-widest">
                    {currentTrack.album.toUpperCase()}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handlePrevious}
                    className="w-8 h-8 border border-[#8b7e6a] text-[#2b2820] hover:bg-[#8b7e6a] hover:text-[#e8e1d3] transition-all flex items-center justify-center"
                  >
                    <SkipBack size={14} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 border-2 border-[#3a8a7a] bg-[#3a8a7a] text-[#e8e1d3] hover:bg-transparent hover:text-[#3a8a7a] transition-all flex items-center justify-center"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 border border-[#8b7e6a] text-[#2b2820] hover:bg-[#8b7e6a] hover:text-[#e8e1d3] transition-all flex items-center justify-center"
                  >
                    <SkipForward size={14} />
                  </button>
                </div>

                {/* Scrub Bar */}
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-mono text-[9px] text-[#2b2820]/50 tracking-wider">
                    {Math.floor(progress / 100 * 252)}s
                  </span>
                  <div className="flex-1 h-2 bg-[#8b7e6a]/20 border border-[#8b7e6a]/30 relative cursor-pointer">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-[#3a8a7a]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-mono text-[9px] text-[#2b2820]/50 tracking-wider">
                    {currentTrack.duration}
                  </span>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 flex-shrink-0 w-32">
                  <Volume2 size={14} className="text-[#2b2820]/60" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="flex-1 h-1 bg-[#8b7e6a]/20 appearance-none cursor-pointer"
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

      {/* Footer */}
      <FooterWithResistance />
    </div>
  );
}