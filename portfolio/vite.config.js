import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // 用戶頁面用根路徑
  build: {
    outDir: 'dist'
  }
})
