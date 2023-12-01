import type { WatermarkPresetModel } from '@vcp/apis/mts'
import type { Ref } from 'vue'

// 过滤参数
export function filterState(
  formState: WatermarkPresetModel,
  time_line: Ref<boolean>
) {
  const state = { ...formState }
  const isImage = state.type === 1
  const hasTimeLine = time_line.value

  Object.keys(state).forEach(key => {
    if (isImage && key.startsWith('text')) {
      Reflect.deleteProperty(state, key)
    } else if (!isImage && key.startsWith('image')) {
      Reflect.deleteProperty(state, key)
    }
    if (!hasTimeLine && key.startsWith('time_line')) {
      Reflect.deleteProperty(state, key)
    }
  })
  if (hasTimeLine && state.time_line === 2) {
    Reflect.deleteProperty(state, 'time_start')
  }

  return state
}

// 回显处理
export function initBackState<T extends Record<string, any>>(
  value: T,
  time_line: Ref<boolean>
) {
  const state = { ...value }
  for (const key in state) {
    if (key === 'name') continue
    if (!Array.isArray(state[key]) && state[key] === 0) {
      // @ts-ignore
      state[key] = undefined
    }
  }
  const timeState = Object.keys(state).filter(key => key.startsWith('time'))
  time_line.value = !!timeState.length
  return state
}

// 初始化水印参数
export const initState = (): WatermarkPresetModel => ({
  type: 1,
  location: 3,
  preview_w: 1280,
  preview_h: 720,
  time_line: 1,
  text_font_color: '#000000',
  text_font_size: 30,
  text_font: 1
})
