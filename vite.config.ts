import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  define: {
    // Define global variables available in the client runtime
    'import.meta.env.VITE_DEV': JSON.stringify(mode === 'development'),
    'import.meta.env.VITE_PROD': JSON.stringify(mode === 'production'),
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        rollupFormat: 'iife',
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tomato Expert',
        short_name: 'Tomato Expert',
        description: 'Advanced tomato plant disease detection and management app',
        theme_color: '#1f3c26',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    // Add this to generate revision info
    inlineWorkboxRuntime: true 
  },
}));
