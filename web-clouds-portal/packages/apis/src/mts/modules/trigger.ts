import { type CommonAPI, defHttp } from '..'

/**
 * @description: 触发器
 */

/** 查询触发器 */
export const getMtsTriggerApi: CommonAPI<'/v1/mts/trigger', 'get'> = params =>
  defHttp.get(`/v1/mts/trigger`, { params })

/** 删除触发器 */
export const deleteMtsTriggerApi: CommonAPI<
  '/v1/mts/trigger',
  'delete'
> = params => defHttp.delete(`/v1/mts/trigger`, { params })

/** 创建触发器 */
export const addMtsTriggerApi: CommonAPI<'/v1/mts/trigger', 'post'> = data =>
  defHttp.post(`/v1/mts/trigger`, { data })

/** 查询触发器详情 */
export const getMtsTriggerInfoDetailApi: CommonAPI<
  '/v1/mts/trigger/info',
  'get'
> = params => defHttp.get(`/v1/mts/trigger/info`, { params })

/** 修改触发器状态 */
export const updateMtsTriggerStatusApi: CommonAPI<
  '/v1/mts/trigger/status',
  'put'
> = data => defHttp.put(`/v1/mts/trigger/status`, { data })
