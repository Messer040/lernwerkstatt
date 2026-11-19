import { defineConfig } from 'vitest/config';

// Build landet in ../neu, damit GitHub Pages es direkt vom main-Branch ausliefert.
export default defineConfig({
  base: './',
  build: { outDir: '../neu', emptyOutDir: true },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] },
});
