export interface RespMeta {
  offset?: number
  limit?: number
  total: number
}

export interface BaseListResp<T = any> {
  list: T
  total: string
}

export interface SpecialResp<T = any> {
  code: number
  data: T
  message: string
}
