import { ShaderMount, ditheringFragmentShader } from '@paper-design/shaders';

const coverShaderEl = document.getElementById('coverShader')!;
const coverArtEl = document.getElementById('coverArt')!;
const signalLineEl = document.getElementById('signalLine')!;
const coverPanel = document.getElementById('coverPanel')!;

// Dithering shader: starts as heavy static, resolves to clear
const uniforms = {
  u_colorBack: [0.04, 0.04, 0.07, 1] as [number, number, number, number],
  u_colorFront: [0.98, 1.0, 0.94, 1] as [number, number, number, number],
  u_shape: 2 as const, // warp
  u_type: 3 as const,  // 4×4 Bayer
  u_pxSize: 7.0,
};

const mount = new ShaderMount(coverShaderEl, ditheringFragmentShader, uniforms, undefined, 0.6);

// Load reveal: dithering resolves from static (pxSize 7 → 0.5) over ~2s
let startTime: number | null = null;
const RESOLVE_DURATION = 2200;

function resolveShader(ts: number) {
  if (!startTime) startTime = ts;
  const elapsed = ts - startTime;
  const progress = Math.min(elapsed / RESOLVE_DURATION, 1);
  const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
  const pxSize = 7.0 - (7.0 - 0.5) * eased;
  mount.setUniforms({ u_pxSize: pxSize });

  if (progress < 1) {
    requestAnimationFrame(resolveShader);
  } else {
    // Reveal cover art and signal line
    coverArtEl.classList.add('revealed');
    signalLineEl.classList.add('revealed');
  }
}

// Stagger the UI reveals
setTimeout(() => {
  document.getElementById('releaseLabel')!.classList.add('in');
  document.getElementById('releaseTitle')!.classList.add('in');
}, 100);
setTimeout(() => document.getElementById('releaseMeta')!.classList.add('in'), 200);
setTimeout(() => document.getElementById('actions')!.classList.add('in'), 300);

// Start shader resolve after a beat
setTimeout(() => requestAnimationFrame(resolveShader), 400);

// Cursor reactivity: warp the shader with cursor position
coverPanel.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = coverPanel.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;  // 0–1
  const y = (e.clientY - rect.top) / rect.height;   // 0–1
  // Drive subtle offset from center
  const offsetX = (x - 0.5) * 0.12;
  const offsetY = (y - 0.5) * 0.12;
  mount.setUniforms({ u_offsetX: offsetX, u_offsetY: offsetY });
});

coverPanel.addEventListener('mouseleave', () => {
  mount.setUniforms({ u_offsetX: 0, u_offsetY: 0 });
});
