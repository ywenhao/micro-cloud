import type { CommonReturn } from '../../_utils'

export type TaskModel = String2NumberByObject<
  CommonReturn<'/v1/mts/task/info', 'get'>
>
