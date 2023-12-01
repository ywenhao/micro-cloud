export type Method =
  | 'get'
  | 'post'
  | 'delete'
  | 'put'
  | 'patch'
  | 'head'
  | 'options'

export type PathWrapper<
  Paths,
  Keys extends keyof Paths = keyof Paths,
  M extends Method = Method
> = {
  [K in Keys]: {
    url: K
    method: keyof Paths[K] & M
    op: Paths[K][keyof Paths[K] & M]
  }
}

export type Path<
  Paths,
  URL extends keyof Paths,
  M extends Method = Method
> = Pick<PathWrapper<Paths, URL, M>, URL>[URL]

export type ApiParameter<
  Paths,
  URL extends keyof Paths,
  M extends Method = Method
> = Path<Paths, URL, M>['op'] extends {
  parameters?: {
    query?: infer Q
    body?: infer B
    path?: infer P
    formData?: infer F
  }
  requestBody?: {
    content: {
      'application/json': infer RB
    }
  }
}
  ? P & Q & (B extends Record<string, unknown> ? B[keyof B] : unknown) & F & RB
  : Record<string, any> | void

export type ApiReturn<
  Paths,
  URL extends keyof Paths,
  M extends Method = Method,
  STATE extends number = 200
> = Path<Paths, URL, M>['op'] extends {
  responses: infer R
}
  ? {
      [RK in keyof R]: R[RK] extends { schema?: infer S }
        ? S
        : R[RK] extends { content: { 'application/json': infer C } }
        ? C
        : RK extends 'default'
        ? R[RK]
        : unknown
    }[keyof R & STATE]
  : never

export type API<
  Paths,
  URL extends keyof Paths,
  M extends Method = Method,
  STATE extends number = 200
> = (
  params: ApiParameter<Paths, URL, M>,
  ...args: any
) => Promise<ApiReturn<Paths, URL, M, STATE>>

export type PromiseFn = (...args: any) => Promise<any>
