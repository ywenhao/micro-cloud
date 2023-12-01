import type { InjectionKey } from 'vue'

export const SET_HEADER_RIGHT_COUNT = Symbol(
  'SET_HEADER_RIGHT_COUNT'
) as InjectionKey<() => Promise<void>>
