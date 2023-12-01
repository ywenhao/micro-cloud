import { defHttp } from '../../http'
import type { CommonAPI } from '..'

export const adminListApi: CommonAPI<'/v1/admins', 'get'> = params =>
  defHttp.get('/v1/admins', { params })

export const adminLoginRecordApi: CommonAPI<
  '/v1/admin/login_records',
  'get'
> = params => defHttp.get('/v1/admin/login_records', { params })

export const signInApi: CommonAPI<'/v1/admin/login', 'post'> = data =>
  defHttp.post('/v1/admin/login', { data }, { isTransformResponse: false })

export const adminAddApi: CommonAPI<'/v1/admin', 'post'> = data =>
  defHttp.post('/v1/admin', { data })

export const adminInfoApi: CommonAPI<'/v1/admin', 'get'> = params =>
  defHttp.get('/v1/admin', { params })

export const adminUpdateApi: CommonAPI<'/v1/admin', 'put'> = data =>
  defHttp.put('/v1/admin', { data })

export const adminUpdatePwdApi: CommonAPI<'/v1/admin/password', 'put'> = data =>
  defHttp.put('/v1/admin/password', { data }, { isReturnNativeResponse: true })

export const adminResetApi: CommonAPI<
  '/v1/admin/password/reset',
  'put'
> = data => defHttp.put('/v1/admin/password/reset', { data })

export const adminDeleteApi: CommonAPI<'/v1/admin', 'delete'> = params =>
  defHttp.delete('/v1/admin', { params }, { joinParamsToUrl: true })
