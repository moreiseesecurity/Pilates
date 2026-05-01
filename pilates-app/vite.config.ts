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
        theme_color: '#f9f5f2', // Matches the background we set in App.tsx
        background_color: '#f9f5f2',
        display: 'standalone', // THIS is what hides the Safari URL bar
        orientation: 'portrait',
        icons: [
          {
            src: 'https://placehold.co/192x192/a8b5a2/white?text=P',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'https://placehold.co/512x512/a8b5a2/white?text=Pilates',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
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