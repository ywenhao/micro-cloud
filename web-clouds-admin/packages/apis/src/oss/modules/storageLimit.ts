import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**获取存储限制 */
export const storageLimitApi: CommonAPI<'/v1/sys_conf', 'get'> = () =>
  defHttp.get('/v1/sys_conf')

/**修改存储限制 */
export const editStorageLimitApi: CommonAPI<'/v1/sys_conf', 'put'> = data =>
  defHttp.put('/v1/sys_conf', { data })
