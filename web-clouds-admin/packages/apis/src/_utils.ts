import type { paths } from '../schema/all'

export type CommonAPI<
  T extends keyof paths,
  M extends Method = Method,
  S extends number = 200
> = API<paths, T, M, S>

export type CommonParams<
  T extends keyof paths,
  M extends Method = Method
> = ApiParameter<paths, T, M>

export type CommonReturn<
  T extends keyof paths,
  M extends Method = Method,
  STATE extends number = 200
> = ApiReturn<paths, T, M, STATE>

export type CommonReturnListItem<
  T extends keyof paths,
  M extends Method = Method,
  K extends string = 'list',
  STATE extends number = 200
> = CommonReturn<T, M, STATE> extends { [Key in K]?: Array<infer R> }
  ? R
  : never
