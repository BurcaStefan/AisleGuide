import { defineConfig } from 'vite';

console.log('Vite config loaded!');

export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
  },
});
