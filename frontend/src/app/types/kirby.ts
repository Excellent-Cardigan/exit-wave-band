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

/** Shape returned by /cms/albums.json */
export interface KirbyAlbum {
  id: string;
  title: string;
  year: number;
  artist: string;      // defaults to "exit.wave"; solo records use the member's circle name
  coverImage: string;
  trackSlugs: string[];
}

/** Shape returned by /cms/dispatches.json */
export interface KirbyDispatch {
  id: string;
  title: string;
  date: string;       // ISO date string: "2026-03-29"
  author: string;
  body: string;       // HTML from Kirby's kirbytext parser
  coverImage: string;
}
