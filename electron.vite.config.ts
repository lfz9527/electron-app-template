import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: true
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@share': resolve('src/share')
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@share': resolve('src/share')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@renderer': resolve('src/renderer/src'),
        '@share': resolve('src/share'),
        '@types': resolve('src/types')
      }
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom']
          }
        }
      }
    },
    plugins: [react()]
  }
})
