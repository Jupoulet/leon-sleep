import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base = nom du repo GitHub Pages (https://<user>.github.io/leon-sleep/)
// En dev (npm run dev) la base est ignorée.
export default defineConfig({
  plugins: [react()],
  base: '/leon-sleep/',
})
