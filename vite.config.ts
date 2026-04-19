import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'og-image.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'ARENA Performance',
        short_name: 'ARENA',
        description: 'Elit Voleybol & Performans Sistemi',
        theme_color: '#050505',
        background_color: '#FAF6F1',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'offline.html',
        navigateFallbackDenylist: [/^\/api/],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'image-cache' }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router'
            if (id.includes('react-dom') || id.includes('scheduler')) return 'react-dom'
            if (/\/react\/|\/react$/.test(id)) return 'react-vendor'
            if (
              id.includes('framer-motion') ||
              id.includes('motion-dom') ||
              id.includes('motion-utils')
            )
              return 'framer'
            if (
              id.includes('@supabase') ||
              id.includes('iceberg-js') ||
              id.includes('/ws/') ||
              id.includes('whatwg-url') ||
              id.includes('tr46') ||
              id.includes('punycode')
            )
              return 'supabase'
            if (
              id.includes('recharts') ||
              id.includes('d3-') ||
              id.includes('react-smooth') ||
              id.includes('react-transition-group') ||
              id.includes('fast-equals') ||
              id.includes('/lodash/') ||
              id.includes('/lodash.') ||
              id.includes('decimal.js') ||
              id.includes('victory-vendor') ||
              id.includes('/eventemitter3')
            )
              return 'charts'
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) return 'forms'
            if (id.includes('zustand')) return 'state'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('date-fns')) return 'date-fns'
            if (id.includes('lenis')) return 'scroll'
            if (id.includes('html-to-image') || id.includes('html2canvas')) return 'image-export'
            if (id.includes('canvas-confetti')) return 'confetti'
            if (
              id.includes('react-to-pdf') ||
              id.includes('jspdf') ||
              id.includes('dompurify') ||
              id.includes('canvg') ||
              id.includes('fflate') ||
              id.includes('fast-png')
            )
              return 'pdf-export'
            if (id.includes('@emailjs')) return 'email'
            return 'vendor'
          }
          // TR and EN baked into index (needed synchronously at first paint).
          // Other locales are dynamic imports — Vite emits one chunk per file.
          if (/\/src\/locales\/(tr|en)\.ts$/.test(id)) return 'i18n-base'
          // Each admin page gets its own chunk so only the active route loads.
          // Layout (shell) and shared /components/admin/ stay in `admin`.
          if (id.includes('/src/pages/admin/')) {
            const m = id.match(/\/src\/pages\/admin\/([A-Za-z0-9_-]+)\.tsx?$/)
            const page = m?.[1]
            if (page && page !== 'Layout') return `admin-${page.toLowerCase()}`
            return 'admin'
          }
          if (id.includes('/src/components/admin/')) return 'admin'
          // Portal shell (Portal.tsx / PortalV2.tsx / StudentLogin) stays in `portal`;
          // individual /components/portal/* components are chunked per dynamic
          // import by Rollup so off-tab payloads don't bloat first-load.
          if (/\/src\/pages\/Portal(V2)?\.tsx$/.test(id) || id.includes('/src/pages/portal/')) return 'portal'
          return undefined
        },
      },
    },
    cssMinify: true,
    reportCompressedSize: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})