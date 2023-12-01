/**
 * @description: 区域RegionResolvService
 */

import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/** 获取dns区域列表 */
export const getCdnResolvRegionsListApi: CommonAPI<
  '/v1/cdn/resolv/regions',
  'get'
> = params => defHttp.get(`/v1/cdn/resolv/regions`, { params })

/** 创建dns区域 */
export const addCdnResolvRegionsApi: CommonAPI<
  '/v1/cdn/resolv/regions',
  'post'
> = data => defHttp.post(`/v1/cdn/resolv/regions`, { data })

/** 获取所有的dns区域列表和绑定节点数量 */
export const getCdnResolvRegionsNodesListApi: CommonAPI<
  '/v1/cdn/resolv/regions-nodes',
  'get'
> = params => defHttp.get(`/v1/cdn/resolv/regions-nodes`, { params })

/** 获取dns区域详情 */
export const getCdnResolvRegionsDetailByIdApi: CommonAPI<
  '/v1/cdn/resolv/regions/{id}',
  'get'
> = params => defHttp.get(`/v1/cdn/resolv/regions/${params.id}`, { params })

/** 删除dns区域 */
export const deleteCdnResolvRegionsByIdApi: CommonAPI<
  '/v1/cdn/resolv/regions/{id}',
  'delete'
> = data => defHttp.delete(`/v1/cdn/resolv/regions/${data.id}`, { data })

/** 更新dns区域 */
export const updateCdnResolvRegionsByIdApi: CommonAPI<
  '/v1/cdn/resolv/regions/{id}',
  'put'
> = data => defHttp.put(`/v1/cdn/resolv/regions/${data.id}`, { data })

/** 获取某个dns区域绑定节点数量 */
export const getCdnResolvRegionsNodesByIdApi: CommonAPI<
  '/v1/cdn/resolv/regions/{id}/nodes',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/resolv/regions/${params.id}/nodes`, { params })
