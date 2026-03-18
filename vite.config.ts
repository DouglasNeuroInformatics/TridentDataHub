import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Update this base path to match your GitHub repository name
  // For https://username.github.io/TridentDataHub/, use '/TridentDataHub/'
  // For https://username.github.io/, use '/'
  base: '/TridentDataHub/',
  plugins: [react()],
})
