/**
 * @description: 数据统计
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 带宽列表 */
export const getCdnStatisticBandwidthListApi: CommonAPI<
  '/v1/cdn/statistic/bandwidth/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/bandwidth/list`, { params })

/** 错误码列表 */
export const getCdnStatisticCodeListApi: CommonAPI<
  '/v1/cdn/statistic/code/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/code/list`, { params })

/** 独立ip访问数列表 */
export const getCdnStatisticHitrateListApi: CommonAPI<
  '/v1/cdn/statistic/hitrate/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/hitrate/list`, { params })

/** 独立ip访问数列表 */
export const getCdnStatisticIpsListApi: CommonAPI<
  '/v1/cdn/statistic/ips/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/ips/list`, { params })

/** 威胁数列表 */
export const getCdnStatisticMenacesListApi: CommonAPI<
  '/v1/cdn/statistic/menaces/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/menaces/list`, { params })

/** 概览-数据概览 */
export const getCdnStatisticOverviewDataApi: CommonAPI<
  '/v1/cdn/statistic/overview/data',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/overview/data`, { params })

/** 概览-top5站点 */
export const getCdnStatisticOverviewSiteTopApi: CommonAPI<
  '/v1/cdn/statistic/overview/site-top',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/overview/site-top`, { params })

/** 概览-安全防护 */
export const getCdnStatisticOverviewWafApi: CommonAPI<
  '/v1/cdn/statistic/overview/waf',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/overview/waf`, { params })

/** 防护数列表 */
export const getCdnStatisticPreventsListApi: CommonAPI<
  '/v1/cdn/statistic/prevents/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/prevents/list`, { params })

/** 性能 - 内容占比列表 */
export const getCdnStatisticProperContentListApi: CommonAPI<
  '/v1/cdn/statistic/proper/content/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/proper/content/list`, { params })

/** 请求数列表 */
export const getCdnStatisticRequestListApi: CommonAPI<
  '/v1/cdn/statistic/request/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/request/list`, { params })

/** 性能汇总 */
export const getCdnStatisticSummaryProperApi: CommonAPI<
  '/v1/cdn/statistic/summary/proper',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/summary/proper`, { params })

/** 流量汇总 */
export const getCdnStatisticSummaryTrafficApi: CommonAPI<
  '/v1/cdn/statistic/summary/traffic',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/summary/traffic`, { params })

/** 安全性汇总 */
export const getCdnStatisticSummaryWafApi: CommonAPI<
  '/v1/cdn/statistic/summary/waf',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/summary/waf`, { params })

/** 排行 - top域名 */
export const getCdnStatisticTopDomainListApi: CommonAPI<
  '/v1/cdn/statistic/top/domain/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/top/domain/list`, { params })

/** 排行 - ua - Referer - 请求数 */
export const getCdnStatisticTopRefererRequestListApi: CommonAPI<
  '/v1/cdn/statistic/top/referer-request/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/referer-request/list`, { params })

/** 排行 - ua - Referer - 流量 */
export const getCdnStatisticTopRefererTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/top/referer-traffic/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/referer-traffic/list`, { params })

/** 排行 - ua - 浏览器 - 请求数 */
export const getCdnStatisticTopUaBrowserRequestListApi: CommonAPI<
  '/v1/cdn/statistic/top/ua-browser-request/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/ua-browser-request/list`, { params })

/** 排行 - ua - 浏览器 - 流量 */
export const getCdnStatisticTopUaBrowserTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/top/ua-browser-traffic/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/ua-browser-traffic/list`, { params })

/** 排行 - ua - 设备 - 请求数 */
export const getCdnStatisticTopUaDeviceRequestListApi: CommonAPI<
  '/v1/cdn/statistic/top/ua-device-request/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/ua-device-request/list`, { params })

/** 排行 - ua - 设备 - 流量 */
export const getCdnStatisticTopUaDeviceTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/top/ua-device-traffic/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/ua-device-traffic/list`, { params })

/** 排行 - ua - 操作系统 - 请求数 */
export const getCdnStatisticTopUaSystemRequestListApi: CommonAPI<
  '/v1/cdn/statistic/top/ua-system-request/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/ua-system-request/list`, { params })

/** 排行 - ua - 操作系统 - 流量 */
export const getCdnStatisticTopUaSystemTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/top/ua-system-traffic/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/top/ua-system-traffic/list`, { params })

/** 排行 - top url 请求数 */
export const getCdnStatisticTopUrlRequestListApi: CommonAPI<
  '/v1/cdn/statistic/top/url-request/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/top/url-request/list`, { params })

/** 排行 - top url 流量 */
export const getCdnStatisticTopUrlTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/top/url-traffic/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/top/url-traffic/list`, { params })

/** 流量列表 */
export const getCdnStatisticTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/traffic/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/traffic/list`, { params })

/** 访问用户分布-访问数 */
export const getCdnStatisticUserRegionRequestListApi: CommonAPI<
  '/v1/cdn/statistic/user_region_request/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/user_region_request/list`, { params })

/** 访问用户分布-流量 */
export const getCdnStatisticUserRegionTrafficListApi: CommonAPI<
  '/v1/cdn/statistic/user_region_traffic/list',
  'get'
> = params =>
  defHttp.get(`/v1/cdn/statistic/user_region_traffic/list`, { params })

/** waf日志列表 */
export const getCdnStatisticWafListApi: CommonAPI<
  '/v1/cdn/statistic/waf/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/waf/list`, { params })
