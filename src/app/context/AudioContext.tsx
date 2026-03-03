import { createContext, useContext, useRef, useState, useEffect } from 'react';
import type { KirbyTrack } from '../types/kirby';

interface AudioContextType {
  currentTrack: KirbyTrack | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  trackList: KirbyTrack[];
  play: (track: KirbyTrack, list?: KirbyTrack[]) => void;
  pause: () => void;
  togglePlay: (track: KirbyTrack, list?: KirbyTrack[]) => void;
  next: () => void;
  previous: () => void;
  setVolume: (vol: number) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

export function useAudio(): AudioContextType {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<KirbyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [trackList, setTrackList] = useState<KirbyTrack[]>([]);

  // Refs for stable references inside event handlers (avoid stale closures)
  const currentTrackRef = useRef<KirbyTrack | null>(null);
  const trackListRef = useRef<KirbyTrack[]>([]);
  const isPlayingRef = useRef(false);

  // Keep refs in sync with state
  currentTrackRef.current = currentTrack;
  trackListRef.current = trackList;
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      const list = trackListRef.current;
      const track = currentTrackRef.current;
      if (!list.length || !track) return;
      const currentIndex = list.findIndex(t => t.id === track.id);
      const nextTrack = list[(currentIndex + 1) % list.length];
      audio.src = nextTrack.audioSrc;
      audio.load();
      audio.play().catch(() => setIsPlaying(false));
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
      setProgress(0);
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  function play(track: KirbyTrack, list?: KirbyTrack[]) {
    const audio = audioRef.current;
    if (!audio) return;
    if (list) {
      setTrackList(list);
      trackListRef.current = list;
    }
    audio.pause();
    audio.src = track.audioSrc;
    audio.load();
    audio.play().catch(() => setIsPlaying(false));
    setCurrentTrack(track);
    currentTrackRef.current = track;
    setIsPlaying(true);
    setProgress(0);
  }

  function pause() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  function togglePlay(track: KirbyTrack, list?: KirbyTrack[]) {
    if (currentTrackRef.current?.id === track.id) {
      if (isPlayingRef.current) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    } else {
      play(track, list);
    }
  }

  function next() {
    const list = trackListRef.current;
    const track = currentTrackRef.current;
    if (!list.length || !track) return;
    const currentIndex = list.findIndex(t => t.id === track.id);
    play(list[(currentIndex + 1) % list.length]);
  }

  function previous() {
    const list = trackListRef.current;
    const track = currentTrackRef.current;
    if (!list.length || !track) return;
    const currentIndex = list.findIndex(t => t.id === track.id);
    play(list[(currentIndex - 1 + list.length) % list.length]);
  }

  function setVolume(vol: number) {
    setVolumeState(vol);
  }

  const contextValue: AudioContextType = {
    currentTrack,
    isPlaying,
    progress,
    volume,
    trackList,
    play,
    pause,
    togglePlay,
    next,
    previous,
    setVolume,
  };

  return <AudioCtx.Provider value={contextValue}>{children}</AudioCtx.Provider>;
}
