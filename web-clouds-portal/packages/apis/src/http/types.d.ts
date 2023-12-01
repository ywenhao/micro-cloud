export type ErrorMessageMode = 'none' | 'notification' | 'message' | undefined
export type SuccessMessageMode = ErrorMessageMode

export interface RetryRequest {
  isOpenRetry: boolean
  count: number
  waitTime: number
}

export interface RequestOptions {
  // 将请求参数拼接到url
  joinParamsToUrl?: boolean
  // 格式化请求参数时间
  formatDate?: boolean
  // 是否处理请求结果
  isTransformResponse?: boolean
  // 是否返回响应标头
  // 当需要获取响应标头时，请使用此属性
  isReturnNativeResponse?: boolean
  // 是否加入url
  joinPrefix?: boolean
  // 接口地址，如果保留为空，则使用默认apiUrl
  apiUrl?: string
  // 请求拼接路径
  urlPrefix?: string
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode
  // 成功消息提示类型
  successMessageMode?: SuccessMessageMode
  // 是否添加时间戳
  joinTime?: boolean
  ignoreCancelToken?: boolean
  // 是否添加令牌
  withToken?: boolean
  // 请求重试机制
  retryRequest?: RetryRequest
}

export interface Result<T = any> {
  code?: number
  message?: string
  reason?: string
  data: T
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // 其他参数
  data?: Record<string, any>
  // 文件参数接口字段名
  name?: string
  // file
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}
