import { type CommonAPI, defHttp } from '..'

/**
 * @description: 节点版本管理
 */

/** 删除节点版本 */
export const deleteDnsNodeVersionApi: CommonAPI<
  '/v1/dns/node/version',
  'delete'
> = data => defHttp.delete(`/v1/dns/node/version`, { data })

/** 添加节点版本 */
export const addDnsNodeVersionApi: CommonAPI<
  '/v1/dns/node/version',
  'post'
> = data => defHttp.post(`/v1/dns/node/version`, { data })

/** 更新节点版本 */
export const updateDnsNodeVersionApi: CommonAPI<
  '/v1/dns/node/version',
  'put'
> = data => defHttp.put(`/v1/dns/node/version`, { data })

/** 获取节点版本下载地址 */
export const getDnsNodeVersionUrlApi: CommonAPI<
  '/v1/dns/node/version/url',
  'get'
> = params => defHttp.get(`/v1/dns/node/version/url`, { params })

/** 获取节点版本列表 */
export const getDnsNodeVersionsListApi: CommonAPI<
  '/v1/dns/node/versions',
  'get'
> = params => defHttp.get(`/v1/dns/node/versions`, { params })
