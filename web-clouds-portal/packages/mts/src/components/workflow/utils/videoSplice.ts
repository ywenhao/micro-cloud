import type { SplicePresetModel } from '@vcp/apis/mts'

// 过滤参数
export function filterState(formState: SplicePresetModel) {
  const video_paths = formState.video_paths?.filter(Boolean)
  const state = { ...formState, video_paths }
  return state
}

export function initBackState(formState: SplicePresetModel) {
  const state = { ...formState }
  for (const key in state) {
    if (key === 'name') continue
    // @ts-ignore
    if (!Array.isArray(state[key]) && state[key] === 0) {
      // @ts-ignore
      state[key] = undefined
    }
  }
  const paths = state.video_paths || []
  if (!paths.filter(Boolean).length) {
    state.video_paths = ['']
  }
  return state
}

// 初始化拼接参数
export const initState = (): SplicePresetModel => ({
  format: 1,
  audio: 1,
  splice_location: 1,
  black_border: 2,
  video_paths: ['']
})
