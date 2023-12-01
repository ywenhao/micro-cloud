import type { FieldRule } from '@arco-design/web-vue'

export {}

declare global {
  export type Rules = Record<string, FieldRule[]>

  export type String2Number<T> = T extends `${infer N extends number}` ? N : T

  export type String2NumberByObject<T> = T extends Record<string, any>
    ? {
        [K in keyof T]: String2NumberByObject<T[K]>
      }
    : String2Number<T>
}
