import { join } from 'path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { normalizePath } from 'vite';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';

function generateManifest(): void {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(join(import.meta.dirname, 'node_modules/@ffmpeg/core/dist/esm/*')),
          dest: 'lib',
        },
      ],
    }),
    vue(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
    }),
  ],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
