import { Message } from '@arco-design/web-vue'
import { ResultEnum } from '@vcp/apis'
import { getMicroAppData } from '@vcp/shared'
import {
  type PreVerifyUploadRequest,
  type UploadFinishParams,
  type UploadParams,
  useSliceUpload
} from '@vcp/shared/lib/slice-upload-utils'
import { ref } from 'vue'

export type UploadOptions = {
  chunkSize: number
  onError: (error: Error) => void
  onFinish: (params: UploadFinishParams) => void
  Authorization: string
  uploadUrl: string | ((params: UploadParams) => string)
  getParams: (params: UploadParams) => FormData
  preVerifyRequest?: PreVerifyUploadRequest
  chunkUploadSuccess?: (params: UploadParams, data: any) => boolean
}

let logoutMsgInstance: any = null

/**
 * 切片上传
 * @param param0 配置
 * @returns
 */
export function useUpload({
  chunkSize,
  uploadUrl,
  Authorization,
  getParams,
  onFinish,
  onError,
  preVerifyRequest,
  chunkUploadSuccess
}: UploadOptions) {
  // 上传的文件
  const uploadFile = ref<File>()

  const { instance, chunks, progress, status, start, pause, cancel } =
    useSliceUpload({
      chunkSize,
      timeout: 60 * 5 * 1000,
      file: uploadFile,
      request,
      onFinish,
      preVerifyRequest,
      onError: error => onError(error as Error)
    })

  // 上传请求函数
  async function request(params: UploadParams) {
    const url = typeof uploadUrl === 'function' ? uploadUrl(params) : uploadUrl
    if (!url) return false
    // 上传请求data数据处理
    const data = getParams(params)

    try {
      const result = await instance.ajaxRequest({
        url,
        data,
        headers: { Authorization }
      })
      const code = result?.code
      if (code === ResultEnum.SUCCESS) {
        if (chunkUploadSuccess) return chunkUploadSuccess(params, result?.data)
        return true
      }

      if (code === ResultEnum.UNAUTHORIZED) {
        if (!logoutMsgInstance) {
          logoutMsgInstance = Message.error({
            content: '当前用户没有登录或者登录已失效，请重新登录',
            onClose() {
              logoutMsgInstance = null
            }
          })
          const data = getMicroAppData()
          data.signOut()
        }
        return false
      }
      onError(new Error(result?.message))
      return false
    } catch (error) {
      return false
    }
  }

  return { uploadFile, chunks, progress, status, start, pause, cancel }
}

/**
 * 获取 Authorization
 * @returns
 */
export function getAuthorization() {
  const microAppData = getMicroAppData()
  const token = microAppData.token
  return `Bearer ${token}`
}
