import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on the current mode (e.g., development or production)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // use env variable from .env file
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
