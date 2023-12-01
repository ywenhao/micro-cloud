import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type WorkerOrder = CommonReturn<'/v1/workerorder', 'get'>

export type WorkerOrderMessage = CommonReturnListItem<
  '/v1/workerorderdetails/list',
  'get'
>

export type WorkerOrderType = CommonReturnListItem<
  '/v1/workerordertype/list',
  'get'
>

export type WorkerOrderFilterType = {
  name: string
  product_id: string
  sort: number
  id: string
}
