import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**
 * @description: 首页概览 overView
 */

/** 流量 */
export const getCdnOverviewTrafficApi: CommonAPI<
  '/v1/cdn/statistic/traffic/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/traffic/list`, { params })

/** 带宽 */
export const getCdnOverviewBandwidthApi: CommonAPI<
  '/v1/cdn/statistic/bandwidth/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/bandwidth/list`, { params })

/** 请求数 */
export const getCdnOverviewRequestsApi: CommonAPI<
  '/v1/cdn/statistic/request/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/request/list`, { params })

/** 独立IP访问数 */
export const getCdnOverviewIpAccessesApi: CommonAPI<
  '/v1/cdn/statistic/ips/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/ips/list`, { params })

/** 命中率 */
export const getCdnOverviewIpHitRateApi: CommonAPI<
  '/v1/cdn/statistic/hitrate/list',
  'get'
> = params => defHttp.get(`/v1/cdn/statistic/hitrate/list`, { params })

/**获取概览 */
export const getCdnOverviewApi: CommonAPI<
  '/v1/cdn/statistic/overview/data',
  'get'
> = () => defHttp.get(`/v1/cdn/statistic/overview/data`)

/**获取安全防护 */
export const getCdnOverviewWafApi: CommonAPI<
  '/v1/cdn/statistic/overview/waf',
  'get'
> = () => defHttp.get(`/v1/cdn/statistic/overview/waf`)

/**获取top5 站点 */
export const getCdnOverviewTopApi: CommonAPI<
  '/v1/cdn/statistic/overview/site-top',
  'get'
> = () => defHttp.get(`/v1/cdn/statistic/overview/site-top`)
