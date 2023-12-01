import { type CommonAPI, defHttp } from '..'

/**
 * @description: ns服务器管理
 */

/** 删除ns服务器 */
export const deleteDnsNsApi: CommonAPI<'/v1/dns/ns', 'delete'> = params =>
  defHttp.delete(`/v1/dns/ns`, { params })

/** 更新ns服务器 */
export const updateDnsNsApi: CommonAPI<'/v1/dns/ns', 'put'> = data =>
  defHttp.put(`/v1/dns/ns`, { data })

/** 获取安装命令 */
export const getDnsNsCommandApi: CommonAPI<
  '/v1/dns/ns/command',
  'get'
> = params => defHttp.get(`/v1/dns/ns/command`, { params })

/** 升级版本 */
export const postDnsNsUpgradeApi: CommonAPI<
  '/v1/dns/ns/upgrade',
  'post'
> = data => defHttp.post(`/v1/dns/ns/upgrade`, { data })

/** 获取ns服务器列表 */
export const getDnsNssListApi: CommonAPI<'/v1/dns/nss', 'get'> = params =>
  defHttp.get(`/v1/dns/nss`, { params })
