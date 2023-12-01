import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import type { RequestOptions, Result } from './types'
export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}
export abstract class AxiosTransform {
  /**
   * @description: 请求前 配置
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => any

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (
    config: Partial<AxiosRequestConfig>,
    options: CreateAxiosOptions
  ) => AxiosRequestConfig

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (
    axiosInstance: AxiosResponse,
    error: Error
  ) => void
}
