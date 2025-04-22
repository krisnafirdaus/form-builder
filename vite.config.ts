/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // Path to setup file
    // Add CSS Module handling for tests
    css: {
      modules: {
        classNameStrategy: 'non-scoped', // Use 'non-scoped' for tests
      },
    },
    exclude: [
      'src/types/**',
      'src/main.tsx',
      'src/main.test.tsx',
      'src/App.test.tsx',
    ],
    // Optional: Configure coverage
    coverage: {
      exclude: [
        'src/types/**',
        'src/main.tsx',
        'src/main.test.tsx',
        'src/App.tsx',
        'src/App.test.tsx',
        'src/vite-env.d.ts',
        'src/setupTests.ts',
        '../vite.config.ts',
        '../eslint.config.js',
        'vite.config.ts',
        'eslint.config.js',
        '**/__mocks__/**',
      ],
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
    }
    // }
  },
});
