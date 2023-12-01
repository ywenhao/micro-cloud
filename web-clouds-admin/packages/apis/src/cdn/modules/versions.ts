/**
 * @description: 版本管理 VersionService
 */

import axios, { type AxiosProgressEvent, type Canceler } from 'axios'
import { type Ref } from 'vue'

import type { CommonAPI } from '../../_utils'
import { ContentTypeEnum, defHttp } from '../../http'
/**
 * @description: VersionService
 */

/** 版本文件整体上传 */
export const postCdnVersionsFileApi = async (
  data: FormData,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
  cancel?: Ref<Canceler | undefined>
) => {
  const CancelToken = axios.CancelToken
  const res = defHttp.post(
    `/v1/cdn/versions/file`,
    {
      data,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      onUploadProgress,
      cancelToken: new CancelToken(c => {
        if (cancel) cancel.value = c
      })
    },
    {
      isTransformResponse: false
    }
  )
  return res
}

/** 版本文件分片上传文件 文件的分片上传 */
export const postCdnVersionsFileChunkApi: CommonAPI<
  '/v1/cdn/versions/file/chunk',
  'post'
> = data => defHttp.post(`/v1/cdn/versions/file/chunk`, { data })

/** 版本文件完成分片上传 请求合并文件 */
export const postCdnVersionsFileChunkCompleteApi: CommonAPI<
  '/v1/cdn/versions/file/chunk/complete',
  'post'
> = data => defHttp.post(`/v1/cdn/versions/file/chunk/complete`, { data })

/** 列表 */
export const getVersionsListApi: CommonAPI<'/v1/versions', 'get'> = params =>
  defHttp.get(`/v1/versions`, { params })

/** 创建版本 */
export const addVersionsApi: CommonAPI<'/v1/versions', 'post'> = data =>
  defHttp.post(`/v1/versions`, { data })

/** 下载 */
export const getVersionsDownloadApi: CommonAPI<
  '/v1/versions/download',
  'get'
> = params => defHttp.get(`/v1/versions/download`, { params })

/** 删除 */
export const deleteVersionsByIdApi: CommonAPI<
  '/v1/versions/{id}',
  'delete'
> = data => defHttp.delete(`/v1/versions/${data.id}`, { data })

/** 修改版本备注 */
export const updateCdnVersionDescApi: CommonAPI<
  '/v1/cdn/versions/desc',
  'put'
> = data => defHttp.delete(`/v1/cdn/versions/desc`, { data })
