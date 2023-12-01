import type { ScreenshotPresetModel } from '@vcp/apis/mts'

// 过滤参数
export function filterState(formState: ScreenshotPresetModel) {
  const state = { ...formState }
  if (state.screenshot === 1) {
    Reflect.deleteProperty(state, 'time_interval')
    Reflect.deleteProperty(state, 'time_end')
  }
  return state
}

// 回显处理
export function initBackState<T extends Record<string, any>>(value: T) {
  const state = { ...value }
  for (const key in state) {
    if (key === 'name') continue
    if (!Array.isArray(state[key]) && state[key] === 0) {
      // @ts-ignore
      state[key] = undefined
    }
  }
  return state
}

// 初始化截图参数
export const initState = (): ScreenshotPresetModel => ({
  screenshot: 1,
  screenshot_image: 1,
  time_interval: 5
})
