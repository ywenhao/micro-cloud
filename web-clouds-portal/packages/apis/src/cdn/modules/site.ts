/**
 * @description: 站点管理 SiteServer
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'
/**
 * @description: SiteServer
 */

/** 获取站点列表 */
export const getCdnSiteListApi: CommonAPI<'/v1/cdn/site', 'get'> = params =>
  defHttp.get(`/v1/cdn/site`, { params })

/** 创建站点 */
export const addCdnSiteApi: CommonAPI<'/v1/cdn/site', 'post'> = data =>
  defHttp.post(`/v1/cdn/site`, { data })

/** 获取防盗链 */
export const getCdnSiteAntiTheftChainByIdApi: CommonAPI<
  '/v1/cdn/site/anti-theft-chain/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/anti-theft-chain/${params.site_id}`, { params })

/** 更新防盗链 */
export const updateCdnSiteAntiTheftChainByIdApi: CommonAPI<
  '/v1/cdn/site/anti-theft-chain/{site_id}',
  'put'
> = data =>
  defHttp.put(`/v1/cdn/site/anti-theft-chain/${data.site_id}`, { data })

/** 获取缓存配置 */
export const getCdnSiteCacheConfigByIdApi: CommonAPI<
  '/v1/cdn/site/cache-config/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/cache-config/${params.site_id}`, { params })

/** 更新缓存配置 */
export const updateCdnSiteCacheConfigByIdApi: CommonAPI<
  '/v1/cdn/site/cache-config/{site_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/site/cache-config/${data.site_id}`, { data })

/** 清理缓存 */
export const postCdnSiteClearCacheByIdApi: CommonAPI<
  '/v1/cdn/site/clear-cache/{site_id}',
  'post'
> = data => defHttp.post(`/v1/cdn/site/clear-cache/${data.site_id}`, { data })

/** 获取自定义错误页面 */
export const getCdnSiteErrorPageByIdApi: CommonAPI<
  '/v1/cdn/site/error-page/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/error-page/${params.site_id}`, { params })

/** 自定义错误页面 */
export const updateCdnSiteErrorPageByIdApi: CommonAPI<
  '/v1/cdn/site/error-page/{site_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/site/error-page/${data.site_id}`, { data })

/** Waf/DDos预置规则（托管规则） */
export const getCdnSiteManageRuleByIdApi: CommonAPI<
  '/v1/cdn/site/manage-rule/{site_id}/{rule_type}',
  'get'
> = params =>
  defHttp.get(
    `/v1/cdn/site/manage-rule/${params.site_id}/${params.rule_type}`,
    { params }
  )

/** Waf/DDos预置规则（托管规则） */
export const updateCdnSiteManageRuleByIdApi: CommonAPI<
  '/v1/cdn/site/manage-rule/{site_id}/{rule_type}',
  'put'
> = data =>
  defHttp.put(`/v1/cdn/site/manage-rule/${data.site_id}/${data.rule_type}`, {
    data
  })

/** 获取网络配置 */
export const getCdnSiteNetworkConfigByIdApi: CommonAPI<
  '/v1/cdn/site/network-config/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/network-config/${params.site_id}`, { params })

/** 更新网络配置 */
export const updateCdnSiteNetworkConfigByIdApi: CommonAPI<
  '/v1/cdn/site/network-config/{site_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/site/network-config/${data.site_id}`, { data })

/** 获取源站配置 */
export const getCdnSiteOriginConfigByIdApi: CommonAPI<
  '/v1/cdn/site/origin-config/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/origin-config/${params.site_id}`, { params })

/** 修改源站配置 */
export const updateCdnSiteOriginConfigByIdApi: CommonAPI<
  '/v1/cdn/site/origin-config/{site_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/site/origin-config/${data.site_id}`, { data })

/** 获取站点首页概览 */
export const getCdnSiteOverviewApi: CommonAPI<
  '/v1/cdn/site/overview',
  'get'
> = params => defHttp.get(`/v1/cdn/site/overview`, { params })

/** 获取页面规则列表 */
export const getCdnSitePageRuleListByIdApi: CommonAPI<
  '/v1/cdn/site/page-rule/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/page-rule/${params.site_id}`, { params })

/** 创建 */
export const addCdnSitePageRuleByIdApi: CommonAPI<
  '/v1/cdn/site/page-rule/{site_id}',
  'post'
> = data => defHttp.post(`/v1/cdn/site/page-rule/${data.site_id}`, { data })

/** 获取页面规则详情 */
export const getCdnSitePageRuleDetailByIdApi: CommonAPI<
  '/v1/cdn/site/page-rule/{site_id}/{rule_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/page-rule/${params.site_id}/${params.rule_id}`, {
    params
  })

/** 删除页面规则 */
export const deleteCdnSitePageRuleByIdApi: CommonAPI<
  '/v1/cdn/site/page-rule/{site_id}/{rule_id}',
  'delete'
> = data =>
  defHttp.delete(`/v1/cdn/site/page-rule/${data.site_id}/${data.rule_id}`, {
    data
  })

