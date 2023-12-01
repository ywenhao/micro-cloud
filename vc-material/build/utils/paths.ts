import { resolve } from 'path'

export const rootDir = resolve(__dirname, '../../')

// pkg根目录
export const pkgDir = resolve(rootDir, 'packages')

// 产物目录
export const outDir = resolve(rootDir, 'vc-material')

// 组件库根目录
export const componentDir = resolve(pkgDir, 'components')

// 工具目录
export const utilsDir = resolve(pkgDir, 'utils')

// hooks目录
export const hooksDir = resolve(pkgDir, 'hooks')

// 样式目录
export const themeChalkDir = resolve(pkgDir, 'theme-chalk')

// 入口文件
export const mainDir = resolve(pkgDir, 'main')
