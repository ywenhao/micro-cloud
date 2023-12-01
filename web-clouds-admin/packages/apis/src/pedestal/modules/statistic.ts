import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**
 * @description: 云存储 - 统计分析
 */

/** 留存分析-趋势 */
export const getManageStatisticKeepTrendApi: CommonAPI<
  '/v1/manage/statistic/keep/trend',
  'get'
> = params => defHttp.get(`/v1/manage/statistic/keep/trend`, { params })

/** 新增注册用户-新增注册用户 */
export const addManageStatisticNewRegistrationGeneralApi: CommonAPI<
  '/v1/manage/statistic/new-registration/general',
  'get'
> = params =>
  defHttp.get(`/v1/manage/statistic/new-registration/general`, { params })

/** 新增注册用户-地域分布 */
export const addManageStatisticNewRegistrationRegionApi: CommonAPI<
  '/v1/manage/statistic/new-registration/region',
  'get'
> = params =>
  defHttp.get(`/v1/manage/statistic/new-registration/region`, { params })

/** 新增注册用户-Top浏览器分布 */
export const addManageStatisticNewRegistrationTopBrowserApi: CommonAPI<
  '/v1/manage/statistic/new-registration/top/browser',
  'get'
> = params =>
  defHttp.get(`/v1/manage/statistic/new-registration/top/browser`, { params })

/** 新增注册用户-新增趋势 */
export const addManageStatisticNewRegistrationTrendApi: CommonAPI<
  '/v1/manage/statistic/new-registration/trend',
  'get'
> = params =>
  defHttp.get(`/v1/manage/statistic/new-registration/trend`, { params })

/** 数据概览-常用指标 */
export const getManageStatisticOverviewGeneralApi: CommonAPI<
  '/v1/manage/statistic/overview/general',
  'get'
> = params => defHttp.get(`/v1/manage/statistic/overview/general`, { params })

/** 数据概览-数据概览 */
export const getManageStatisticOverviewOnlineApi: CommonAPI<
  '/v1/manage/statistic/overview/online',
  'get'
> = params => defHttp.get(`/v1/manage/statistic/overview/online`, { params })

/** 数据概览-注册用户量趋势 */
export const getManageStatisticOverviewRegistrationTrendApi: CommonAPI<
  '/v1/manage/statistic/overview/registration/trend',
  'get'
> = params =>
  defHttp.get(`/v1/manage/statistic/overview/registration/trend`, { params })

/** 平台PV/UV */
export const getManageStatisticPuGeneralApi: CommonAPI<
  '/v1/manage/statistic/pu/general',
  'get'
> = params => defHttp.get(`/v1/manage/statistic/pu/general`, { params })

/** 平台PV/UV趋势 */
export const getManageStatisticPuTrendApi: CommonAPI<
  '/v1/manage/statistic/pu/trend',
  'get'
> = params => defHttp.get(`/v1/manage/statistic/pu/trend`, { params })

/** 空间概览 */
export const postStatisticBucketOverviewApi: CommonAPI<
  '/v1/statistic/bucket/overview',
  'post'
> = data => defHttp.post(`/v1/statistic/bucket/overview`, { data })

/** 流入流量趋势 */
export const postStatisticInflowTrendApi: CommonAPI<
  '/v1/statistic/inflow_trend',
  'post'
> = data => defHttp.post(`/v1/statistic/inflow_trend`, { data })

/** 文件请求趋势 */
export const postStatisticObjReqTrendApi: CommonAPI<
  '/v1/statistic/obj_req_trend',
  'post'
> = data => defHttp.post(`/v1/statistic/obj_req_trend`, { data })

/** 流出流量趋势 */
export const postStatisticOutflowTrendApi: CommonAPI<
  '/v1/statistic/outflow_trend',
  'post'
> = data => defHttp.post(`/v1/statistic/outflow_trend`, { data })

/** 概览 */
export const postStatisticOverviewApi: CommonAPI<
  '/v1/statistic/overview',
  'post'
> = data => defHttp.post(`/v1/statistic/overview`, { data })

/** 存储/存储量 */
export const postStatisticStorageTrendApi: CommonAPI<
  '/v1/statistic/storage_trend',
  'post'
> = data => defHttp.post(`/v1/statistic/storage_trend`, { data })

/** 存储/上传文件数 */
export const postStatisticUploadTrendApi: CommonAPI<
  '/v1/statistic/upload_trend',
  'post'
> = data => defHttp.post(`/v1/statistic/upload_trend`, { data })
