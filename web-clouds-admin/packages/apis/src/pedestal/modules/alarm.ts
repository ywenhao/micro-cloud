/**
 * @description: 告警信息
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 获取告警 */
export const getAlarmApi: CommonAPI<'/v1/alarm', 'get'> = params =>
  defHttp.get(`/v1/alarm`, { params })
