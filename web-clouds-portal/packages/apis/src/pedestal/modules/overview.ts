/**
 * @description: 概览
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 首页资源概览 */
export const getOverviewResourceApi: CommonAPI<
  '/v1/overview/resource',
  'get'
> = params => defHttp.get(`/v1/overview/resource`, { params })

/**获取告警 */
export const getAlarmApi: CommonAPI<'/v1/alarm', 'get'> = params =>
  defHttp.get(`/v1/alarm`, { params })
