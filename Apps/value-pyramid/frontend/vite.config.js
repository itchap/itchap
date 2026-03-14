import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // This ensures assets (js/css) load from /app/pyramid/ instead of /
  base: '/app/pyramid/', 
  plugins: [react()],
})