import { defHttp } from '../../http'
import type { CommonAPI } from '..'

export const chainDomainListApi: CommonAPI<
  '/v1/dns/system/domains',
  'get'
> = params => defHttp.get('/v1/dns/system/domains', { params })

/**设置用户空间域名 */
export const addDomainApi: CommonAPI<
  '/v1/sys_conf/user_domain',
  'put'
> = data => defHttp.put('/v1/sys_conf/user_domain', { data })

/**获取用户空间域名 */
export const userOutDomainApi: CommonAPI<
  '/v1/sys_conf/user_domain',
  'get'
> = params => defHttp.get('/v1/sys_conf/user_domain', { params })
