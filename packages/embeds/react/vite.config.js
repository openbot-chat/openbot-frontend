import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',
    process,
  }
})