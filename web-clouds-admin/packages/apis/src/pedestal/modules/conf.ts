import type { AxiosProgressEvent } from 'axios'

import { defHttp } from '../../http'
import type { UploadFileParams } from '../../http/types'
import type { CommonAPI } from '..'

/** 查询配置 */
export const confApi: CommonAPI<'/v1/conf', 'get'> = (params = {}) =>
  defHttp.get('/v1/conf', { params })

/** 修改配置 */
export const confUpdateApi: CommonAPI<'/v1/conf', 'put'> = data =>
  defHttp.put('/v1/conf', { data })

/** 验证邮箱 */
export const verifyEmailApi: CommonAPI<'/v1/email', 'post'> = data =>
  defHttp.post('/v1/email', { data })

/** 上传文件 */
export const uploadFileApi = (
  params: UploadFileParams,
  config?: { onUploadProgress?: (progressEvent: AxiosProgressEvent) => void }
) =>
  defHttp.uploadFile(
    { url: '/v1/upload', onUploadProgress: config?.onUploadProgress },
    params
  )
