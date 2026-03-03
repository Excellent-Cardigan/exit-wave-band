export interface Track {
  id: string;
  title: string;
  album: string;
  duration: string;
  audioSrc: string;
  image: string;
  status: 'final' | 'demo' | 'b-side';
  bpm: number;
  stems: boolean;
  featured?: boolean;
}

export const tracks: Track[] = [
  {
    id: 'moths-lament',
    title: "Moth's Lament",
    album: 'Night Hymns',
    duration: '4:32',
    audioSrc: '/audio/moths-lament/moths-lament.wav',
    image: 'https://images.unsplash.com/photo-1665933595176-82ab2338afea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW90aCUyMHdpbmdzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzcyNDc0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'final',
    bpm: 128,
    stems: true,
    featured: true,
  },
  {
    id: 'mounting-mountain-cemetery',
    title: 'Mounting Mountain Cemetery',
    album: 'Severance',
    duration: '5:47',
    audioSrc: '/audio/mounting-mountain-cemetary/mounting-mountain-cemetary.wav',
    image: 'https://images.unsplash.com/photo-1768927159325-89dfade96f96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZW1ldGVyeSUyMG1vdW50YWluJTIwbmlnaHR8ZW58MXx8fHwxNzcyNDc0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'final',
    bpm: 115,
    stems: true,
  },
  {
    id: 'soft-pain',
    title: 'Soft Pain',
    album: 'Demos Vol. 1',
    duration: '3:21',
    audioSrc: '/audio/soft-pain/soft-pain.wav',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5kbGVzJTIwcml0dWFsJTIwZGFya3xlbnwxfHx8fDE3NzI1NjA4NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'demo',
    bpm: 95,
    stems: false,
  },
];
