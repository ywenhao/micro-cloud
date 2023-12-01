/**
 * @description: 告警配置
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 获取告警配置 */
export const getAlarmConfigApi: CommonAPI<'/v1/alarm_config', 'get'> = params =>
  defHttp.get(`/v1/alarm_config`, { params })

/** 更新告警配置 */
export const updateAlarmConfigApi: CommonAPI<
  '/v1/alarm_config',
  'post'
> = data => defHttp.post(`/v1/alarm_config`, { data })
