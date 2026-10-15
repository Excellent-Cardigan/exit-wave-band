import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'signal-lock': resolve(__dirname, 'signal-lock.html'),
        'dead-channel': resolve(__dirname, 'dead-channel.html'),
        'index-dir': resolve(__dirname, 'index-dir.html'),
        collective: resolve(__dirname, 'collective.html'),
        broadcast: resolve(__dirname, 'broadcast.html'),
        mirrorball: resolve(__dirname, 'mirrorball.html'),
      },
    },
  },
});
