/**
 * @description: 新手指南
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 查询新手指南 */
export const getGuideApi: CommonAPI<'/v1/guide', 'get'> = params =>
  defHttp.get(`/v1/guide`, { params })
