import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**获取区域管理列表 */
export const regionListApi: CommonAPI<'/v1/regions', 'get'> = params =>
  defHttp.get('/v1/regions', { params })

/**获取可选的区域域名 */
export const outDomainListApi: CommonAPI<'/v1/domains/dns', 'get'> = () =>
  defHttp.get('/v1/domains/dns')

/**添加区域 */
export const addRegionApi: CommonAPI<'/v1/regions', 'post'> = data =>
  defHttp.post('/v1/regions', { data })

/**修改区域 */
export const updateRegionApi: CommonAPI<'/v1/regions', 'put'> = data =>
  defHttp.put('/v1/regions', { data })

/**删除区域 */
export const regionDelApi: CommonAPI<'/v1/regions', 'delete'> = data =>
  defHttp.delete('/v1/regions', { data }, { joinParamsToUrl: true })
