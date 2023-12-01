import type { Ref } from 'vue'

export {}

declare global {
  type RefSource<T> = Ref<T> | (() => T)
}
