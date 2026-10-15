import { ShaderMount, ditheringFragmentShader } from '@paper-design/shaders';

const bgEl = document.getElementById('bgShader')!;
const cursorEl = document.getElementById('cursor')!;
const ghostWordmark = document.getElementById('ghostWordmark')!;

// Full-bleed dithering: heavy warp static
let mouseX = 0, mouseY = 0;
let currentOffsetX = 0, currentOffsetY = 0;

const mount = new ShaderMount(
  bgEl,
  ditheringFragmentShader,
  {
    u_colorBack: [0.023, 0.031, 0.063, 1] as [number, number, number, number],
    u_colorFront: [0.56, 1.0, 0.43, 1] as [number, number, number, number],
    u_shape: 1 as const,  // simplex noise
    u_type: 1 as const,   // random dithering
    u_pxSize: 6.0,
  },
  undefined,
  0.7
);

// Custom cursor + field distortion
document.addEventListener('mousemove', (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Move cursor element
  cursorEl.style.left = `${mouseX}px`;
  cursorEl.style.top = `${mouseY}px`;

  // Drive shader offset from cursor (center = no offset)
  const cx = (mouseX / window.innerWidth - 0.5) * 0.22;
  const cy = (mouseY / window.innerHeight - 0.5) * 0.22;
  currentOffsetX += (cx - currentOffsetX) * 0.06;
  currentOffsetY += (cy - currentOffsetY) * 0.06;
});

// Animate shader offset smoothly
function animateShader() {
  mount.setUniforms({
    u_offsetX: currentOffsetX,
    u_offsetY: currentOffsetY,
  });
  requestAnimationFrame(animateShader);
}
animateShader();

// Scroll-reveal content
const reveals = document.querySelectorAll<HTMLElement>('.scroll-reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children
        const el = entry.target as HTMLElement;
        el.classList.add('visible');
        // Also increase shader pxSize briefly on scroll reveal (disturbance)
        mount.setUniforms({ u_pxSize: 8.5 });
        setTimeout(() => mount.setUniforms({ u_pxSize: 6.0 }), 600);
      }
    });
  },
  { threshold: 0.15 }
);
reveals.forEach((el) => observer.observe(el));

// Ghost wordmark: becomes slightly more visible when cursor near center
document.addEventListener('mousemove', (e: MouseEvent) => {
  const cx = e.clientX / window.innerWidth;
  const cy = e.clientY / window.innerHeight;
  const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2);
  const opacity = Math.max(0.02, 0.12 - dist * 0.2);
  ghostWordmark.style.color = `rgba(250,254,239,${opacity})`;
});

// Pulse pxSize occasionally for "broadcast glitch" effect
let lastGlitch = 0;
function glitchLoop(ts: number) {
  if (ts - lastGlitch > 3500 + Math.random() * 4000) {
    lastGlitch = ts;
    mount.setUniforms({ u_pxSize: 10 + Math.random() * 4 });
    setTimeout(() => mount.setUniforms({ u_pxSize: 6.0 }), 120 + Math.random() * 200);
  }
  requestAnimationFrame(glitchLoop);
}
requestAnimationFrame(glitchLoop);
