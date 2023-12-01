import { type CommonAPI, defHttp } from '..'

/**
 * @description: 队列
 */

/** 查询队列 */
export const getMtsQueueApi: CommonAPI<'/v1/mts/queue', 'get'> = params =>
  defHttp.get(`/v1/mts/queue`, { params })

/** 删除队列 */
export const deleteMtsQueueApi: CommonAPI<
  '/v1/mts/queue',
  'delete'
> = params => {
  return defHttp.delete(`/v1/mts/queue`, { params })
}

/** 创建队列 */
export const addMtsQueueApi: CommonAPI<'/v1/mts/queue', 'post'> = data =>
  defHttp.post(`/v1/mts/queue`, { data })

/** 修改队列 */
export const updateMtsQueueApi: CommonAPI<'/v1/mts/queue', 'put'> = data =>
  defHttp.put(`/v1/mts/queue`, { data })

/** 修改排序 */
export const updateMtsQueueIndexApi: CommonAPI<
  '/v1/mts/queue/index',
  'put'
> = data => defHttp.put(`/v1/mts/queue/index`, { data })

/** 查询队列详情 */
export const getMtsQueueInfoDetailApi: CommonAPI<
  '/v1/mts/queue/info',
  'get'
> = params => defHttp.get(`/v1/mts/queue/info`, { params })