/** 更新页面规则 */
export const updateCdnSitePageRuleByIdApi: CommonAPI<
  '/v1/cdn/site/page-rule/{site_id}/{rule_id}',
  'put'
> = data =>
  defHttp.put(`/v1/cdn/site/page-rule/${data.site_id}/${data.rule_id}`, {
    data
  })

/** 获取站点的解析状态 */
export const getCdnSiteResolveStatusApi: CommonAPI<
  '/v1/cdn/site/resolve/status',
  'get'
> = params => defHttp.get(`/v1/cdn/site/resolve/status`, { params })

/** 获取性能优化配置 */
export const getCdnSiteSpeedOptimizeByIdApi: CommonAPI<
  '/v1/cdn/site/speed-optimize/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/speed-optimize/${params.site_id}`, { params })

/** 修改性能优化 */
export const updateCdnSiteSpeedOptimizeByIdApi: CommonAPI<
  '/v1/cdn/site/speed-optimize/{site_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/site/speed-optimize/${data.site_id}`, { data })

/** 获取协议配置 */
export const getCdnSiteSslConfigByIdApi: CommonAPI<
  '/v1/cdn/site/ssl-config/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/ssl-config/${params.site_id}`, { params })

/** 修改协议配置 */
export const updateCdnSiteSslConfigByIdApi: CommonAPI<
  '/v1/cdn/site/ssl-config/{site_id}',
  'put'
> = data => defHttp.put(`/v1/cdn/site/ssl-config/${data.site_id}`, { data })

/** 获取转换规则列表 */
export const getCdnSiteTransformRuleListByIdApi: CommonAPI<
  '/v1/cdn/site/transform-rule/{site_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/transform-rule/${params.site_id}`, { params })

/** 获取转换规则详情 */
export const getCdnSiteTransformRuleDetailByIdApi: CommonAPI<
  '/v1/cdn/site/transform-rule/{site_id}/{rule_id}',
  'get'
> = params =>
  defHttp.get(
    `/v1/cdn/site/transform-rule/${params.site_id}/${params.rule_id}`,
    { params }
  )

/** 删除转换规则 */
export const deleteCdnSiteTransformRuleByIdApi: CommonAPI<
  '/v1/cdn/site/transform-rule/{site_id}/{rule_id}',
  'delete'
> = data =>
  defHttp.delete(
    `/v1/cdn/site/transform-rule/${data.site_id}/${data.rule_id}`,
    { data }
  )

/** 更新转换规则 */
export const updateCdnSiteTransformRuleByIdApi: CommonAPI<
  '/v1/cdn/site/transform-rule/{site_id}/{rule_id}',
  'put'
> = data =>
  defHttp.put(`/v1/cdn/site/transform-rule/${data.site_id}/${data.rule_id}`, {
    data
  })

/** 新增转换规则-URL重写 */
export const addCdnSiteTransformRuleByIdApi: CommonAPI<
  '/v1/cdn/site/transform-rule/{site_id}/{rule_type}',
  'post'
> = data =>
  defHttp.post(
    `/v1/cdn/site/transform-rule/${data.site_id}/${data.rule_type}`,
    { data }
  )

/** 自定义waf规则列表 */
export const getCdnSiteWafRuleListByIdApi: CommonAPI<
  '/v1/cdn/site/waf-rule/{site_id}',
  'get'
> = params => defHttp.get(`/v1/cdn/site/waf-rule/${params.site_id}`, { params })

/** 创建自定义waf规则 */
export const addCdnSiteWafRuleByIdApi: CommonAPI<
  '/v1/cdn/site/waf-rule/{site_id}',
  'post'
> = data => defHttp.post(`/v1/cdn/site/waf-rule/${data.site_id}`, { data })

/** 获取自定义waf规则详情 */
export const getCdnSiteWafRuleDetailByIdApi: CommonAPI<
  '/v1/cdn/site/waf-rule/{site_id}/{rule_id}',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/site/waf-rule/${params.site_id}/${params.rule_id}`, {
    params
  })

/** 删除自定义waf规则 */
export const deleteCdnSiteWafRuleByIdApi: CommonAPI<
  '/v1/cdn/site/waf-rule/{site_id}/{rule_id}',
  'delete'
> = data =>
  defHttp.delete(`/v1/cdn/site/waf-rule/${data.site_id}/${data.rule_id}`, {
    data
  })

/** 修改自定义waf规则 */
export const updateCdnSiteWafRuleByIdApi: CommonAPI<
  '/v1/cdn/site/waf-rule/{site_id}/{rule_id}',
  'put'
> = data =>
  defHttp.put(`/v1/cdn/site/waf-rule/${data.site_id}/${data.rule_id}`, { data })

/** 获取站点基础信息 */
export const getCdnSiteDetailByIdApi: CommonAPI<
  '/v1/cdn/site/{site_id}',
  'get'
> = params => defHttp.get(`/v1/cdn/site/${params.site_id}`, { params })

/** 删除站点 */
export const deleteCdnSiteByIdApi: CommonAPI<
  '/v1/cdn/site/{site_id}',
  'delete'
> = data => defHttp.delete(`/v1/cdn/site/${data.site_id}`, { data })
