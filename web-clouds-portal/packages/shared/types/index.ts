import type { Ref } from 'vue'

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Array<any> ? DeepReadonly<T[K]> : T[K]
}

export type NoReadonly<T> = {
  -readonly [K in keyof T]: T[K] extends ReadonlyArray<any>
    ? NoReadonly<T[K]>
    : T[K]
}

export type RequiredUtils<T> = T extends undefined ? never : T

export type RefSource<T> = Ref<T> | (() => T)

export interface LabelValue {
  label: string
  value: string | number
}
