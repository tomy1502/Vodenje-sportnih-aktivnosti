/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Allows global test APIs like "describe" and "it"
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './vitest.setup.ts', // Optional: for global setup like jest-dom
  },
});
