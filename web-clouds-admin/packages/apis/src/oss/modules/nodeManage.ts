import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**节点统计信息 */
export const nodeStatistic: CommonAPI<'/v1/nodes/statistic', 'get'> = () =>
  defHttp.get('/v1/nodes/statistic')

/**节点列表 */
export const nodeListApi: CommonAPI<'/v1/nodes', 'get'> = params =>
  defHttp.get('/v1/nodes', { params })
