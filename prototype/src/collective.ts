import { ShaderMount, ditheringFragmentShader } from '@paper-design/shaders';

const portraitShaderEl = document.getElementById('portraitShader')!;
const portraitArea = document.getElementById('portraitArea')!;
const memberNameEl = document.getElementById('memberName')!;
const memberRoleEl = document.getElementById('memberRole')!;
const memberBioEl = document.getElementById('memberBio')!;
const memberNumEl = document.getElementById('memberNum')!;
const portraitBgName = document.getElementById('portraitBgName')!;

const members = [
  { num: '001', name: 'PURITY', role: 'COMPOSER · PRODUCER · GUITAR', bio: '"The architect of the frequency. What you hear began here, in the dark, assembled from signal and silence."' },
  { num: '002', name: 'TOY', role: 'VOCALS', bio: '"The voice at the edge of transmission. Where the signal breaks, he begins."' },
  { num: '003', name: 'CALM', role: 'DRUMS', bio: '"The pulse beneath the wave. Steady, inevitable, the heartbeat of the transmission."' },
  { num: '004', name: 'AER', role: 'COMPOSER · MODULAR SYNTH', bio: '"What the machines say when no one is listening. AER translates."' },
  { num: '005', name: 'ZERO', role: 'BASS', bio: '"The ground beneath the signal. You feel ZERO before you hear anything else."' },
];

// Halftone-like dithering on portrait area — dots pattern, warm palette
// Starts with large pxSize (halftoned), resolves on hover
let mount = new ShaderMount(
  portraitShaderEl,
  ditheringFragmentShader,
  {
    u_colorBack: [0.23, 0.18, 0.10, 1] as [number, number, number, number],
    u_colorFront: [0.49, 0.36, 0.21, 1] as [number, number, number, number],
    u_shape: 3 as const, // dots
    u_type: 3 as const,  // 4×4 Bayer
    u_pxSize: 8.0,
  },
  undefined,
  0.3
);

// Hover: resolve halftone (pxSize decreases → portrait "appears")
let resolveRaf: number;
let currentPxSize = 8.0;
let targetPxSize = 8.0;

portraitArea.addEventListener('mouseenter', () => {
  targetPxSize = 2.0;
});
portraitArea.addEventListener('mouseleave', () => {
  targetPxSize = 8.0;
});

function animatePxSize() {
  currentPxSize += (targetPxSize - currentPxSize) * 0.06;
  mount.setUniforms({ u_pxSize: currentPxSize });
  resolveRaf = requestAnimationFrame(animatePxSize);
}
animatePxSize();

// Member switching
let activeIdx = 1;
const navItems = document.querySelectorAll<HTMLElement>('[data-idx]');

function switchMember(idx: number) {
  if (idx === activeIdx) return;
  activeIdx = idx;
  const m = members[idx];

  // Animate out
  memberNameEl.style.opacity = '0';
  memberNameEl.style.transform = 'translateY(8px)';

  setTimeout(() => {
    memberNumEl.textContent = m.num;
    memberNameEl.textContent = m.name;
    memberRoleEl.textContent = m.role;
    memberBioEl.textContent = m.bio;
    portraitBgName.textContent = m.name;
    memberNameEl.style.opacity = '1';
    memberNameEl.style.transform = 'translateY(0)';
  }, 200);

  // Pulse the shader on switch
  mount.setUniforms({ u_pxSize: 10 });
  setTimeout(() => { targetPxSize = 8.0; currentPxSize = 10; }, 50);

  // Update active state
  navItems.forEach((item) => {
    item.classList.toggle('active', parseInt(item.dataset['idx']!) === idx);
  });
}

memberNameEl.style.transition = 'opacity 0.2s, transform 0.2s';

navItems.forEach((item) => {
  item.addEventListener('click', () => switchMember(parseInt(item.dataset['idx']!)));
});

// Cursor moves on portrait area shift the shader offset slightly
portraitArea.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = portraitArea.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  mount.setUniforms({ u_offsetX: x * 0.08, u_offsetY: y * 0.08 });
});
