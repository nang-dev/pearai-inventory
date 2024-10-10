const esbuild = require('esbuild');
const path = require('path');

// Common options
const commonOptions = {
  bundle: true,
  external: ['vscode'],
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
};

// Build extension
esbuild.build({
  ...commonOptions,
  entryPoints: ['./extension.ts'],
  outfile: 'out/extension.js',
  format: 'cjs',
  platform: 'node',
  target: ['node14'],
}).then(() => console.log('Extension build complete'))
  .catch(() => process.exit(1));

// Build webview
esbuild.build({
  ...commonOptions,
  entryPoints: ['./gui/src/pages/Inventory.tsx'],
  outfile: 'out/Inventory.js',
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  loader: {
    '.tsx': 'tsx',
    '.json': 'json'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  plugins: [
  ],
}).then(() => console.log('Webview build complete'))
  .catch(() => process.exit(1));