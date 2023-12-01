/* eslint-disable */
/* prettier-ignore */

import * as vue from 'vue';
import { Ref } from 'vue'

interface RequestProgressEvent extends ProgressEvent {
  percent: number
}
type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
type RequestHeaders =
  | Headers
  | Record<string, string | number | null | undefined>
interface AjaxRequestOptions {
  url: string
  method: RequestMethod
  timeout?: number
  data: XMLHttpRequestBodyInit | FormData
  responseType?: XMLHttpRequestResponseType
  headers?: RequestHeaders
  readystatechange?: () => void
  onLoadstart?: () => void
  onLoad?: () => void
  onAbort?: (evt: AjaxRequestError) => void
  onError: (evt: AjaxRequestError) => void
  onUploadProgress?: (evt: RequestProgressEvent) => void
  onDownloadProgress?: (evt: RequestProgressEvent) => void
  onSuccess: (response: any) => void
  withCredentials: boolean
}
type RequestStatus =
  | 'ready'
  | 'downloading'
  | 'uploading'
  | 'success'
  | 'error'
  | 'pause'
  | 'cancel'
interface CustomXHR extends XMLHttpRequest {
  request: () => void
}
type AjaxRequestHandler = (options: AjaxRequestOptions) => CustomXHR
declare class AjaxRequestError extends Error {
  name: string
  status: number
  method: string
  url: string
  constructor(message: string, status: number, method: string, url: string)
}
declare const ajaxRequest: AjaxRequestHandler

interface FileChunkParams {
  /**
   * 上传源文件
   */
  file: File
  /**
   * 前置hash,预上传文件hash
   */
  preHash?: string
  /**
   * 是否计算前置真实hash
   */
  realChunkHash: boolean
  /**
   * 分片大小
   */
  chunkSize: number
}
interface FileChunk {
  /**
   * 分片
   */
  chunk: Blob
  /**
   * 下标
   */
  index: number
  /**
   * 分片hash
   */
  chunkHash: string
}
interface FileChunkResult {
  /**
   * 前置hash,预上传文件hash
   */
  preHash: string
  /**
   * 分片list
   */
  fileChunks: FileChunk[]
}
interface SliceUploadOptions {
  /**
   * 上传的文件
   */
  file?: File
  /**
   * 分片大小
   * @default 1024 * 1024 * 2
   */
  chunkSize?: number
  /**
   * 并发上传数
   * @default 3
   */
  poolCount?: number
  /**
   * 请求失败后，重试次数
   * @default 3
   */
  retryCount?: number
  /**
   * 请求失败后，重试间隔时间
   * @default 300
   */
  retryDelay?: number
  /**
   * 请求超时时间(15s)
   * @default 15000
   */
  timeout?: number
  /**
   * 计算整个文件的hash，开启后比较耗时间
   * @default false
   */
  realPreHash?: boolean
  /**
   * 计算分片文件的hash，开启后比较耗时间
   * @default false
   */
  realChunkHash?: boolean
}
/**
 * 分片hash参数
 */
interface HashChunksParams {
  file: File
  chunkSize: number
  realChunkHash: boolean
  realPreHash: boolean
}
type SliceUploadStatus = Exclude<RequestStatus, 'downloading'>
type SliceDownloadStatus = Exclude<RequestStatus, 'uploading'>

/**
 * 上传成功参数
 */
interface UploadFinishParams {
  file: File
  preHash: string
  filename: string
  chunkSize: number
  chunkTotal: number
}
interface UploadEventType {
  start: () => void
  finish: (params: UploadFinishParams) => void
  progress: (params: { progress: number }) => void
  error: (error: unknown) => void
  pause: () => void
  cancel: () => void
}
type UploadEventKey = keyof UploadEventType
interface DownloadFinishParams {
  file: File
  chunkSize: number
  chunkTotal: number
}
interface DownloadEventType {
  start: () => void
  finish: (params: DownloadFinishParams) => void
  progress: (params: { progress: number }) => void
  error: (error: unknown) => void
  pause: () => void
  cancel: () => void
}
type DownloadEventKey = keyof DownloadEventType

