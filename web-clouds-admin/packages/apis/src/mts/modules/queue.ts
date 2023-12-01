import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/**
 * @description: 队列
 */

/** 查询队列 */
export const getMtsQueueApi: CommonAPI<'/v1/mts/queue', 'get'> = params =>
  defHttp.get(`/v1/mts/queue`, { params })

/** 删除队列 */
export const deleteMtsQueueApi: CommonAPI<'/v1/mts/queue', 'delete'> = params =>
  defHttp.delete(`/v1/mts/queue`, { params })

/** 修改队列 */
export const updateMtsQueueApi: CommonAPI<'/v1/mts/queue', 'put'> = data =>
  defHttp.put(`/v1/mts/queue`, { data })

/** 查询队列详情 */
export const getMtsQueueInfoDetailApi: CommonAPI<
  '/v1/mts/queue/info',
  'get'
> = params => defHttp.get(`/v1/mts/queue/info`, { params })
