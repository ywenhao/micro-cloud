import type { BuildOptions } from 'vite'

export const basicBuild = (outDir: string): BuildOptions => ({
  outDir,
  minify: 'terser',
  terserOptions: {
    compress: { drop_console: true, drop_debugger: true },
    format: { comments: false }
  },
  chunkSizeWarningLimit: 500,
  rollupOptions: {
    output: {
      chunkFileNames: 'static/js/[name]-[hash].js',
      entryFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      manualChunks: {
        vue: ['vue'],
        'lodash-es': ['lodash-es'],
        'vc-material': ['vc-material']
      }
    }
  }
})
