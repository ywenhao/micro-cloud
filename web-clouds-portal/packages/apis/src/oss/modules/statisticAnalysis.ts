import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**统计分析存储量 */
export const storageApi: CommonAPI<
  '/v1/statistic/storage_trend',
  'post'
> = data => defHttp.post('/v1/statistic/storage_trend', { data })

/**统计分析上传文件数 */
export const uploadFileApi: CommonAPI<
  '/v1/statistic/upload_trend',
  'post'
> = data => defHttp.post('/v1/statistic/upload_trend', { data })

/**统计分析流出流量 */
export const putFlowApi: CommonAPI<
  '/v1/statistic/outflow_trend',
  'post'
> = data => defHttp.post('/v1/statistic/outflow_trend', { data })

/**统计分析流入流量 */
export const getFlowApi: CommonAPI<
  '/v1/statistic/inflow_trend',
  'post'
> = data => defHttp.post('/v1/statistic/inflow_trend', { data })

/**统计分析文件请求数 */
export const requestFileApi: CommonAPI<
  '/v1/statistic/obj_req_trend',
  'post'
> = data => defHttp.post('/v1/statistic/obj_req_trend', { data })

/** 获取概览的数据 */
export const ossOverviewApi: CommonAPI<
  '/v1/statistic/overview',
  'post'
> = data => defHttp.post('/v1/statistic/overview', { data })
