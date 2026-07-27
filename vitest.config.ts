import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/types/**', 'src/data/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // RSC 경계 마커를 테스트 환경에서 no-op 처리 (레드팀 F-13 server-only 가드 대응)
      'server-only': path.resolve(__dirname, './src/test/empty-module.ts'),
      'client-only': path.resolve(__dirname, './src/test/empty-module.ts'),
    },
  },
});
