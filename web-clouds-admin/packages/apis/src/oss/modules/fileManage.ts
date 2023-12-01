import { defHttp } from '../../http'
import type { CommonAPI } from '..'
/**
 * @description: 云存储 - 对象
 */

/**文件列表 */
export const fileListApi: CommonAPI<'/v1/objects/list', 'get'> = (
  params,
  config
) => defHttp.get('/v1/objects/list', { params, ...config })

/**新建目录 */
export const addCatalogApi: CommonAPI<'/v1/objects/dir', 'post'> = data =>
  defHttp.post('/v1/objects/dir', { data })

/** 下载对象 */
export const getObjectsApi: CommonAPI<'/v1/objects', 'get'> = params =>
  defHttp.get(`/v1/objects`, { params })

/** 删除对象 */
export const deleteObjectsApi: CommonAPI<'/v1/objects', 'delete'> = (
  data,
  config
) => defHttp.delete(`/v1/objects`, { data, ...config })

/** 上传对象 */
export const postObjectsApi: CommonAPI<'/v1/objects', 'post'> = data =>
  defHttp.post(`/v1/objects`, { data })

/** 获取元信息 */
export const getObjectsMetadataDetailApi: CommonAPI<
  '/v1/objects/metadata',
  'get'
> = params => defHttp.get(`/v1/objects/metadata`, { params })

/** 修改元信息 */
export const updateObjectsMetadataApi: CommonAPI<
  '/v1/objects/metadata',
  'put'
> = data => defHttp.put(`/v1/objects/metadata`, { data })

/** 开始分片任务 */
export const postObjectsMultipartApi: CommonAPI<
  '/v1/objects/multipart',
  'post'
> = data => defHttp.post(`/v1/objects/multipart`, { data })

/** 完成分片任务 */
export const updateObjectsMultipartApi: CommonAPI<
  '/v1/objects/multipart',
  'put'
> = data => defHttp.put(`/v1/objects/multipart`, { data })

/** 上传分片部分 */
export const postObjectsMultipartPieceApi: CommonAPI<
  '/v1/objects/multipart/piece',
  'post'
> = data => defHttp.post(`/v1/objects/multipart/piece`, { data })

/** 生成外链 */
export const getObjectsPreSignApi: CommonAPI<
  '/v1/objects/pre_sign',
  'post'
> = data => defHttp.post(`/v1/objects/pre_sign`, { data })

/** 上传判断 */
export const postObjectsUploadCheckApi: CommonAPI<
  '/v1/objects/upload_check',
  'post'
> = data => defHttp.post(`/v1/objects/upload_check`, { data })
