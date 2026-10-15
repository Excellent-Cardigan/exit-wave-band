import { ShaderMount, meshGradientFragmentShader } from '@paper-design/shaders';
import * as THREE from 'three';

// === Background mesh gradient: iridescent chrome palette ===
const bgEl = document.getElementById('bgShader')!;
const bgMount = new ShaderMount(
  bgEl,
  meshGradientFragmentShader,
  {
    u_colors: [
      [0.023, 0.023, 0.031, 1],    // void
      [0.12, 0.10, 0.16, 1],       // dim violet
      [0.10, 0.14, 0.10, 1],       // dim forest
      [0.023, 0.023, 0.031, 1],    // void
      [0.14, 0.12, 0.18, 1],       // violet
    ] as [number,number,number,number][],
    u_colorsCount: 5,
    u_distortion: 0.5,
    u_swirl: 0.3,
    u_grainMixer: 0.15,
    u_grainOverlay: 0.08,
  },
  undefined,
  0.4
);

// === Three.js Mirrorball (BESPOKE_3D) ===
const canvas = document.getElementById('mirrorballCanvas') as HTMLCanvasElement;
canvas.width = 420;
canvas.height = 420;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(420, 420);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 3.5);

// Ambient light (cold blue-white)
const ambient = new THREE.AmbientLight(0x404060, 0.4);
scene.add(ambient);

// Key light: lime tinted
const keyLight = new THREE.PointLight(0xC7FF1D, 3, 10);
keyLight.position.set(-2, 2, 3);
scene.add(keyLight);

// Fill light: cold chrome
const fillLight = new THREE.PointLight(0x8888CC, 2, 10);
fillLight.position.set(3, -1, 2);
scene.add(fillLight);

// Cursor-reactive point light
const cursorLight = new THREE.PointLight(0xCC88FF, 1.5, 8);
cursorLight.position.set(0, 0, 2);
scene.add(cursorLight);

// Mirrorball sphere: IcosahedronGeometry for faceted look
const geo = new THREE.IcosahedronGeometry(1, 6);
const mat = new THREE.MeshPhongMaterial({
  color: 0x888888,
  specular: 0xffffff,
  shininess: 180,
  wireframe: false,
  flatShading: true,       // Flat shading = mirrorball facets
});
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// Corroded overlay: second geometry with wireframe for texture
const wireGeo = new THREE.IcosahedronGeometry(1.002, 4);
const wireMat = new THREE.MeshBasicMaterial({
  color: 0x333333,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
});
const wireSphere = new THREE.Mesh(wireGeo, wireMat);
scene.add(wireSphere);

// Cursor tracking
let mouseX = 0, mouseY = 0;
let targetRotX = 0, targetRotY = 0;
let currentRotX = 0, currentRotY = 0;

document.addEventListener('mousemove', (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  const nx = (mouseX / window.innerWidth - 0.5);
  const ny = (mouseY / window.innerHeight - 0.5);

  // Cursor light follows mouse
  cursorLight.position.set(nx * 4, -ny * 4, 2.5);

  // Chrome smear responds to cursor
  const smearCenter = (mouseX / window.innerWidth * 100).toFixed(1);
  const smear = document.getElementById('chromeSmear')!;
  smear.style.setProperty('--smear-center', `${smearCenter}%`);
  smear.style.setProperty('--smear-peak', `${(parseFloat(smearCenter) + 5).toFixed(1)}%`);
  smear.style.setProperty('--smear-end', `${(parseFloat(smearCenter) + 12).toFixed(1)}%`);
  smear.style.top = `${30 + ny * 20}%`;

  // Tilt target for sphere rotation
  targetRotY = nx * 0.4;
  targetRotX = ny * 0.2;

  // Also drive bg shader offset from cursor
  bgMount.setUniforms({
    u_offsetX: nx * 0.08,
    u_offsetY: -ny * 0.08,
  });
});

// Animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  // Smooth cursor-driven tilt
  currentRotX += (targetRotX - currentRotX) * 0.04;
  currentRotY += (targetRotY - currentRotY) * 0.04;

  // Slow base rotation + cursor influence
  sphere.rotation.y = time * 0.25 + currentRotY;
  sphere.rotation.x = Math.sin(time * 0.15) * 0.08 + currentRotX;
  wireSphere.rotation.copy(sphere.rotation);

  // Pulse keyLight intensity slightly (tempo simulation)
  const beat = 0.5 + 0.5 * Math.sin(time * 6.28); // ~60bpm at time step 0.008
  keyLight.intensity = 2.5 + beat * 0.8;

  // Speed up bg shader during "beat" peaks
  bgMount.setUniforms({ u_distortion: 0.5 + beat * 0.12 });

  renderer.render(scene, camera);
}
animate();
