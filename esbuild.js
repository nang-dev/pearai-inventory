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
  entryPoints: ['./src/extension.ts'],
  outfile: 'out/extension.js',
  format: 'cjs',
  platform: 'node',
  target: ['node14'],
}).then(() => console.log('Extension build complete'))
  .catch(() => process.exit(1));

// Build webview
esbuild.build({
  ...commonOptions,
  entryPoints: ['./src/inventory.tsx'],
  outfile: 'out/inventory.js',
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
    {
      name: 'resolve-vscode-webview-ui-toolkit',
      setup(build) {
        build.onResolve({ filter: /@vscode\/webview-ui-toolkit/ }, args => {
          return { path: path.resolve('./node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js') };
        });
      },
    },
  ],
}).then(() => console.log('Webview build complete'))
  .catch(() => process.exit(1));