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

export const ports = {
  pedestal: 10010,
  dns: 10011,
  ssl: 10012,
  cdn: 10013,
  oss: 10014,
  mts: 10015
}

export const apisDir = resolve(rootDir, 'packages/apis')
export const envDir = resolve(rootDir, 'env')

export const pedestalDir = resolve(rootDir, 'packages/pedestal')
