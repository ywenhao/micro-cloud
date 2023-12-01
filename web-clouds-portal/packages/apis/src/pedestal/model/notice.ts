import type { CommonReturnListItem } from '..'

export type NoticeAlertModel = CommonReturnListItem<
  '/v1/announcement/alert',
  'get'
>

export type NoticeModel = CommonReturnListItem<'/v1/announcement', 'get'>
