import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type SpaceBasicModel = CommonReturn<'/v1/buckets/base', 'get'>

export type fileListModel = CommonReturnListItem<'/v1/objects/list', 'get'> & {
  disabled?: boolean
}

export type LifeCycleModel = CommonReturnListItem<
  '/v1/buckets/lifecycle',
  'get'
>

export type EventListModel = CommonReturnListItem<
  '/v1/buckets/notification',
  'get'
>

export type CorsListModel = CommonReturnListItem<'/v1/buckets/cors', 'get'>

export interface IrefererList {
  value: string
  edit: boolean
  message?: string | undefined
  loading?: boolean
}

export type refererModel = CommonReturn<'/v1/buckets/referer', 'get'> & {
  refererList?: IrefererList[]
}

export type editReferModel = CommonReturn<'/v1/buckets/referer', 'put'>

export interface TagModel {
  id?: string | undefined
  val: string
  key: string
  edit?: boolean | undefined
  loading?: boolean | undefined
}
