import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**空间列表 */
export const spaceListApi: CommonAPI<'/v1/buckets/list', 'get'> = params =>
  defHttp.get('/v1/buckets/list', { params })

/**创建空间 */
export const createSpaceApi: CommonAPI<'/v1/buckets', 'post'> = data =>
  defHttp.post('/v1/buckets', { data })

/**空间详情 */
export const spaceDetailApi: CommonAPI<'/v1/buckets/info', 'get'> = params =>
  defHttp.get('/v1/buckets/info', { params })

/**空间基础信息 */
export const spaceBasicApi: CommonAPI<'/v1/buckets/base', 'get'> = params =>
  defHttp.get('/v1/buckets/base', { params })

/**空间概览 */
export const spaceViewApi: CommonAPI<
  '/v1/statistic/bucket/overview',
  'post'
> = data => defHttp.post('/v1/statistic/bucket/overview', { data })

/**空间下获取域名 */
export const spaceDomainApi: CommonAPI<'/v1/domains/bucket', 'post'> = data =>
  defHttp.post('/v1/domains/bucket', { data })

/**设置默认域名 */
export const setDomainApi: CommonAPI<'/v1/domains/default', 'post'> = data =>
  defHttp.post('/v1/domains/default', { data })

/** 新增空间域名*/
export const addSpaceDomain: CommonAPI<'/v1/domains', 'post'> = data =>
  defHttp.post('/v1/domains', { data })

/**配置https */
export const settingHttpsApi: CommonAPI<'/v1/domains/ssl', 'put'> = data =>
  defHttp.put('/v1/domains/ssl', { data })

/**获取ssl 列表 */
export const spaceSslListApi: CommonAPI<'/v1/domains/ssl', 'post'> = data =>
  defHttp.post('/v1/domains/ssl', { data })

/** 修改备注 */
export const updateSpaceRemark: CommonAPI<'/v1/buckets/remark', 'put'> = data =>
  defHttp.put('/v1/buckets/remark', { data })

//** 获取空间管理头部信息 */
export const spaceSummaryApi: CommonAPI<
  '/v1/statistic/bucket_used_summary',
  'get'
> = params => defHttp.get('/v1/statistic/bucket_used_summary', { params })
