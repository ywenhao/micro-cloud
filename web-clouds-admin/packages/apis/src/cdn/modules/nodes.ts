/**
 * @description: 节点管理 NodeService
 */

import { defHttp } from '../../http'
import type { CommonAPI } from '..'
/**
 * @description: NodeService
 */

/** 校验主ip连通性 */
export const getCdnnodeNodeCheckMainIpApi: CommonAPI<
  '/v1/cdnnode/node/check-main-ip',
  'get'
> = params => defHttp.get(`/v1/cdnnode/node/check-main-ip`, { params })

/** 获取节点列表 */
export const getCdnnodeNodesListApi: CommonAPI<
  '/v1/cdnnode/nodes',
  'get'
> = params => defHttp.get(`/v1/cdnnode/nodes`, { params })

/** 节点控制 - 清理缓存(批量) */
export const postCdnnodeNodesClearCacheBatchApi: CommonAPI<
  '/v1/cdnnode/nodes/clear-cache',
  'post'
> = data => defHttp.post(`/v1/cdnnode/nodes/clear-cache`, { data })

/** 节点控制 - 强制同步(批量) */
export const postCdnnodeNodesForceSyncBatchApi: CommonAPI<
  '/v1/cdnnode/nodes/force-sync',
  'post'
> = data => defHttp.post(`/v1/cdnnode/nodes/force-sync`, { data })

/** 获取节点安装命令 */
export const getCdnnodeNodesInstallCommandApi: CommonAPI<
  '/v1/cdnnode/nodes/install-command',
  'get'
> = params => defHttp.get(`/v1/cdnnode/nodes/install-command`, { params })

/** 节点概览 */
export const getCdnnodeNodesOverviewApi: CommonAPI<
  '/v1/cdnnode/nodes/overview',
  'get'
> = params => defHttp.get(`/v1/cdnnode/nodes/overview`, { params })

/** 节点解析 移出节点解析 */
export const deleteCdnnodeNodesResolveApi: CommonAPI<
  '/v1/cdnnode/nodes/resolve',
  'delete'
> = data => defHttp.delete(`/v1/cdnnode/nodes/resolve`, { data })

/** 节点解析 添加节点解析 */
export const addCdnnodeNodesResolveApi: CommonAPI<
  '/v1/cdnnode/nodes/resolve',
  'post'
> = data => defHttp.post(`/v1/cdnnode/nodes/resolve`, { data })

/** 获取节点的解析状态 */
export const getCdnnodeNodesResolveStatusApi: CommonAPI<
  '/v1/cdnnode/nodes/resolve/status',
  'get'
> = params => defHttp.get(`/v1/cdnnode/nodes/resolve/status`, { params })

/** 节点控制 - 停止/启动/复位 (批量) */
export const postCdnnodeNodesStartStopBatchApi: CommonAPI<
  '/v1/cdnnode/nodes/start-stop',
  'post'
> = data => defHttp.post(`/v1/cdnnode/nodes/start-stop`, { data })

/** 节点控制 - 升级 */
export const postCdnnodeNodesUpgradeApi: CommonAPI<
  '/v1/cdnnode/nodes/upgrade',
  'post'
> = data => defHttp.post(`/v1/cdnnode/nodes/upgrade`, { data })

/** 删除节点 */
export const deleteCdnnodeNodesByIdApi: CommonAPI<
  '/v1/cdnnode/nodes/{node_id}',
  'delete'
> = data => defHttp.delete(`/v1/cdnnode/nodes/${data.node_id}`, { data })

/** 节点基础配置 - 查询 */
export const getCdnnodeNodesBasicConfigByIdApi: CommonAPI<
  '/v1/cdnnode/nodes/{node_id}/basic-config',
  'get'
> = params =>
  defHttp.get(`/v1/cdnnode/nodes/${params.node_id}/basic-config`, { params })

/** 节点基础配置 - 编辑 */
export const updateCdnnodeNodesBasicConfigByIdApi: CommonAPI<
  '/v1/cdnnode/nodes/{node_id}/basic-config',
  'put'
> = data =>
  defHttp.put(`/v1/cdnnode/nodes/${data.node_id}/basic-config`, { data })

/** 节点基础配置 - 重置 (恢复默认配置) */
export const getCdnnodeNodesBasicConfigResetByIdApi: CommonAPI<
  '/v1/cdnnode/nodes/{node_id}/basic-config/reset',
  'get'
> = params =>
  defHttp.get(`/v1/cdnnode/nodes/${params.node_id}/basic-config/reset`, {
    params
  })

/** 节点控制 - 查看错误日志 */
export const getCdnnodeNodesErrorLogsByIdApi: CommonAPI<
  '/v1/cdnnode/nodes/{node_id}/error-logs',
  'get'
> = params =>
  defHttp.get(`/v1/cdnnode/nodes/${params.node_id}/error-logs`, { params })

/** 服务开关配置 - 获取服务开关配置 */
export const getCdnnodeSystemServiceSwitchApi: CommonAPI<
  '/v1/cdnnode/system/service-switch',
  'get'
> = params => defHttp.get(`/v1/cdnnode/system/service-switch`, { params })

/** 服务开关配置 - 修改服务开关配置 */
export const updateCdnnodeSystemServiceSwitchApi: CommonAPI<
  '/v1/cdnnode/system/service-switch',
  'put'
> = data => defHttp.put(`/v1/cdnnode/system/service-switch`, { data })
