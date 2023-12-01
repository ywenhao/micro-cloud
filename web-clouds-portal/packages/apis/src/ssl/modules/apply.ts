import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

// 获取申请统计
export const applyStatApi: CommonAPI<'/v1/ssl/obtains/stat', 'get'> = () =>
  defHttp.get('/v1/ssl/obtains/stat')

// 获取证书列表
export const applyListApi: CommonAPI<'/v1/ssl/obtains', 'get'> = params =>
  defHttp.get('/v1/ssl/obtains', { params })

//修改备注名
export const editRemarkApi: CommonAPI<'/v1/ssl/obtains/{id}', 'put'> = data =>
  defHttp.put(`/v1/ssl/obtains/${data.id}`, { data })

// 申请详情
export const detailsApi: CommonAPI<'/v1/ssl/obtains/{id}', 'get'> = params =>
  defHttp.get(`/v1/ssl/obtains/${params.id}`)

// 取消申请
export const applyCancelApi: CommonAPI<
  '/v1/ssl/obtains/cancel',
  'post'
> = data => defHttp.post('/v1/ssl/obtains/cancel', { data })

/** 申请证书 */
export const applyApi: CommonAPI<'/v1/ssl/obtains', 'post'> = data =>
  defHttp.post('/v1/ssl/obtains', { data })

/** 批量申请证书 */
export const applyBatchApi: CommonAPI<'/v1/ssl/obtains/batch', 'post'> = data =>
  defHttp.post('/v1/ssl/obtains/batch', { data })

/** 域名验证 */
export const applyDomainValidApi: CommonAPI<
  '/v1/ssl/obtains/domain-verify',
  'post'
> = data => defHttp.post('/v1/ssl/obtains/domain-verify', { data })

/** 修改申请 */
export const changeApplyApi: CommonAPI<'/v1/ssl/obtains/{id}', 'put'> = data =>
  defHttp.put(`/v1/ssl/obtains/${data.id}`, { data })

/** DNS验证：自动验证*/
export const dnsAutoVerifyApi = (params: { user_id: string; domain: string }) =>
  defHttp.get(
    '/v1/ssl/obtains/dns-detect',
    { params },
    {
      isTransformResponse: false
    }
  )
/** DNS验证:手动验证 */
export const dnsVerifyApi = (data: { id: string }) =>
  defHttp.post(
    `/v1/ssl/obtains/${data.id}/dns-verify`,
    { data: { id: data.id } },
    {
      isTransformResponse: false
    }
  )

/**  DNS验证通过：手动验证*/
export const dnsVerifyPassApi: CommonAPI<
  '/v1/ssl/obtains/{id}/dns-passed',
  'post'
> = data => defHttp.post(`/v1/ssl/obtains/${data.id}/dns-passed`)

/** 续签证书*/
export const renewApi: CommonAPI<'/v1/ssl/renews/{id}', 'post'> = data =>
  defHttp.post(`/v1/ssl/renews/${data.id}`, { data })

/** 批量续签证书*/
export const batchRenewApi: CommonAPI<'/v1/ssl/renews/batch', 'post'> = data =>
  defHttp.post('/v1/ssl/renews/batch', { data })

/**
 * @description: SiteResolveService
 */
