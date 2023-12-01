export interface RespMeta {
  offset: number
  limit: number
  total: number
}

export interface BaseListResp<T = any> {
  list: T
  meta: RespMeta
}
