import { resolve } from 'path'
import { defineConfig } from 'vite'
import { chromeExtension } from 'vite-plugin-chrome-extension'

export default defineConfig({
  server: { open: true },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: 'src/manifest.json'
    }
  },
  plugins: [chromeExtension()]
})
