import { type CommonAPI, defHttp } from '..'

/**
 * @description: 工作流
 */

/** 查询工作流 */
export const getMtsWorkflowApi: CommonAPI<'/v1/mts/workflow', 'get'> = params =>
  defHttp.get(`/v1/mts/workflow`, { params })

/** 删除工作流 */
export const deleteMtsWorkflowApi: CommonAPI<
  '/v1/mts/workflow',
  'delete'
> = params => defHttp.delete(`/v1/mts/workflow`, { params })

/** 创建工作流 */
export const addMtsWorkflowApi: CommonAPI<'/v1/mts/workflow', 'post'> = data =>
  defHttp.post(`/v1/mts/workflow`, { data })

/** 修改工作流 */
export const updateMtsWorkflowApi: CommonAPI<
  '/v1/mts/workflow',
  'put'
> = data => defHttp.put(`/v1/mts/workflow`, { data })

/** 查询工作流详情 */
export const getMtsWorkflowInfoDetailApi: CommonAPI<
  '/v1/mts/workflow/info',
  'get'
> = params => defHttp.get(`/v1/mts/workflow/info`, { params })
