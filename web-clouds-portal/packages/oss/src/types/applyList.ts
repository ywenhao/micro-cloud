import type { CommonReturn, CommonReturnListItem } from '@vcp/apis/src/_utils'

export interface DataView {
  label: string
  key: string
  des: string
  num: number
}

export type ApplyListItem = CommonReturnListItem<'/v1/ssl/obtains', 'get'>

export type LicenseInfo = CommonReturn<'/v1/ssl/obtains', 'post'> & {
  id_list?: string[]
}

export type ApplyCommand = 'apply' | 'verify' | 'renew'