interface DownloadParams {
  start: number
  end: number
  index: number
  filename: string
  fileType: string
  chunkSize: number
  chunkTotal: number
}
interface SetDownloadFileOptions {
  filename?: string
  /**
   * 文件MIME类型
   * @default application/octet-stream
   * @see https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
   */
  fileType?: string
  fileSize?: number
}
type DownloadRequest = (params: DownloadParams) => Promise<false | File | Blob>
interface SliceDownloadOptions {
  fileSize?: number
  filename?: string
  /**
   * 文件MIME类型
   * @default application/octet-stream
   * @see https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
   */
  fileType?: string
  /**
   * 是否自动保存
   * @default true
   */
  autoSave?: boolean
  /**
   * 分片大小
   * @default 1024 * 1024 * 2
   */
  chunkSize?: number
  /**
   * 并发下载数
   * @default 3
   */
  poolCount?: number
  /**
   * 请求失败后，重试次数
   * @default 3
   */
  retryCount?: number
  /**
   * 请求失败后，重试间隔时间
   * @default 300
   */
  retryDelay?: number
  /**
   * 请求超时时间(15s)
   * @default 15000
   */
  timeout?: number
}
interface SliceDownloadFileChunk {
  file: Blob | File | null
  index: number
  start: number
  end: number
  status: SliceDownloadStatus
  progress: number
  retryCount: number
}
declare class SliceDownload {
  private autoSave
  private fileType
  private filename
  private chunkSize
  private poolCount
  private retryCount
  private retryDelay
  private timeout
  private fileSize
  private isCancel
  private isPause
  private events
  private currentRequestChunkIndex
  private sliceFileChunks
  private downloadRequestInstance
  private xhr
  constructor(options: SliceDownloadOptions)
  setFileOptions(options: SetDownloadFileOptions): void
  private check
  start(): Promise<void>
  /**
   * 取消下载
   */
  abort(): void
  /**
   * 暂停下载
   */
  pause(): void
  /**
   * 取消下载
   */
  cancel(): void
  private createPromiseList
  ajaxRequest<D = any>(options: RequestOptions): Promise<D>
  /**
   * 设置下载请求函数
   * @param request DownloadRequest
   * @returns
   */
  setDownloadRequest(request: DownloadRequest): this
  private _progress
  emitProgress(): void
  private emitFinish
  private initSliceFileChunks
  destroy(): void
  reset(): void
  on<Key extends DownloadEventKey>(
    eventName: Key,
    cb: DownloadEventType[Key]
  ): this
  off<Key extends DownloadEventKey>(
    eventName: Key,
    cb?: DownloadEventType[Key]
  ): this
  emit<Key extends DownloadEventKey>(
    eventName: Key,
    ...args: Parameters<DownloadEventType[Key]>
  ): this
  getData(): {
    chunks: {
      status: SliceDownloadStatus
      progress: number
      start: number
      end: number
      index: number
    }[]
  }
  private get stop()
  /**
   * 状态
   */
  get status(): SliceDownloadStatus
  /**
   * 下载总进度
   */
  get progress(): number
}
declare function defineSliceDownload(
  options: SliceDownloadOptions
): SliceDownload
/**
 * 文件合并
 * @param files 文件列表
 * @param filename 文件名
 * @param type 文件类型
 */
declare function mergeFile(
  files: (File | Blob)[],
  filename: string,
  type: string
): File
/**
 * 保存文件
 * @param file 文件
 * @param filename 文件名
 */
declare function saveFile(file: File | Blob, filename: string): void

