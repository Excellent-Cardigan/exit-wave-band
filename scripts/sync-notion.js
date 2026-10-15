#!/usr/bin/env node
/**
 * sync-notion.js — Pull Songs + Albums from Notion into Kirby flat files.
 *
 * Setup:
 *   1. Create a .env file in the project root with: NOTION_TOKEN=secret_xxx
 *   2. Run: npm run sync-notion
 *
 * What it touches:
 *   content/1_tracks/{order}_{slug}/track.txt
 *   content/4_albums/{order}_{slug}/album.txt
 *
 * What it preserves:
 *   - Uuid        (generated once, never overwritten)
 *   - Audio files (only re-downloaded when the Dropbox URL changes)
 *
 * Notion databases (hardcoded IDs):
 *   Songs  dd9fb5ed-a1fb-830d-b4c2-077bf5badd32
 *   Albums 518355e7-21b7-4d4f-9baf-c3859be128be
 */

import { Client } from '@notionhq/client';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// ── .env loader (no external deps) ────────────────────────────────────────
try {
  const raw = readFileSync('.env', 'utf8');
  for (const line of raw.split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 1 || line.trimStart().startsWith('#')) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (k && !process.env[k]) process.env[k] = v;
  }
} catch { /* no .env file — that's fine if token is set in shell */ }

