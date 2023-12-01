import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { cloneDeep } from 'lodash-es'
import qs from 'qs'

import { AxiosCanceler } from './axiosCancel'
import type { CreateAxiosOptions } from './axiosTransform'
import { ContentTypeEnum, RequestEnum } from './httpEnum'
import type { RequestOptions, Result, UploadFileParams } from './types'

const isFn = (val: any): boolean => typeof val === 'function'

export class AppAxios {
  private instance: AxiosInstance
  private options: CreateAxiosOptions
  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.instance = axios.create(this.options)
    this.setupInterceptors()
  }

  mergeOptions(options: CreateAxiosOptions) {
    Object.assign(this.options, options)
    this.instance = axios.create(this.options)
    this.setupInterceptors()
  }

  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) return
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform
    const axiosCanceler = new AxiosCanceler()
    // 请求拦截器配置处理
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 如果取消重复请求已打开，则禁止取消重复请求
        // @ts-ignore
        const { ignoreCancelToken } = config.requestOptions
        const ignoreCancel =
          ignoreCancelToken !== undefined
            ? ignoreCancelToken
            : this.options.requestOptions?.ignoreCancelToken

        !ignoreCancel && axiosCanceler.addPending(config)
        if (requestInterceptors && isFn(requestInterceptors)) {
          config = requestInterceptors(
            config,
            this.options
          ) as InternalAxiosRequestConfig
        }
        return config
      },
      undefined
    )
    // 请求拦截器错误捕获
    requestInterceptorsCatch &&
      isFn(requestInterceptorsCatch) &&
      this.instance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      )

    // 响应结果拦截器处理
    this.instance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFn(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    })

    // 响应结果拦截器错误捕获
    responseInterceptorsCatch &&
      isFn(responseInterceptorsCatch) &&
      this.instance.interceptors.response.use(undefined, error => {
        // @ts-ignore
        return responseInterceptorsCatch(this.instance, error)
      })
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach(key => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach(item => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data![key])
      })
    }

    return this.instance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true
      }
    })
  }

  // support form-data
  supportFormData(url: string, config: Partial<AxiosRequestConfig> = {}) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }

    return {
      ...config,
      url,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' })
    }
  }

  get<T = any>(
    url: string,
    config: Partial<AxiosRequestConfig> = {},
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, url, method: 'GET' }, options)
  }

  post<T = any>(
    url: string,
    config: Partial<AxiosRequestConfig> = {},
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, url, method: 'POST' }, options)
  }

  put<T = any>(
    url: string,
    config: Partial<AxiosRequestConfig> = {},
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, url, method: 'PUT' }, options)
  }

  delete<T = any>(
    url: string,
    config: Partial<AxiosRequestConfig> = {},
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, url, method: 'DELETE' }, options)
  }

  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config)
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options)

    const { beforeRequestHook, requestCatchHook, transformResponseHook } =
      transform || {}
    if (beforeRequestHook && isFn(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }

    conf.requestOptions = opt
    conf = this.supportFormData(conf?.url ?? '', conf)

    return new Promise((resolve, reject) => {
      this.instance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseHook && isFn(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFn(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e)
        })
    })
  }

  private getTransform() {
    const { transform } = this.options
    return transform
  }
}
