import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**空间外链域名 */
export const spaceLinkDomainListApi: CommonAPI<'/v1/domains', 'get'> = params =>
  defHttp.get('/v1/domains', { params })

/**删除域名 */
export const delLinkDomainApi: CommonAPI<'/v1/domains', 'delete'> = data =>
  defHttp.delete('/v1/domains', { data })
