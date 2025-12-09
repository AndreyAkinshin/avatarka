import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        'packages/*/src/**/__tests__/**',
        'packages/*/src/**/index.ts',
      ],
    },
  },
});


