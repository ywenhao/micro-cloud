/**
 * @description: 端口管理
 */

import { defHttp } from '../../http'
import type { CommonAPI } from '..'
/**
 * @description: 端口管理
 */

/** 获取端口范围列表 */
export const getCdnPortsListApi: CommonAPI<'/v1/cdn/ports', 'get'> = params =>
  defHttp.get(`/v1/cdn/ports`, { params })

/** 添加端口范围 */
export const addCdnPortsApi: CommonAPI<'/v1/cdn/ports', 'post'> = data =>
  defHttp.post(`/v1/cdn/ports`, { data })

/** 删除端口范围 */
export const deleteCdnPortsByIdApi: CommonAPI<
  '/v1/cdn/ports/{id}',
  'delete'
> = data => defHttp.delete(`/v1/cdn/ports/${data.id}`, { data })

/** 修改端口范围列表,协议类型不支持修改 */
export const updateCdnPortsListByIdApi: CommonAPI<
  '/v1/cdn/ports/{id}',
  'put'
> = data => defHttp.put(`/v1/cdn/ports/${data.id}`, { data })

/** 查询已分配用户信息 */
export const getCdnPortsUsersByIdApi: CommonAPI<
  '/v1/cdn/ports/{id}/users',
  'get'
> = params => defHttp.get(`/v1/cdn/ports/${params.id}/users`, { params })

/** 修改已分配用户 */
export const updateCdnPortsUsersByIdApi: CommonAPI<
  '/v1/cdn/ports/{id}/users',
  'put'
> = data => defHttp.put(`/v1/cdn/ports/${data.id}/users`, { data })

/** 查询用户已分配端口 */
export const getCdnPortsByIdApi: CommonAPI<
  '/v1/cdn/ports/{user_id}',
  'get'
> = params => defHttp.get(`/v1/cdn/ports/${params.user_id}`, { params })
