import delPath from './utils/delpath'
import { series, parallel } from 'gulp'
import {
  componentDir,
  hooksDir,
  mainDir,
  rootDir,
  themeChalkDir,
  utilsDir
} from './utils/paths'
import run from './utils/run'

// 删除vc-material
export const removeDist = () => delPath(`${rootDir}/vc-material`)

// 打包样式
export const buildLess = () => run('pnpm run build', themeChalkDir)

//打包Hooks
export const buildHooks = () => run('pnpm run build', hooksDir)

//打包Utils
export const buildUtils = () => run('pnpm run build', utilsDir)

//打包组件
export const buildComponent = () => run('pnpm run build', componentDir)

// 打包入口文件
export const buildMain = () => run('pnpm run copy', mainDir)

export default series(
  () => removeDist(),
  parallel(
    () => buildHooks(),
    () => buildUtils(),
    () => buildLess(),
    () => buildComponent(),
    () => buildMain()
  )
)
