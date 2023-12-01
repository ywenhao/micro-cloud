import type { CommonReturn, CommonReturnListItem } from '..'

export type MessageSysTypeModel = CommonReturnListItem<
  '/v1/message/type',
  'get'
>

export type MessageSysModel = CommonReturn<'/v1/message/info', 'get'>
