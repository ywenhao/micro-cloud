import type { AxiosResponse, Method } from 'axios'

import type { Result } from './types'

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) return restful ? '' : {}
  const now = new Date().getTime()
  if (restful) return `?_t=${now}`
  return { _t: now }
}
/**
 * 将对象作为参数添加到URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters
}

export class AjaxRequestError extends Error {
  name = 'AjaxRequestError'
  httpStatus: number
  code?: number
  method: Method
  url: string
  message: string

  // eslint-disable-next-line prettier/prettier
  constructor({
    message,
    httpStatus,
    code,
    method,
    url
  }: {
    message: string
    httpStatus: number
    code?: number
    method: Method
    url: string
  }) {
    super(message)
    this.message = message
    this.code = code
    this.httpStatus = httpStatus
    this.method = method
    this.url = url
  }
}

export function getRequestError(res: AxiosResponse<Result>, message?: string) {
  return new AjaxRequestError({
    message: message || res.data?.message || '请求错误，请稍候重试',
    httpStatus: res.status,
    code: res.data?.code,
    method: res.config.method as Method,
    url: res.config.url!
  })
}

/**
 * @description: 创建单例
 */
export function singleton<T extends new (...args: any) => any>(
  classInstance: T
): T {
  let instance: T
  return new Proxy(classInstance, {
    construct(target, args) {
      if (!instance) {
        instance = new target(...args)
      }
      return instance
    }
  }) as T
}
