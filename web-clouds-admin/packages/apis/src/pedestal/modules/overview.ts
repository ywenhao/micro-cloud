import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**
 * @description: 概览
 */

/** 首页资源概览 */
export const getOverviewResourceApi: CommonAPI<
  '/v1/overview/resource',
  'get'
> = params => defHttp.get(`/v1/overview/resource`, { params })
