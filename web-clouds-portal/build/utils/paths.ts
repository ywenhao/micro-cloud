import { resolve } from 'node:path'

export const rootDir = resolve(__dirname, '../../')
export const distDir = resolve(rootDir, 'dist')

export const outDir = {
  pedestal: resolve(distDir, 'pedestal'),
  dns: resolve(distDir, 'dns'),
  mts: resolve(distDir, 'mts'),
  cdn: resolve(distDir, 'cdn'),
  oss: resolve(distDir, 'oss'),
  ssl: resolve(distDir, 'ssl')
}

export const pedestalDir = resolve(rootDir, 'packages/pedestal')
