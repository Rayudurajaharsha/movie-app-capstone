import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      // FIX: Changed port from 5000 to 8080 to match the new server config
      '/reviews': 'http://localhost:8080',
      '/watchlist': 'http://localhost:8080',
    }
  }
})