import { type CommonAPI, defHttp } from '..'

/**创建工单 */
export const queryProductListApi: CommonAPI<'/v1/product', 'get'> = params =>
  defHttp.get('/v1/product', { params })
