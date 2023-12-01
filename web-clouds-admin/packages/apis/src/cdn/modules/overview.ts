/**
 * @description: 首页概览 overView
 */
import { defHttp } from '../../http'
import type { CommonAPI } from '..'

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

/**获取节点概览 */
export const getCdnOverviewNodesApi: CommonAPI<
  '/v1/cdnnode/nodes/overview',
  'get'
> = () => defHttp.get(`/v1/cdnnode/nodes/overview`)

/**获取站点概览 */
export const getCdnOverviewSiteApi: CommonAPI<
  '/v1/cdn/site/overview',
  'get'
> = () => defHttp.get(`/v1/cdn/site/overview`)

/**获取证书概览 */
export const getCdnOverviewCertificatesApi: CommonAPI<
  '/v1/sites/certificates/stat',
  'get'
> = () => defHttp.get(`/v1/sites/certificates/stat`)
