import type { CommonReturn, CommonReturnListItem } from '@vca/apis/src/_utils'

export interface DataView {
  label: string
  key: string
  des: string
  num: number
}

export type ApplyListItem = CommonReturnListItem<'/v1/ssl/obtains', 'get'>

export type LicenseInfo = CommonReturn<'/v1/ssl/obtains', 'post'> & {
  id_list?: string[]
  user_id?: string
}

export type ApplyCommand = 'apply' | 'verify' | 'renew'
