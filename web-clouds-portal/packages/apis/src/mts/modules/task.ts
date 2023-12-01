import { type CommonAPI, defHttp } from '..'

/**
 * @description: 任务管理
 */

/** 任务列表 */
export const getMtsTaskListApi: CommonAPI<'/v1/mts/task', 'get'> = params =>
  defHttp.get(`/v1/mts/task`, { params })

/** 创建任务 */
export const addMtsTaskApi: CommonAPI<'/v1/mts/task', 'post'> = data =>
  defHttp.post(`/v1/mts/task`, { data })

/** 任务详情 */
export const getMtsTaskInfoDetailApi: CommonAPI<
  '/v1/mts/task/info',
  'get'
> = params => defHttp.get(`/v1/mts/task/info`, { params })

/** 重新提交任务 */
export const updateMtsTaskRetryApi: CommonAPI<
  '/v1/mts/task/retry',
  'put'
> = data => defHttp.put(`/v1/mts/task/retry`, { data })

/** 创建任务前验证权益 */
export const getMtsTaskVerifyApi = () =>
  defHttp.get(`/v1/mts/task/verify`, {}, { isTransformResponse: false })
