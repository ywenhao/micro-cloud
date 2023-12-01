import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

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

/** 查询工作流详情 */
export const getMtsWorkflowInfoDetailApi: CommonAPI<
  '/v1/mts/workflow/info',
  'get'
> = params => defHttp.get(`/v1/mts/workflow/info`, { params })
