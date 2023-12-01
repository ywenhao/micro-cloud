import { type CommonAPI, defHttp } from '..'

/**
 * @description: DNS系统域名管理
 */

/** 获取DNS系统域名信息 */
export const getDnsSystemDomainDetailApi: CommonAPI<
  '/v1/dns/system/domain',
  'get'
> = params => defHttp.get(`/v1/dns/system/domain`, { params })

/** 删除DNS系统域名 */
export const deleteDnsSystemDomainApi: CommonAPI<
  '/v1/dns/system/domain',
  'delete'
> = data => defHttp.delete(`/v1/dns/system/domain`, { data })

/** 添加DNS系统域名 */
export const addDnsSystemDomainApi: CommonAPI<
  '/v1/dns/system/domain',
  'post'
> = data => defHttp.post(`/v1/dns/system/domain`, { data })

/** 更新DNS系统域名 */
export const updateDnsSystemDomainApi: CommonAPI<
  '/v1/dns/system/domain',
  'put'
> = data => defHttp.put(`/v1/dns/system/domain`, { data })

/** 验证DNS系统域名NS状态 */
export const putDnsSystemDomainValidate_nsApi: CommonAPI<
  '/v1/dns/system/domain/validate_ns',
  'put'
> = data => defHttp.put(`/v1/dns/system/domain/validate_ns`, { data })

/** 获取DNS系统域名列表 */
export const getDnsSystemDomainsListApi: CommonAPI<
  '/v1/dns/system/domains',
  'get'
> = params => defHttp.get(`/v1/dns/system/domains`, { params })

/**
 * @description: SystemRr
 */

/** 获取DNS系统记录信息 */
export const getDnsSystemRrDetailApi: CommonAPI<
  '/v1/dns/system/rr',
  'get'
> = params => defHttp.get(`/v1/dns/system/rr`, { params })

/** 删除DNS系统记录 */
export const deleteDnsSystemRrApi: CommonAPI<
  '/v1/dns/system/rr',
  'delete'
> = data => defHttp.delete(`/v1/dns/system/rr`, { data })

/** 添加DNS系统记录 */
export const addDnsSystemRrApi: CommonAPI<'/v1/dns/system/rr', 'post'> = data =>
  defHttp.post(`/v1/dns/system/rr`, { data })

/** 更新DNS系统记录 */
export const updateDnsSystemRrApi: CommonAPI<
  '/v1/dns/system/rr',
  'put'
> = data => defHttp.put(`/v1/dns/system/rr`, { data })

/** 获取DNS系统记录列表 */
export const getDnsSystemRrsListApi: CommonAPI<
  '/v1/dns/system/rrs',
  'get'
> = params => defHttp.get(`/v1/dns/system/rrs`, { params })
