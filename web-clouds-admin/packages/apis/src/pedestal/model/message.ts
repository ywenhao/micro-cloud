import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type MessageModel = CommonReturn<'/v1/message/info', 'get'> & {
  release_type?: number
  release_time: number | undefined
}
export type MessageTypeModel = CommonReturnListItem<
  '/v1/message/type',
  'get'
> & {
  key: string
}
