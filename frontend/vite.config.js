import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ], optimizeDeps: {
    include: ["jwt-decode"]
  },
  server: {
    port: 3000,
  },

},
)


