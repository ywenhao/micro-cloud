/**
 * @description: 操作日志
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 查询操作日志列表 */
export const getOperationLogsListApi: CommonAPI<
  '/v1/operation_logs',
  'get'
> = params => defHttp.get(`/v1/operation_logs`, { params })
