import {
  baseURL,
  getAuthorization,
  useUpload as useUploadUtils
} from '@vcp/shared'
import type {
  AjaxRequestError,
  UploadFinishParams,
  UploadParams
} from '@vcp/shared/lib/slice-upload-utils'
import { mergeBaseURL } from 'vc-material'
import type { UnwrapRef } from 'vue'

import type { CustomFileItem } from '@/stores/modules/taskCenter'

type Chunks = UnwrapRef<ReturnType<typeof useUploadUtils>['chunks']>
export type fileListMap = WeakMap<CustomFileItem, Chunks>

// let messageInstance: any

export function useTaskUpload(
  fileList: (CustomFileItem | null)[],
  index: number,
  fileListMap: fileListMap
) {
  const currentFileItem = computed(() => fileList[index])

  const fileItemParams = computed(
    () => currentFileItem.value?.params || ({} as CustomFileItem['params'])
  )

  // token
  const Authorization = getAuthorization()

  // 上传地址
  const uploadUrl = (params: UploadParams) => {
    const upload_id = currentFileItem.value?.upload_id
    if (!upload_id) return ''

    const bucket_id = fileItemParams.value.bucket_id

    const idx = params.index + 1
    return mergeBaseURL(
      `/v1/objects/multipart/piece_form/${bucket_id}/${upload_id}/${idx}`,
      baseURL
    )
  }

  // 获取切片上传参数
  const getParams = (params: UploadParams) => {
    const formData = new FormData()
    formData.append('file', params.chunk)
    formData.append('key', fileItemParams.value.key || '')
    return formData
  }

  let finishFn: any
  let errorFn: any
  let progressFn: any

  const setOnFinish = (cb: (params: UploadFinishParams) => any) =>
    (finishFn = cb)
  const setOnError = (cb: (...args: any[]) => any) => (errorFn = cb)
  const setOnProgress = (cb: (percent: number) => void) => (progressFn = cb)

  // 错误处理
  const onError = (err: Error | AjaxRequestError) => {
    if (!currentFileItem.value || currentFileItem.value?.status === 'cancel')
      return
    // @ts-ignore
    // const status = err?.status as number
    // let msg = '上传失败'
    // // 接口给报错信息
    // if (isNil(status)) msg = err?.message

    // messageInstance && messageInstance.close()
    // messageInstance = Message.error(msg || '上传失败')
    console.warn(err?.message)
    errorFn?.()
  }
  // 上传完成
  const onFinish = (params: UploadFinishParams) => {
    if (!currentFileItem.value) return
    finishFn?.(params)
  }

  // 单个切片上传成功处理函数
  const chunkUploadSuccess = (
    params: UploadParams,
    data?: { etag: string }
  ) => {
    if (!currentFileItem.value) {
      console.error('当前文件不存在')
      return false
    }
    const etag = data?.etag
    if (!etag) {
      // Message.error('etag不存在')
      console.error('etag不存在')
      return false
    }
    currentFileItem.value.etags[params.index] = etag
    return true
  }

  // 上传前校验，可以跳过进度
  const preVerifyRequest = async () => {
    if (!currentFileItem.value) throw new Error("currentFileItem doesn't exist")

    const chunks = fileListMap.get(currentFileItem.value) || []
    if (!chunks.length || !currentFileItem.value.etags.length) return false
    const hashList = chunks
      .filter((_, index) => !!currentFileItem.value?.etags?.[index])
      .filter(item => item.status === 'success' && item.progress === 100)
      .map(item => item.chunkHash)
    return hashList
  }

  const result = useUploadUtils({
    chunkSize: 5 * 1024 * 1024,
    uploadUrl,
    Authorization,
    getParams,
    onError,
    onFinish,
    preVerifyRequest,
    chunkUploadSuccess
  })

  watch(result.progress, progress => {
    progressFn?.(progress)
  })

  watchEffect(() => {
    if (!currentFileItem.value) return
    fileListMap.set(currentFileItem.value, result.chunks.value)
  })

  return reactive({ ...result, setOnFinish, setOnError, setOnProgress })
}