interface UploadParams {
  chunk: File | Blob
  index: number
  chunkTotal: number
  preHash: string
  filename: string
  chunkHash: string
}
interface PreVerifyUploadParams {
  preHash: string
  filename: string
  chunkSize: number
  chunkTotal: number
}
type UploadRequest = (params: UploadParams) => Promise<boolean | void>
type PreVerifyUploadRequest = (
  params: PreVerifyUploadParams
) => Promise<string[] | boolean>
interface RequestOptions {
  url: string
  /**
   * @default 'POST'
   */
  method?: RequestMethod
  data: any
  headers?: RequestHeaders
  timeout?: number
  withCredentials?: boolean
}
interface SliceUploadFileChunk extends FileChunk {
  status: SliceUploadStatus
  progress: number
  retryCount: number
}
/**
 * 分片上传
 */
declare class SliceUpload {
  private file
  private poolCount
  private chunkSize
  private realPreHash
  private realChunkHash
  private retryCount
  private retryDelay
  private timeout
  private preHash
  private currentRequestChunkHash
  private sliceFileChunks
  private isCancel
  private isPause
  private events
  private uploadRequestInstance
  private preVerifyRequestInstance
  private xhr
  constructor(options?: SliceUploadOptions)
  /**
   * 设置上传文件(单个)
   * @param file
   * @returns
   */
  setFile(file: File): this
  on<Key extends UploadEventKey>(eventName: Key, cb: UploadEventType[Key]): this
  off<Key extends UploadEventKey>(
    eventName: Key,
    cb?: UploadEventType[Key]
  ): this
  emit<Key extends UploadEventKey>(
    eventName: Key,
    ...args: Parameters<UploadEventType[Key]>
  ): this
  reset(): void
  /**
   * 销毁事件
   */
  destroy(): void
  /**
   * 设置上传请求函数
   * @param request UploadRequest
   * @returns
   */
  setUploadRequest(request: UploadRequest): this
  ajaxRequest<D = any>(options: RequestOptions): Promise<D>
  /**
   * 设置上传前验证函数
   * @param request
   * @returns
   */
  setPreVerifyRequest(request: PreVerifyUploadRequest): this
  /**
   * 开始上传
   */
  start(): Promise<void>
  private emitFinish
  private createPromiseList
  private initSliceFileChunks
  private _progress
  emitProgress(): void
  /**
   * 取消上传
   */
  abort(): void
  /**
   * 暂停上传
   */
  pause(): void
  /**
   * 取消上传
   */
  cancel(): void
  findSliceFileChunk(chunkHash: string): SliceUploadFileChunk | undefined
  private check
  /**
   * 获取文件
   */
  getFile(): File | null
  /**
   * 获取分片，hash, file, chunks
   */
  getData(): {
    preHash: string | null
    file: File | null
    chunks: {
      status: SliceUploadStatus
      progress: number
      chunkHash: string
      index: number
    }[]
  }
  /**
   * 是否有文件
   */
  get hasFile(): boolean
  get isRealPreHash(): boolean
  get isRealChunkHash(): boolean
  private get stop()
  /**
   * 上传总进度
   */
  get progress(): number
  /**
   * 是否已经设置上传函数
   */
  get hasRequestInstance(): boolean
  /**
   * 状态
   */
  get status(): SliceUploadStatus
}
declare function defineSliceUpload(options?: SliceUploadOptions): SliceUpload

declare function getFileChunk(params: FileChunkParams): Promise<FileChunkResult>
/**
 * 获取文件分片
 * @param param0
 * @returns
 */
declare function getFileChunkWorker(
  params: FileChunkParams
): Promise<FileChunkResult>
/**
 * 获取文件分片,hash
 * @param param0
 * @returns
 */
declare function getHashChunks(
  params: HashChunksParams
): Promise<FileChunkResult>

/**
 * 计算文件hash
 * @param file 文件
 * @returns
 */
declare function getFileHash(file: File): Promise<string>
/**
 * 计算自定义文件hash
 * @param sourceHash 分片计算的hash
 * @param file 文件
 * @returns
 */
declare function getCustomFileHash(sourceHash: string, file: File): string
/**
 * 计算自定义分片hash
 * @param hash 主文件hash
 * @param chunkSize 分片大小
 * @param index 下标
 * @returns
 */
