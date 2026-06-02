import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em dev local (sem Docker), redireciona /api e /ws para o backend
      '/api': 'http://localhost:7070',
      '/ws': {
        target: 'ws://localhost:7070',
        ws: true
      }
    }
  }
})
