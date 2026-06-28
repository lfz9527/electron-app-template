import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@common': resolve('src/common')
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@common': resolve('src/common')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@renderer': resolve('src/renderer/src'),
        '@common': resolve('src/common'),
        '@types': resolve('src/types')
      }
    },
    plugins: [react()]
  }
})
