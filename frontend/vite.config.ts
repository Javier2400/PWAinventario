import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Inventario Microsip PWA',
        short_name: 'Microsip PWA',
        description: 'Aplicación de inventario con integración de Stripe',
        theme_color: '#004a99',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Stripe requirements: don't cache stripe API
        navigateFallbackDenylist: [/^\/payments/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.stripe\.com/,
            handler: 'NetworkOnly'
          },
          {
            urlPattern: /^https:\/\/js\.stripe\.com/,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
})
