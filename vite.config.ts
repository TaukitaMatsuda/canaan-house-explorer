import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/canaan-house-explorer/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
