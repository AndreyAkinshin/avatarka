import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    entry: {
      index: 'src/index.ts',
      'styles.css': 'src/styles.css.ts',
    },
  },
  clean: true,
  sourcemap: true,
  external: ['react'],
  onSuccess: async () => {
    mkdirSync('dist', { recursive: true });
    copyFileSync('src/styles.css', 'dist/styles.css');
  },
});
