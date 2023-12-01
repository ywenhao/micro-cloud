import { Message } from '@arco-design/web-vue'
import {
  baseURL,
  getAuthorization,
  useUpload as useUploadUtils
} from '@vca/shared'
import type {
  AjaxRequestError,
  UploadFinishParams,
  UploadParams
} from '@vca/shared/src/lib/slice-upload-utils'
import { isNil } from 'lodash-es'
import { mergeBaseURL } from 'vc-material'
import { reactive, watch } from 'vue'

export function useUpload() {
  const Authorization = getAuthorization()
  const uploadUrl = mergeBaseURL('/v1/upload/file/chunk', baseURL)

  let finishFn: any
  let errorFn: any
  let progressFn: any

  const setOnFinish = (cb: (...args: any[]) => any) => (finishFn = cb)
  const setOnError = (cb: (...args: any[]) => any) => (errorFn = cb)
  const setOnProgress = (cb: (percent: number) => void) => (progressFn = cb)

  let messageInstance: any
  // 错误处理
  const onError = (err: Error | AjaxRequestError) => {
    // @ts-ignore
    const status = err?.status as number
    let msg = '上传失败'
    // 接口给报错信息
    if (isNil(status)) msg = err?.message
    messageInstance && messageInstance.close()
    messageInstance = Message.error(msg || '上传失败')
    errorFn?.()
  }
  // 上传完成
  const onFinish = (params: UploadFinishParams) => {
    finishFn?.(params)
  }

  const result = useUploadUtils({
    chunkSize: 1 * 1024 * 1024,
    uploadUrl,
    Authorization,
    getParams,
    onError,
    onFinish
  })

  watch(result.progress, progress => {
    progressFn?.(progress)
  })
  return reactive({ ...result, setOnFinish, setOnError, setOnProgress })
}

/**
 * 获取上传参数
 * @param params uploadUtils的参数
 * @returns
 */
export function getParams(params: UploadParams) {
  const { chunk, index, chunkTotal, filename, preHash } = params
  const formData = new FormData()
  const source = getSource()
  formData.append('source', String(source))
  formData.append('file', chunk)
  formData.append('file_name', filename)
  formData.append('chunk_id', preHash)
  formData.append('chunk_index', String(index + 1))
  formData.append('chunk_total', String(chunkTotal))
  return formData
}

/**
 * source参数
 * @returns
 */
export function getSource() {
  // @ts-ignore
  const appName = window.__MICRO_APP_NAME__
  const sourceMap = { cdn: 1, mts: 2, dns: 3 }
  const source = sourceMap[appName as keyof typeof sourceMap]
  return source
}
