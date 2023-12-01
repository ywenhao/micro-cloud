/**
 * @description: 证书管理
 */

import type { CommonAPI, CommonParams } from '../../_utils'
import { defHttp } from '../../http'

/** 查看api证书文件 */
export const getSitesCertificatesEdgesApisByIdApi: CommonAPI<
  '/v1/sites/certificates/edges-apis/{id}',
  'get'
> = params =>
  defHttp.get(`/v1/sites/certificates/edges-apis/${params.id}`, { params })

/** 证书统计 */
export const getSitesCertificatesStatApi: CommonAPI<
  '/v1/sites/certificates/stat',
  'get'
> = params => defHttp.get(`/v1/sites/certificates/stat`, { params })

/** 获取Api证书列表 */
export const getSitesCertificatesEdgeApisListByIdApi: CommonAPI<
  '/v1/sites/{site_id}/certificates/edge-apis',
  'get'
> = params =>
  defHttp.get(`/v1/sites/${params.site_id}/certificates/edge-apis`, { params })

/** 获取边缘证书 */
export const getSitesCertificatesEdgesByIdApi = (
  params: CommonParams<'/v1/sites/{site_id}/certificates/edges', 'get'>
) =>
  defHttp.get(
    `/v1/sites/${params.site_id}/certificates/edges`,
    { params },
    { isTransformResponse: false }
  )

/** 上传边缘证书 */
export const postSitesCertificatesEdgesByIdApi: CommonAPI<
  '/v1/sites/{site_id}/certificates/edges',
  'post'
> = data =>
  defHttp.post(`/v1/sites/${data.site_id}/certificates/edges`, { data })

/** 获取源服务器证书列表 */
export const getSitesCertificatesOriginsListByIdApi: CommonAPI<
  '/v1/sites/{site_id}/certificates/origins',
  'get'
> = params =>
  defHttp.get(`/v1/sites/${params.site_id}/certificates/origins`, { params })

/** 创建源服务器证书 */
export const addSitesCertificatesOriginsByIdApi: CommonAPI<
  '/v1/sites/{site_id}/certificates/origins',
  'post'
> = data =>
  defHttp.post(`/v1/sites/${data.site_id}/certificates/origins`, { data })

/** 获取源服务器证书秘钥 */
export const getSitesCertificatesByIdApi: CommonAPI<
  '/v1/sites/{site_id}/certificates/{id}',
  'get'
> = params =>
  defHttp.get(`/v1/sites/${params.site_id}/certificates/${params.id}`, {
    params
  })
