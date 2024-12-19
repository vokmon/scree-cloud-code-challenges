import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import { loadEnvFile } from 'process';
import path from 'path';
import { configDefaults } from 'vitest/config';

const envFile = '.env.test';
loadEnvFile(path.resolve(__dirname, envFile));

export default defineConfig({
  test: {
    globals: true,
    root: './',
    env: loadEnv('test', envFile, ''),
    environment: 'node',
    include: ['**/*.spec.ts'],
    alias: {
      '@src': path.resolve(__dirname, '../../../src'),
      '@test': path.resolve(__dirname, '../../'),
    },
    coverage: {
      provider: 'v8',
      exclude: [
        ...(configDefaults.coverage.exclude || []),
        '**/*.module.ts',
        '**/main.ts',
        '**/prisma/seed',
        '**/*.dto.ts',
        '**/src/datasource', // exclude datasource as unit tests wll always use mock data
      ],
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '../../../src'),
    },
  },

  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'nodenext' },
    }),
  ],
});
