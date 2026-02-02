import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';
import { addRenderIds } from './plugins/addRenderIds';
import { aliases } from './plugins/aliases';
import consoleToParent from './plugins/console-to-parent';
import { layoutWrapperPlugin } from './plugins/layouts';
import { loadFontsFromTailwindSource } from './plugins/loadFontsFromTailwindSource';
import { nextPublicProcessEnv } from './plugins/nextPublicProcessEnv';
import { restart } from './plugins/restart';
import { restartEnvFileChange } from './plugins/restartEnvFileChange';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Keep them available via import.meta.env.VITE_* and NEXT_PUBLIC_*
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  base: '/',
  build: {
    target: 'es2022',
  },
  optimizeDeps: {
    // Explicitly include fast-glob, since it gets dynamically imported and we
    // don't want that to cause a re-bundle.
    include: ['fast-glob', 'lucide-react'],
    exclude: [
      'fsevents',
      'lightningcss',
    ],
  },
  logLevel: 'info',
  plugins: [
    nextPublicProcessEnv(),
    restartEnvFileChange(),
    babel({
      include: ['src/**/*.{js,jsx,ts,tsx}'], // or RegExp: /src\/.*\.[tj]sx?$/
      exclude: /node_modules/, // skip everything else
      babelConfig: {
        babelrc: false, // don’t merge other Babel files
        configFile: false,
        plugins: ['styled-jsx/babel'],
      },
    }),
    restart({
      restart: [
        'src/**/page.jsx',
        'src/**/page.tsx',
        'src/**/layout.jsx',
        'src/**/layout.tsx',
        'src/**/route.js',
        'src/**/route.ts',
      ],
    }),
    consoleToParent(),
    loadFontsFromTailwindSource(),
    addRenderIds(),
    reactRouter(),
    tsconfigPaths(),
    aliases(),
    layoutWrapperPlugin(),
  ],
  resolve: {
    alias: {
      lodash: 'lodash-es',
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  clearScreen: false,
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 0,
    hmr: {
      overlay: false,
    },
    warmup: {
      clientFiles: ['./src/pages/**/*', './src/root.tsx', './src/routes.ts'],
    },
  },
});
