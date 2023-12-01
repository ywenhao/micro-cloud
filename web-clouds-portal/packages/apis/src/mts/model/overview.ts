import type { CommonReturn } from '..'

export type OverviewModel = CommonReturn<'/v1/mts/collect/dosage', 'get'>

export type DateItem = {
  data?: string
  low?: string
  general?: string
  sd?: string
  hd?: string
  two_k?: string
  four_k?: string
}
