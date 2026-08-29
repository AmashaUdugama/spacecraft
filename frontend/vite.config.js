import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Must match your GitHub repo name exactly - GitHub Pages serves this
  // app from https://<username>.github.io/spacecraft/, not the domain root,
  // so all asset paths need this prefix or they'll 404.
  base: '/spacecraft/',
})