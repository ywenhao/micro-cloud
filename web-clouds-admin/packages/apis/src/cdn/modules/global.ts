/**
 * @description: 全局配置
 */

import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/** 获取规则选项信息 */
export const getCdnGlobalBootstrapDetailApi: CommonAPI<
  '/v1/cdn/global/bootstrap',
  'get'
> = params => defHttp.get(`/v1/cdn/global/bootstrap`, { params })

/** 获取缓存规则列表 */
export const getCdnGlobalCacheRuleListApi: CommonAPI<
  '/v1/cdn/global/cache-rule',
  'get'
> = params => defHttp.get(`/v1/cdn/global/cache-rule`, { params })

/** 创建缓存规则 */
export const addCdnGlobalCacheRuleApi: CommonAPI<
  '/v1/cdn/global/cache-rule',
  'post'
> = data => defHttp.post(`/v1/cdn/global/cache-rule`, { data })

/** 获取缓存规则 */
export const getCdnGlobalCacheRuleByIdApi: CommonAPI<
  '/v1/cdn/global/cache-rule/{rule_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/global/cache-rule/${params.rule_id}`, { params })

/** 删除缓存规则 */
export const deleteCdnGlobalCacheRuleByIdApi: CommonAPI<
  '/v1/cdn/global/cache-rule/{rule_id}',
  'delete'
> = data =>
  defHttp.delete(`/v1/cdn/global/cache-rule/${data.rule_id}`, { data })

/** 修改缓存规则 */
export const updateCdnGlobalCacheRuleByIdApi: CommonAPI<
  '/v1/cdn/global/cache-rule/{rule_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/global/cache-rule/${data.rule_id}`, { data })

/** 获取压缩配置 */
export const getCdnGlobalCompressConfigApi: CommonAPI<
  '/v1/cdn/global/compress-config',
  'get'
> = params => defHttp.get(`/v1/cdn/global/compress-config`, { params })

/** 设置压缩配置 */
export const postCdnGlobalCompressConfigApi: CommonAPI<
  '/v1/cdn/global/compress-config',
  'post'
> = data => defHttp.post(`/v1/cdn/global/compress-config`, { data })

/** 获取WAF/DDos托管规则（预制规则） */
export const getCdnGlobalManagedRuleApi: CommonAPI<
  '/v1/cdn/global/managed-rule/{rule_type}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/global/managed-rule/${params.rule_type}`, { params })

/** 获取缓存配置 */
export const getCdnGlobalStorageConfigApi: CommonAPI<
  '/v1/cdn/global/storage-config',
  'get'
> = params => defHttp.get(`/v1/cdn/global/storage-config`, { params })

/** 设置缓存配置 */
export const postCdnGlobalStorageConfigApi: CommonAPI<
  '/v1/cdn/global/storage-config',
  'post'
> = data => defHttp.post(`/v1/cdn/global/storage-config`, { data })

/** 获取节点waf列表(节点WAF配置通用接口) */
export const getCdnGlobalWafNodeListApi: CommonAPI<
  '/v1/cdn/global/waf/node',
  'get'
> = params => defHttp.get(`/v1/cdn/global/waf/node`, { params })

/** 创建节点waf规则 */
export const addCdnGlobalWafNodeApi: CommonAPI<
  '/v1/cdn/global/waf/node',
  'post'
> = data => defHttp.post(`/v1/cdn/global/waf/node`, { data })

/** 批量部署（取消部署）节点waf规则 */
export const updateCdnGlobalWafNodeBatchByIdApi: CommonAPI<
  '/v1/cdn/global/waf/node/batch/{node_id}',
  'put'
> = data =>
  defHttp.put(`/v1/cdn/global/waf/node/batch/${data.node_id}`, { data })

/** 获取节点waf列表里面的部署节点 */
export const getCdnGlobalWafNodeInfoListApi: CommonAPI<
  '/v1/cdn/global/waf/node/info',
  'get'
> = params => defHttp.get(`/v1/cdn/global/waf/node/info`, { params })

/** 获取节点waf规则 */
export const getCdnGlobalWafNodeByIdApi: CommonAPI<
  '/v1/cdn/global/waf/node/{rule_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/global/waf/node/${params.rule_id}`, { params })

/** 删除节点waf规则 */
export const deleteCdnGlobalWafNodeByIdApi: CommonAPI<
  '/v1/cdn/global/waf/node/{rule_id}',
  'delete'
> = data => defHttp.delete(`/v1/cdn/global/waf/node/${data.rule_id}`, { data })

/** 修改节点waf规则 */
export const updateCdnGlobalWafNodeByIdApi: CommonAPI<
  '/v1/cdn/global/waf/node/{rule_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/global/waf/node/${data.rule_id}`, { data })
