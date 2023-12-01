import { type AxiosProgressEvent } from 'axios'
import type { Ref } from 'vue'

import type { CommonAPI } from '../../_utils'
import { ContentTypeEnum, defHttp } from '../../http'

/**
 * @description: 版本
 */

/** 查询版本 */
export const getMtsVersionApi: CommonAPI<'/v1/mts/version', 'get'> = params =>
  defHttp.get(`/v1/mts/version`, { params })

/** 删除 */
export const deleteMtsVersionApi: CommonAPI<
  '/v1/mts/version',
  'delete'
> = data => defHttp.delete(`/v1/mts/version`, { data })

/** 创建 */
export const addMtsVersionApi: CommonAPI<'/v1/mts/version', 'post'> = data =>
  defHttp.post(`/v1/mts/version`, { data })
// export const addMtsVersionApi=(params:UploadFileParams,)

/** 修改 */
export const updateMtsVersionApi: CommonAPI<'/v1/mts/version', 'put'> = data =>
  defHttp.put(`/v1/mts/version`, { data })

/** 获取下载地址 */
export const getMtsVersionDownloadApi: CommonAPI<
  '/v1/mts/version/download',
  'get'
> = params => defHttp.get(`/v1/mts/version/download`, { params })

/**
 * @description: UploadService
 */

/** 整体文件上传 */
export const postUploadFileApi = async (
  data: FormData,
  onUploadProgress: (ProgressEvent: AxiosProgressEvent) => void,
  cancel: Ref<(() => void) | undefined>
) => {
  const controller = new AbortController()
  cancel.value = controller.abort
  const res = defHttp.post(
    `/v1/upload/file`,
    {
      data,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
      onUploadProgress,
      signal: controller.signal
    },
    {
      isTransformResponse: false
    }
  )
  return res
}

/** 完成分片上传 请求合并文件 */
export const postUploadFileChunkCompleteApi: CommonAPI<
  '/v1/upload/file/chunk/complete',
  'post'
> = data => {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, String(data[key as keyof typeof data]))
  }
  return defHttp.post(`/v1/upload/file/chunk/complete`, {
    data: formData,
    headers: { 'Content-Type': ContentTypeEnum.FORM_DATA }
  })
}
