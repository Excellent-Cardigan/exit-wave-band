import { ShaderMount, ditheringFragmentShader } from '@paper-design/shaders';

// On row hover: mount a small shader as the row background (dots, lime palette)
const rows = document.querySelectorAll<HTMLElement>('.dir-row');
const mountMap = new Map<HTMLElement, ShaderMount>();

rows.forEach((row) => {
  let shaderEl: HTMLDivElement | null = null;
  let mount: ShaderMount | null = null;

  row.addEventListener('mouseenter', () => {
    if (!shaderEl) {
      shaderEl = document.createElement('div');
      shaderEl.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
      row.style.position = 'relative';
      row.prepend(shaderEl);

      mount = new ShaderMount(
        shaderEl,
        ditheringFragmentShader,
        {
          u_colorBack: [0.75, 1.0, 0.0, 1] as [number, number, number, number],
          u_colorFront: [0.04, 0.04, 0.06, 1] as [number, number, number, number],
          u_shape: 3 as const, // dots
          u_type: 2 as const,  // 2×2 Bayer
          u_pxSize: 3.5,
        },
        undefined,
        0.4
      );
      mountMap.set(row, mount);
    }
  });

  row.addEventListener('mouseleave', () => {
    if (mount && shaderEl) {
      mount.dispose();
      shaderEl.remove();
      shaderEl = null;
      mount = null;
      mountMap.delete(row);
    }
  });
});
