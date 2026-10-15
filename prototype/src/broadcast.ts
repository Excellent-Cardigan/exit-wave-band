import { ShaderMount, meshGradientFragmentShader } from '@paper-design/shaders';

// Hero shader: void/purple atmospheric mesh gradient
const heroShaderEl = document.getElementById('heroShader')!;
const releaseShaderEl = document.getElementById('releaseShader')!;

// Hero — dark void with subtle violet/lime mesh
const heroMount = new ShaderMount(
  heroShaderEl,
  meshGradientFragmentShader,
  {
    u_colors: [
      [0.04, 0.04, 0.07, 1],   // void
      [0.08, 0.04, 0.12, 1],   // deep violet
      [0.06, 0.09, 0.04, 1],   // deep forest hint
      [0.04, 0.04, 0.07, 1],   // void again
    ] as [number,number,number,number][],
    u_colorsCount: 4,
    u_distortion: 0.35,
    u_swirl: 0.15,
    u_grainMixer: 0.08,
    u_grainOverlay: 0.06,
  },
  undefined,
  0.25
);

// Release section — forest/lime world
const releaseMount = new ShaderMount(
  releaseShaderEl,
  meshGradientFragmentShader,
  {
    u_colors: [
      [0.04, 0.10, 0.02, 1],   // deep forest
      [0.06, 0.14, 0.04, 1],   // forest
      [0.03, 0.07, 0.01, 1],   // deep
      [0.07, 0.16, 0.05, 1],   // forest bright
    ] as [number,number,number,number][],
    u_colorsCount: 4,
    u_distortion: 0.4,
    u_swirl: 0.2,
    u_grainMixer: 0.1,
    u_grainOverlay: 0.05,
  },
  undefined,
  0.3
);

// Scroll-driven: accelerate mesh gradient distortion on scroll + reveal content
const scrollReveal = document.querySelectorAll<HTMLElement>('.bc-reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);
scrollReveal.forEach((el) => observer.observe(el));

// Scroll-driven shader distortion
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollDelta = Math.abs(window.scrollY - lastScrollY);
  lastScrollY = window.scrollY;

  // Temporarily boost distortion on scroll motion
  const boost = Math.min(scrollDelta * 0.015, 0.4);
  heroMount.setUniforms({ u_distortion: 0.35 + boost, u_swirl: 0.15 + boost * 0.4 });
  releaseMount.setUniforms({ u_distortion: 0.4 + boost, u_swirl: 0.2 + boost * 0.3 });

  // Decay distortion back
  setTimeout(() => {
    heroMount.setUniforms({ u_distortion: 0.35, u_swirl: 0.15 });
    releaseMount.setUniforms({ u_distortion: 0.4, u_swirl: 0.2 });
  }, 400);
});
