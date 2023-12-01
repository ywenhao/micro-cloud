import { type CommonAPI, defHttp } from '..'

/**dns域名信息 */
export const domainInfoApi: CommonAPI<'/v1/dns/domain', 'get'> = params =>
  defHttp.get('/v1/dns/domain', { params })

/**删除dns域名 */
export const domainDeleteApi: CommonAPI<'/v1/dns/domain', 'delete'> = data =>
  defHttp.delete('/v1/dns/domain', { data })

/**添加dns域名 */
export const domainAddApi: CommonAPI<'/v1/dns/domain', 'post'> = data =>
  defHttp.post('/v1/dns/domain', { data })

/**修改dns域名 */
export const domainEditApi: CommonAPI<'/v1/dns/domain', 'put'> = data =>
  defHttp.put('/v1/dns/domain', { data })

/**dns域名列表 */
export const domainListApi: CommonAPI<'/v1/dns/domains', 'get'> = params =>
  defHttp.get('/v1/dns/domains', { params })

/**验证DNS域名NS状态 */
export const domainValidateNsApi: CommonAPI<
  '/v1/dns/domain/validate_ns',
  'post'
> = data => defHttp.post('/v1/dns/domain/validate_ns', { data })

/**添加多个DNS域名 同时还可以添加@和www的A记录 */
export const domainNsAddApi: CommonAPI<'/v1/dns/domains', 'post'> = data =>
  defHttp.post('/v1/dns/domains', { data })

/**删除域名 */
export const domainDeleteBatchApi: CommonAPI<'/v1/domains', 'delete'> = data =>
  defHttp.delete('/v1/domains', { data })

/**新增空间域名 */
export const domainAddSpaceApi: CommonAPI<'/v1/domains', 'post'> = data =>
  defHttp.post('/v1/domains', { data })

/**修改ssl */
export const domainEditSslApi: CommonAPI<'/v1/domains', 'put'> = data =>
  defHttp.put('/v1/domains', { data })

/**在空间下获取域名 */
export const domainListSpaceApi: CommonAPI<'/v1/domains', 'get'> = params =>
  defHttp.get('/v1/domains', { params })
