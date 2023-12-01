import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

// 获取系统配置
export const getSystemConfigApi: CommonAPI<'/v1/ssl/configs', 'get'> = () =>
  defHttp.get('/v1/ssl/configs')

// 修改系统配置
export const saveSystemConfigApi: CommonAPI<'/v1/ssl/configs', 'put'> = data =>
  defHttp.put('/v1/ssl/configs', { data })
