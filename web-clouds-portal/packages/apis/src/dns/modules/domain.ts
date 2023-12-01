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

/**获取单个域名分组信息 */
export const domainGroupInfoApi: CommonAPI<
  '/v1/dns/domain/group',
  'get'
> = params => defHttp.get('/v1/dns/domain/group', { params })

/**删除单个域名分组 */
export const domainGroupDeleteApi: CommonAPI<
  '/v1/dns/domain/group',
  'delete'
> = data => defHttp.delete('/v1/dns/domain/group', { data })

/**创建域名分组 */
export const domainGroupAddApi: CommonAPI<
  '/v1/dns/domain/group',
  'post'
> = data => defHttp.post('/v1/dns/domain/group', { data })

/**更新单个域名分组信息 */
export const domainGroupEditApi: CommonAPI<
  '/v1/dns/domain/group',
  'put'
> = data => defHttp.put('/v1/dns/domain/group', { data })

/**删除多个域名分组 */
export const domainGroupDeleteBatchApi: CommonAPI<
  '/v1/dns/domain/group/domains',
  'delete'
> = data => defHttp.delete('/v1/dns/domain/group/domains', { data })

/**将多个域名加入域名分组 */
export const domainGroupAddBatchApi: CommonAPI<
  '/v1/dns/domain/group/domains',
  'put'
> = data => defHttp.put('/v1/dns/domain/group/domains', { data })

/**获取域名分组列表 */
export const domainGroupListApi: CommonAPI<
  '/v1/dns/domain/groups',
  'get'
> = params => defHttp.get('/v1/dns/domain/groups', { params })

/**获取取回DNS域名需要设置的TXT记录 */
export const domainTxtApi: CommonAPI<
  '/v1/dns/domain/acquire/txt',
  'get'
> = params => defHttp.get('/v1/dns/domain/acquire/txt', { params })

/**验证DNS域名NS状态 */
export const domainValidateNsApi: CommonAPI<
  '/v1/dns/domain/validate_ns',
  'post'
> = data => defHttp.post('/v1/dns/domain/validate_ns', { data })

/**添加多个DNS域名 同时还可以添加@和www的A记录 */
export const domainNsAddApi: CommonAPI<'/v1/dns/domains', 'post'> = data =>
  defHttp.post('/v1/dns/domains', { data })

/**批量取回DNS域名 */
export const domainNsAcquireApi: CommonAPI<
  '/v1/dns/domains/acquire',
  'post'
> = data => defHttp.post('/v1/dns/domains/acquire', { data })

/**批量添加DNS域名 */
export const domainAddBatchApi: CommonAPI<
  '/v1/dns/domains/batch',
  'post'
> = data => defHttp.post('/v1/dns/domains/batch', { data })

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

/** 只更新单个域名分组的备注 */
export const updateDnsDomainGroupRemarkApi: CommonAPI<
  '/v1/dns/domain/group/remark',
  'put'
> = data => defHttp.put(`/v1/dns/domain/group/remark`, { data })
