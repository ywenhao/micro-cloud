import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type OverviewResource = CommonReturn<'/v1/overview/resource', 'get'>

export type AlarmModel = CommonReturnListItem<'/v1/alarm', 'get'>
