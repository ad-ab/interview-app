import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Sass setup per Carbon v11 recommendations: https://github.com/carbon-design-system/carbon/blob/main/packages/styles/docs/sass.md#configuration
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: ['node_modules'],
        quietDeps: true,
        silenceDeprecations: [
          'global-builtin',
          'import',
          'slash-div',
          'color-functions',
          'legacy-js-api',
        ],
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
