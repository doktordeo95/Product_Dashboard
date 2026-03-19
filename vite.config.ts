
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base is repository name
export default defineConfig({
  base: '/Product_Dashboard/',
  plugins: [react()],
  build: { outDir: 'dist' }
})