declare function getCustomChunkHash(
  hash: string,
  chunkSize: number,
  index?: number
): string

/**
 * 取得hash值
 * 大文件进行首尾拼接，计算hash值，小文件直接计算hash值
 * @param file 文件
 * @param chunkSize 分片大小
 */
declare function getPreHash(file: File, chunkSize: number): Promise<string>
declare function getPreFile(file: File, chunkSize: number): File
declare function getPreHashWorker(file: File): Promise<{
  hash: string
}>

interface SliceUploadChunk {
  status: SliceUploadStatus
  progress: number
  chunkHash: string
  index: number
}
interface UseSliceUploadOptions extends Omit<SliceUploadOptions, 'file'> {
  file: Ref<File | null | undefined>
  request: UploadRequest
  onError?: UploadEventType['error']
  onFinish?: UploadEventType['finish']
  preVerifyRequest?: PreVerifyUploadRequest
}
declare function useSliceUpload(options: UseSliceUploadOptions): {
  chunks: Ref<
    {
      status: SliceUploadStatus
      progress: number
      chunkHash: string
      index: number
    }[]
  >
  instance: SliceUpload
  isFinish: vue.ComputedRef<boolean>
  status: Readonly<Ref<SliceUploadStatus>>
  progress: Readonly<Ref<number>>
  start: () => Promise<void>
  pause: () => void
  cancel: () => void
  setRequest: (request: UploadRequest) => void
  ajaxRequest: (params: RequestOptions) => Promise<any>
}
interface SliceDownloadChunk {
  status: SliceDownloadStatus
  progress: number
  start: number
  end: number
  index: number
}
interface UseSliceDownloadOptions extends SliceDownloadOptions {
  request: DownloadRequest
  onError?: DownloadEventType['error']
  onFinish?: DownloadEventType['finish']
}
declare function useSliceDownload(options: UseSliceDownloadOptions): {
  chunks: Ref<
    {
      status: SliceDownloadStatus
      progress: number
      start: number
      end: number
      index: number
    }[]
  >
  instance: SliceDownload
  isFinish: vue.ComputedRef<boolean>
  status: Readonly<Ref<SliceDownloadStatus>>
  progress: Readonly<Ref<number>>
  start: () => void
  pause: () => void
  cancel: () => void
  setRequest: (request: DownloadRequest) => void
  ajaxRequest: (params: RequestOptions) => Promise<any>
  setFileOptions: (options: SetDownloadFileOptions) => void
}

export {
  AjaxRequestError,
  AjaxRequestHandler,
  AjaxRequestOptions,
  CustomXHR,
  DownloadEventKey,
  DownloadEventType,
  DownloadFinishParams,
  DownloadParams,
  DownloadRequest,
  FileChunk,
  FileChunkParams,
  FileChunkResult,
  HashChunksParams,
  PreVerifyUploadParams,
  PreVerifyUploadRequest,
  RequestHeaders,
  RequestMethod,
  RequestOptions,
  RequestProgressEvent,
  RequestStatus,
  SetDownloadFileOptions,
  SliceDownload,
  SliceDownloadChunk,
  SliceDownloadFileChunk,
  SliceDownloadOptions,
  SliceDownloadStatus,
  SliceUpload,
  SliceUploadChunk,
  SliceUploadFileChunk,
  SliceUploadOptions,
  SliceUploadStatus,
  UploadEventKey,
  UploadEventType,
  UploadFinishParams,
  UploadParams,
  UploadRequest,
  UseSliceDownloadOptions,
  UseSliceUploadOptions,
  ajaxRequest,
  defineSliceDownload,
  defineSliceUpload,
  getCustomChunkHash,
  getCustomFileHash,
  getFileChunk,
  getFileChunkWorker,
  getFileHash,
  getHashChunks,
  getPreFile,
  getPreHash,
  getPreHashWorker,
  mergeFile,
  saveFile,
  useSliceDownload,
  useSliceUpload
}
