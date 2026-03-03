/** Shape returned by /cms/tracks.json — mirrors the existing Track interface */
export interface KirbyTrack {
  id: string;
  title: string;
  album: string;
  duration: string;
  audioSrc: string;
  image: string;
  status: 'final' | 'demo' | 'b-side';
  bpm: number;
  stems: boolean;
  featured: boolean;
}

/** Shape returned by /cms/members.json */
export interface KirbyMember {
  id: string;
  circleName: string;
  realName: string;
  role: string;
  sigil: string;
  color: string;
  image: string;
}

/** Shape returned by /cms/lore.json */
export interface KirbyLoreEntry {
  id: number;
  text: string;
  hidden: boolean;
  revelationOrder: number;
}
