/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  // ฝังโลโก้ลงในไฟล์ JS เพื่อให้แอปเปิดได้จากไฟล์เดียว
  build: { assetsInlineLimit: 90_000 },
  test: { environment: 'node' },
})
