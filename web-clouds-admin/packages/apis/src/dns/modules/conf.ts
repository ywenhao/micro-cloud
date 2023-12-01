import { type CommonAPI, defHttp } from '..'
/**
 * @description: Config
 */

/** 获取系统设置列表 */
export const getDnsConfigListApi: CommonAPI<'/v1/dns/config', 'get'> = params =>
  defHttp.get(`/v1/dns/config`, { params })

/** 更新配置 */
export const updateDnsConfigApi: CommonAPI<'/v1/dns/config', 'put'> = data =>
  defHttp.put(`/v1/dns/config`, { data })
