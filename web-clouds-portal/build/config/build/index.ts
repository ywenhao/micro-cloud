import type { BuildOptions } from 'vite'

export const basicBuild = (outDir: string): BuildOptions => ({
  outDir,
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_debugger: true,
      pure_funcs: [
        'console.log',
        'console.info',
        'console.table',
        'console.dir'
      ]
    },
    format: { comments: false }
  },
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
