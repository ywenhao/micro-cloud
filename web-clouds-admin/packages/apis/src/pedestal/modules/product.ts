import { defHttp } from '../../http'
import type { CommonAPI } from '..'

export const productListApi: CommonAPI<'/v1/product', 'get'> = params =>
  defHttp.get('/v1/product', { params })

export const productUpdateApi: CommonAPI<'/v1/product', 'put'> = data =>
  defHttp.put('/v1/product', { data })

export const productChangeStatusApi: CommonAPI<
  '/v1/product/status',
  'put'
> = data => defHttp.put('/v1/product/status', { data })

export const productUpdateIndexApi: CommonAPI<
  '/v1/product/index',
  'put'
> = data => defHttp.put('/v1/product/index', { data })

export const productInfoApi: CommonAPI<'/v1/product/info', 'get'> = params =>
  defHttp.get('/v1/product', { params }, { joinParamsToUrl: true })
