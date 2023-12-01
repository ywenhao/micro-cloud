import type { MicroAppData } from '..'

/**
 * 获取micro-app的数据
 * @returns
 */
export function getMicroAppData() {
  const data = window.microApp.getData() || {}
  return data as MicroAppData
}
