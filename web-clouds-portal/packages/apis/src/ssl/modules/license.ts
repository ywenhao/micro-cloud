import type { CommonAPI } from '../../_utils'
import { defHttp } from '../../http'

// 证书统计
export const licenseStatApi: CommonAPI<
  '/v1/ssl/certificates/stat',
  'get'
> = params => defHttp.get('/v1/ssl/certificates/stat', { params: params })

// 证书查询
export const licenseListApi: CommonAPI<
  '/v1/ssl/certificates',
  'get'
> = params => defHttp.get('/v1/ssl/certificates', { params: params })

// 获取单条证书
export const licenseDetailsApi: CommonAPI<
  '/v1/ssl/certificates/{id}',
  'get'
> = params => defHttp.get(`/v1/ssl/certificates/${params.id}`)

// 删除证书
export const deleteLicenseApi: CommonAPI<
  '/v1/ssl/certificates',
  'delete'
> = data => defHttp.delete('/v1/ssl/certificates', { data })

// 修改证书
export const editLicenseApi: CommonAPI<
  '/v1/ssl/certificates/{id}/update',
  'put'
> = data => defHttp.put(`/v1/ssl/certificates/${data.id}/update`, { data })

// 批量修改证书
export const batchEditLicenseApi: CommonAPI<
  '/v1/ssl/certificates/batch-update',
  'put'
> = data => defHttp.put('/v1/ssl/certificates/batch-update', { data })

// 下载证书
export const downloadLicenseApi: CommonAPI<
  '/v1/ssl/certificates/download',
  'post'
> = data => defHttp.post(`/v1/ssl/certificates/download`, { data })

// 吊销证书
export const revokeLicenseApi: CommonAPI<
  '/v1/ssl/certificates/revoke',
  'put'
> = data => defHttp.put('/v1/ssl/certificates/revoke', { data })

// 上传证书
export const uploadLicenseApi: CommonAPI<
  '/v1/ssl/certificates/upload',
  'post'
> = data => defHttp.post(`/v1/ssl/certificates/upload`, { data })
