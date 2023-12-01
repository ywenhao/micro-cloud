import { defHttp } from '../../http'
import type { CommonAPI } from '../../model/_utils'

export const spaceLinkDomainListApi: CommonAPI<'/v1/domains', 'get'> = params =>
  defHttp.get('/v1/domains', { params })