const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) {
  console.error('\n✗  NOTION_TOKEN is not set.');
  console.error('   Add it to a .env file in the project root:\n');
  console.error('   NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
  process.exit(1);
}

// ── Config ─────────────────────────────────────────────────────────────────
const SONGS_DB  = 'dd9fb5ed-a1fb-830d-b4c2-077bf5badd32';
const ALBUMS_DB = '518355e7-21b7-4d4f-9baf-c3859be128be';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const CONTENT    = join(__dirname, '../content');

const notion = new Client({ auth: TOKEN });

// ── Utilities ───────────────────────────────────────────────────────────────

/** "Moth's Lament" → "moths-lament" */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/['‘’‚‛ʼʹ`]/g, '') // all apostrophe variants
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Short random Kirby-style UUID */
function newUuid() {
  return (Math.random().toString(36) + Math.random().toString(36))
    .replace(/0\./g, '')
    .slice(0, 16);
}

/** Serialize an object to Kirby flat-file format */
function toKirby(fields) {
  return Object.entries(fields)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n\n----\n\n')
    + '\n';
}

/** Parse a Kirby .txt file into a lower-cased key → value map */
function parseKirby(filePath) {
  if (!existsSync(filePath)) return {};
  const blocks = readFileSync(filePath, 'utf8').split(/\n----\n/);
  const map = {};
  for (const block of blocks) {
    const b = block.trim();
    if (!b) continue;
    const colon = b.indexOf(':');
    if (colon < 0) continue;
    const key = b.slice(0, colon).trim().toLowerCase();
    const val = b.slice(colon + 1).trim();
    if (key) map[key] = val;
  }
  return map;
}

/** Find an existing `{n}_{slug}` folder by slug, ignoring order prefix */
function findFolder(parentDir, targetSlug) {
  if (!existsSync(parentDir)) return null;
  for (const entry of readdirSync(parentDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const m = entry.name.match(/^\d+_(.+)$/);
    if (m && m[1] === targetSlug) return entry.name;
  }
  return null;
}

// ── Audio download ──────────────────────────────────────────────────────────
const AUDIO_EXTS = new Set(['mp3', 'wav', 'm4a', 'flac', 'aiff', 'ogg']);

/**
 * Download an audio file from a URL into a Kirby content folder.
 * - skipIfExists: skip if any audio file with this slug already exists on disk
 *   (used for Notion file uploads where the signed URL changes each time)
 * - otherwise: skip only if the file exists AND the URL matches the stored URL
 * Writes a Kirby sidecar .txt so files()->template('audio') picks it up.
 */
async function downloadAudio(url, dir, trackSlug, prevUrl, skipIfExists = false) {
  let ext;
  try {
    const pathname = new URL(url).pathname;
    ext = extname(pathname).replace('.', '').toLowerCase();
  } catch {
    return; // malformed URL
  }
  if (!AUDIO_EXTS.has(ext)) return;

  const filename    = `${trackSlug}.${ext}`;
  const destPath    = join(dir, filename);
  const sidecarPath = join(dir, `${filename}.txt`);

  if (skipIfExists && existsSync(destPath)) {
    console.log(`  ~ audio unchanged (${filename})`);
    return;
  }
  if (!skipIfExists && existsSync(destPath) && url === prevUrl) {
    console.log(`  ~ audio unchanged (${filename})`);
    return;
  }

  process.stdout.write(`  ⬇ ${filename} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);

  writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
  writeFileSync(sidecarPath, 'Template: audio\n');
  console.log(' done');
}

// ── Notion property extractors ──────────────────────────────────────────────
const getTitle   = p => p?.title?.map(t => t.plain_text).join('') ?? '';
const getText    = p => p?.rich_text?.map(t => t.plain_text).join('') ?? '';
const getSelect  = p => p?.select?.name ?? '';
const getUrl     = p => p?.url ?? '';
const getBool    = p => (p?.checkbox ? 'true' : 'false');
const getNumber  = p => p?.number?.toString() ?? '';
// Returns { url, name } for the first file in a Notion files property, or null
const getFirstFile = p => {
  const f = p?.files?.[0];
  if (!f) return null;
  const url = f.type === 'external' ? f.external?.url : f.file?.url;
  return url ? { url, name: f.name ?? '' } : null;
};

// Website Status → Kirby track-status
const STATUS_MAP = { Demo: 'demo', 'B-Side': 'b-side', Final: 'final' };

// ── Sync Albums ─────────────────────────────────────────────────────────────
async function syncAlbums() {
  console.log('\n💿  Albums');

  const { results } = await notion.dataSources.query({
    data_source_id: ALBUMS_DB,
    sorts: [{ property: 'Year', direction: 'ascending' }],
  });

  const albumsDir = join(CONTENT, '4_albums');
  mkdirSync(albumsDir, { recursive: true });

  // Ensure parent index file exists
  const indexPath = join(albumsDir, 'albums.txt');
  if (!existsSync(indexPath)) {
    writeFileSync(indexPath, toKirby({ Title: 'Albums', Uuid: newUuid() }));
  }

  let order = 1;

  for (const page of results) {
    const name = getTitle(page.properties.Name);
    if (!name) continue;

    const s = slugify(name);
    const existing = findFolder(albumsDir, s);
    const folder   = existing ?? `${order}_${s}`;
    const dir      = join(albumsDir, folder);
    const file     = join(dir, 'album.txt');

    mkdirSync(dir, { recursive: true });

    const prev = parseKirby(file);

    writeFileSync(file, toKirby({
      Title:        name,
      Year:         getNumber(page.properties.Year)            || prev.year        || '',
      Artist:       prev.artist                                                    || 'exit.wave',
      'Artwork-url': getUrl(page.properties['Artwork URL'])    || prev['artwork-url'] || '',
      Description:  getText(page.properties.Description)       || prev.description || '',
      Uuid:         prev.uuid                                                      || newUuid(),
      'Notion-id':  page.id,
    }));

    console.log(`  ${existing ? '↻' : '+'} ${folder}/album.txt`);
    order++;
  }
}

// ── Sync Tracks ─────────────────────────────────────────────────────────────
async function syncTracks() {
  console.log('\n🎵  Tracks');

  const { results } = await notion.dataSources.query({
    data_source_id: SONGS_DB,
    filter: {
      property: 'Website Status',
      select: { does_not_equal: 'Hidden' },
    },
    sorts: [
      { property: 'Website Order', direction: 'ascending' },
      { property: 'Name',          direction: 'ascending'  },
    ],
  });

  const tracksDir = join(CONTENT, '1_tracks');
  mkdirSync(tracksDir, { recursive: true });

  // Ensure parent index file exists
  const indexPath = join(tracksDir, 'tracks.txt');
  if (!existsSync(indexPath)) {
    writeFileSync(indexPath, toKirby({ Title: 'Tracks', Uuid: newUuid() }));
  }

  // Collect all existing Notion-managed folders so we can remove orphans after sync
  const existingNotion = new Set();
  if (existsSync(tracksDir)) {
    for (const entry of readdirSync(tracksDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const txt = join(tracksDir, entry.name, 'track.txt');
      if (existsSync(txt) && parseKirby(txt)['notion-id']) {
        existingNotion.add(entry.name);
      }
    }
  }

  const writtenFolders = new Set();
  let order = 1;

  for (const page of results) {
    const name = getTitle(page.properties.Name);
    if (!name) continue;

    const s        = slugify(name);
    const existing = findFolder(tracksDir, s);
    const folder   = existing ?? `${order}_${s}`;
    const dir      = join(tracksDir, folder);
    const file     = join(dir, 'track.txt');

    mkdirSync(dir, { recursive: true });

    const prev = parseKirby(file);

    // Resolve album name from relation (one API call per track — cached implicitly)
    let albumName = prev.album || '';
    const albumRel = page.properties.Album?.relation ?? [];
    if (albumRel.length) {
      try {
        const albumPage = await notion.pages.retrieve({ page_id: albumRel[0].id });
        albumName = getTitle(albumPage.properties.Name);
      } catch { /* leave as prev */ }
    }

    const wsStatus    = getSelect(page.properties['Website Status']);
    const trackStatus = STATUS_MAP[wsStatus] ?? 'demo';
    const dropboxUrl  = getUrl(page.properties['Dropbox URL']) || prev['dropbox-url'] || '';
    const finalMp3    = getFirstFile(page.properties['Final MP3']);

    writeFileSync(file, toKirby({
      Title:          name,
      Album:          albumName,
      Duration:       getText(page.properties.Duration)       || prev.duration   || '',
      'Dropbox-url':  dropboxUrl,
      'Image-url':    getUrl(page.properties['Artwork URL'])  || prev['image-url'] || '',
      'Track-status': trackStatus,
      Bpm:            getText(page.properties.BPM)            || prev.bpm        || '',
      Stems:          prev.stems                                                  || 'false',
      Featured:       getBool(page.properties.Featured),
      Uuid:           prev.uuid                                                   || newUuid(),
      'Notion-id':    page.id,
    }));

    console.log(`  ${existing ? '↻' : '+'} ${folder}/track.txt`);

    // Final MP3 upload takes priority; Dropbox URL is fallback
    if (finalMp3) {
      // Signed URLs expire — skip re-download if file already on disk
      await downloadAudio(finalMp3.url, dir, s, null, true);
    } else if (dropboxUrl) {
      await downloadAudio(dropboxUrl, dir, s, prev['dropbox-url']);
    }

    writtenFolders.add(folder);
    order++;
  }

  // Remove Notion-managed folders that are no longer in the sync results
  for (const orphan of existingNotion) {
    if (!writtenFolders.has(orphan)) {
      rmSync(join(tracksDir, orphan), { recursive: true, force: true });
      console.log(`  ✗ removed ${orphan}`);
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('exit.wave — Notion → Kirby sync');
  console.log('================================');

  try {
    await syncAlbums();
    await syncTracks();
    console.log('\n✓  Done.\n');
    console.log('   Next: check content/, then npm run build to rebuild the site.');
    console.log('   Note: content/ is gitignored — push to server via FTP or Kirby panel.\n');
  } catch (err) {
    if (err?.code === 'unauthorized' || err?.status === 401) {
      console.error('\n✗  Unauthorized — check your NOTION_TOKEN in .env\n');
    } else {
      console.error('\n✗  Sync failed:', err.message, '\n');
    }
    process.exit(1);
  }
}

main();
