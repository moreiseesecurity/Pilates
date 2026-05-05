import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Madhuri Pilates',
        short_name: 'Pilates',
        description: 'Personal Pilates workout tracker',
        theme_color: '#f9f5f2',
        background_color: '#f9f5f2',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    allowedHosts: [
      '.ngrok-free.dev', 
      '.ngrok-free.app',
      'spearhead-abrasion-corroding.ngrok-free.dev'
    ],
    headers: {
      'Ngrok-Skip-Browser-Warning': '69420' 
    }
  }
})