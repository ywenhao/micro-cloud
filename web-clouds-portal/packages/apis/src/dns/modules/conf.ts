import { type CommonAPI, defHttp } from '..'

/**
 * @description: DNS系统设置
 */

/** 获取系统设置列表 */
export const getDnsConfigListApi: CommonAPI<'/v1/dns/config', 'get'> = params =>
  defHttp.get(`/v1/dns/config`, { params })
