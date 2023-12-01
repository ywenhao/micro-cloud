import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type CollectDosageModel = CommonReturn<'/v1/mts/collect/dosage', 'get'>

export type NodeTaskItem = CommonReturnListItem<'/v1/collect/node', 'get'>

export type TaskTime = CommonReturn<'/v1/mts/collect/task', 'get'>

export type TransCodeModel = CommonReturn<'/v1/mts/collect/duration', 'get'>

export type DateItem = {
  data?: string
  low?: string
  general?: string
  sd?: string
  hd?: string
  two_k?: string
  four_k?: string
}

export type ActiveUserModel = CommonReturnListItem<
  '/v1/mts/collect/user',
  'get'
>
