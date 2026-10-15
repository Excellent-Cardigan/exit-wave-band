import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:5173';
const directions = [
  { name: 'index', url: '/index.html' },
  { name: '1-signal-lock', url: '/signal-lock.html' },
  { name: '2-dead-channel', url: '/dead-channel.html' },
  { name: '3-index-dir', url: '/index-dir.html' },
  { name: '4-collective', url: '/collective.html' },
  { name: '5-broadcast', url: '/broadcast.html' },
  { name: '6-mirrorball', url: '/mirrorball.html' },
];

await mkdir('screenshots', { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

for (const { name, url } of directions) {
  try {
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2500)); // Wait for shaders to animate in
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: false });
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
  }
}

await browser.close();
console.log('Done — screenshots/ directory');
