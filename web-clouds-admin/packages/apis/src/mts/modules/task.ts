import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/**
 * @description: 任务管理
 */

/** 任务列表 */
export const getMtsTaskListApi: CommonAPI<'/v1/mts/task', 'get'> = params =>
  defHttp.get(`/v1/mts/task`, { params })

/** 修改状态 */
export const updateMtsTaskApi: CommonAPI<'/v1/mts/task', 'put'> = data =>
  defHttp.put(`/v1/mts/task`, { data })

/** 获取等待执行的任务 节点获取任务使用 */
export const getMtsTaskExecApi: CommonAPI<
  '/v1/mts/task/exec',
  'get'
> = params => defHttp.get(`/v1/mts/task/exec`, { params })

/** 任务详情 */
export const getMtsTaskInfoDetailApi: CommonAPI<
  '/v1/mts/task/info',
  'get'
> = params => defHttp.get(`/v1/mts/task/info`, { params })

/** 任务期间块完成上报，任务期间流水线完成后输出上报 */
export const updateMtsTaskReportApi: CommonAPI<
  '/v1/mts/task/report',
  'put'
> = data => defHttp.put(`/v1/mts/task/report`, { data })

/** 重新提交任务 */
export const updateMtsTaskRetryApi: CommonAPI<
  '/v1/mts/task/retry',
  'put'
> = data => defHttp.put(`/v1/mts/task/retry`, { data })
