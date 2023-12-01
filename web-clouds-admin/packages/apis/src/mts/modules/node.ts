import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/**
 * @description: 节点
 */

/** 查询节点 */
export const getMtsNodeApi: CommonAPI<'/v1/mts/node', 'get'> = params =>
  defHttp.get(`/v1/mts/node`, { params })

/** 删除节点 */
export const deleteMtsNodeApi: CommonAPI<'/v1/mts/node', 'delete'> = params =>
  defHttp.delete(`/v1/mts/node`, { params })

/** 上报节点 */
export const postMtsNodeApi: CommonAPI<'/v1/mts/node', 'post'> = data =>
  defHttp.post(`/v1/mts/node`, { data })

/** 修改节点 */
export const updateMtsNodeApi: CommonAPI<'/v1/mts/node', 'put'> = data =>
  defHttp.put(`/v1/mts/node`, { data })

/** 查询节点详情 */
export const getMtsNodeInfoDetailApi: CommonAPI<
  '/v1/mts/node/info',
  'get'
> = params => defHttp.get(`/v1/mts/node/info`, { params })

/** 升级节点 */
export const postMtsNodeUpgradeApi: CommonAPI<
  '/v1/mts/node/upgrade',
  'post'
> = data => defHttp.post(`/v1/mts/node/upgrade`, { data })

/** 生成脚本 */
export const postMtsCmdApi: CommonAPI<'/v1/mts/cmd', 'post'> = data =>
  defHttp.post(`/v1/mts/cmd`, { data })
