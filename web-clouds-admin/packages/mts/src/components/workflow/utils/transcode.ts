import type { VideoPresetModel } from '@vca/apis/mts'

// 过滤参数
export function filterState(formState: VideoPresetModel, btnActive: string[]) {
  const state = { ...formState }
  const noAudio = !btnActive.includes('音频参数')
  const noCaptions = !btnActive.includes('字幕参数')
  if (noAudio || noCaptions) {
    Object.keys(state).forEach(key => {
      const isAudio = noAudio && key.startsWith('audio')
      const isCaptions = noCaptions && key.startsWith('subtitle')
      if (isAudio || isCaptions) Reflect.deleteProperty(state, key)
    })
  }
  // hls 才有 分段时长
  if (+formState.format! !== 3) Reflect.deleteProperty(state, 'segment_time')
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

export const initState = (): VideoPresetModel => ({
  format: 1,
  encoding_format: 1
})
