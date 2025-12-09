import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  onSuccess: async () => {
    // Copy CSS file to dist
    mkdirSync('dist', { recursive: true });
    copyFileSync('src/styles.css', 'dist/styles.css');
  },
});
