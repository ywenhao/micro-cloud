/**
 * @description: 站点解析 SiteResolveService
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 获取站点解析域名列表 */
export const getCdnResolvSiteResolvesListApi: CommonAPI<
  '/v1/cdn/resolv/site-resolves',
  'get'
> = params => defHttp.get(`/v1/cdn/resolv/site-resolves`, { params })

/** 添加站点解析域名 */
export const addCdnResolvSiteResolvesApi: CommonAPI<
  '/v1/cdn/resolv/site-resolves',
  'post'
> = data => defHttp.post(`/v1/cdn/resolv/site-resolves`, { data })

/** 删除站点解析域名 */
export const deleteCdnResolvSiteResolvesByIdApi: CommonAPI<
  '/v1/cdn/resolv/site-resolves/{id}',
  'delete'
> = data => defHttp.delete(`/v1/cdn/resolv/site-resolves/${data.id}`, { data })

/** 更新站点解析域名详情 */
export const updateCdnResolvSiteResolvesDetailByIdApi: CommonAPI<
  '/v1/cdn/resolv/site-resolves/{id}',
  'put'
> = data => defHttp.put(`/v1/cdn/resolv/site-resolves/${data.id}`, { data })

/** 获取站点解析域名 分配详情 */
export const getCdnResolvSiteResolvesBindingsDetailByIdApi: CommonAPI<
  '/v1/cdn/resolv/site-resolves/{id}/bindings',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/resolv/site-resolves/${params.id}/bindings`, { params })
