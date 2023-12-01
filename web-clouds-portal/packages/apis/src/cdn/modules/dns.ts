/**
 * @description: DNS域名管理
 */

import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

/** 获取域名转入状态,支持子域名。[1:CDN 查询站点使用接入控制权] */
export const getDnsDomainNsStatusApi: CommonAPI<
  '/v1/dns/domain/ns_status',
  'get'
> = params => defHttp.get(`/v1/dns/domain/ns_status`, { params })
