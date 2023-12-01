type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Array<any> ? DeepReadonly<T[K]> : T[K]
}

type NoReadonly<T> = {
  -readonly [K in keyof T]: T[K] extends ReadonlyArray<any>
    ? NoReadonly<T[K]>
    : T[K]
}

type RequiredUtils<T> = T extends undefined ? never : T
