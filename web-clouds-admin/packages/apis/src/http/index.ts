// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { Message, Notification } from '@arco-design/web-vue'
import { getToken } from '@vca/shared'
import { useUserAgent } from '@vca/shared/src/hooks/useUserAgent'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import {
  clone,
  cloneDeep,
  isEmpty,
  isNull,
  isObject,
  isString,
  isUndefined
} from 'lodash-es'

import { AppAxios } from './Axios'
import { AxiosRetry } from './axiosRetry'
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform'
import {
  getRequestError,
  joinTimestamp,
  setObjToUrlParams,
  singleton
} from './helper'
import { ContentTypeEnum, RequestEnum, ResultEnum } from './httpEnum'
// import { AppAxios } from './Axios'
// import { checkStatus } from './checkStatus'
import type { RequestOptions, Result } from './types'

const userAgentObj = useUserAgent()

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const createTransform = (apisInstance: Apis): AxiosTransform => ({
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options
    if (res.status !== 200) {
      const msg = '请求错误，请稍候重试'
      Message.error(msg)
      throw getRequestError(res, msg)
    }

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }

    if (!res.data) {
      // return '[HTTP] Request has no return value';
      throw getRequestError(res, '请求错误，请稍候重试')
    }

    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, message: msg } = res.data
    // 这里逻辑可以根据项目进行修改
    const hasSuccess = res.status === 200 && code === ResultEnum.SUCCESS
    // data && Reflect.has(res.data, 'code') && code === ResultEnum.SUCCESS

    if (hasSuccess) {
      let successMsg = msg

      if (
        isNull(successMsg) ||
        isUndefined(successMsg) ||
        isEmpty(successMsg)
      ) {
        successMsg = '操作成功'
      }

      if (options.successMessageMode === 'notification') {
        Notification.success({ title: '成功提示', content: successMsg })
      } else if (options.successMessageMode === 'message') {
        Message.success(successMsg)
      }

      return isTransformResponse ? res.data.data : res.data
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let errorMsg = ''
    switch (code) {
      case ResultEnum.UNAUTHORIZED: {
        Message.clear()
        errorMsg = '当前用户没有登录或者登录已失效，请重新登录'
        apisInstance.unauthorizedHook()
        break
      }
      default:
        if (msg) errorMsg = msg
    }

    if (!errorMsg) errorMsg = '请求出错，请稍候重试'

    // errorMessageMode='notification'的时候会显示notification错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示

    if (options.errorMessageMode === 'notification') {
      Notification.error({ title: '成功提示', content: errorMsg })
    } else if (options.errorMessageMode === 'message') {
      Message.error(errorMsg)
    }
    throw getRequestError(res, errorMsg)
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      joinTime = true,
      urlPrefix
    } = options

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    // formatDate && data && !isString(data) && formatRequestDate(data)
    const method = config.method?.toUpperCase()
    const isDeleteParams = method && !config.data && !!config.params
    if (method === RequestEnum.GET || isDeleteParams) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        // config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 ||
            config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data)
          )
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (
    config: Record<string, any>,
    options: CreateAxiosOptions
  ) => {
    // 请求之前处理config
    const token = getToken()
    if (token && config?.requestOptions?.withToken !== false) {
      // jwt token
      config!.headers!.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token
    }
    // 自定义header
    config!.headers['x-ua-platform-name'] = `${userAgentObj.osName}`
    config!.headers['x-ua-platform-version'] = `${userAgentObj.osVersion}`
    config!.headers['x-ua-name'] = `${userAgentObj.browserName}`
    config!.headers['x-ua-version'] = `${userAgentObj.browserVersion}`
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosResponse, error: any) => {
    // const { response, code, message, config } = error || {}
    const { code, message, config } = error || {}
    // const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    // const msg: string = response?.data?.error?.message ?? ''

    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    if (message === 'Request aborted') {
      return Promise.reject(error)
    }

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = '网络请求超时,请刷新页面重试!'
      }
      if (err?.includes('Network Error') || message.includes('404')) {
        errMessage = '网络异常，请检查您的网络连接是否正常!'
      }

      // if (errMessage) {
      //   if (errorMessageMode === 'notification') {
      //     Notification.closeAll()
      //     Notification.error({ title: '提示', message: errMessage })
      //   } else if (errorMessageMode === 'message') {
      //     Message.error(errMessage)
      //   }
      //   return Promise.reject(error)
      // }

      Message.error(errMessage)
    } catch (error) {
      throw getRequestError(axiosInstance, String(error))
    }

    // checkStatus(error?.response?.status, msg, errorMessageMode)

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry()
    const { isOpenRetry } = config.requestOptions.retryRequest
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error)
    return Promise.reject(error)
  }
})

// 深度合并
export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  const res: any = cloneDeep(src)
  for (key in target) {
    res[key] = isObject(res[key])
      ? deepMerge(res[key], target[key])
      : (res[key] = target[key])
  }
  return res
}
function createAxios(
  apisInstance: Apis,
  opt: Partial<CreateAxiosOptions> = {}
) {
  return new AppAxios(
    // 深度合并
    deepMerge(
      {
        withCredentials: true,
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // Toke 前缀
        authenticationScheme: 'Bearer',
        timeout: 10 * 1000 * 9,
        // 基础接口地址
        // baseURL: '',
        headers: {
          'Content-Type': ContentTypeEnum.JSON
        },
        validateStatus: () => true,
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(createTransform(apisInstance)),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          // apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: '',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            // 是否打开重试
            isOpenRetry: false,
            count: 5,
            waitTime: 100
          }
        }
      },
      opt || {}
    )
  )
}

type ApisOptions = Partial<CreateAxiosOptions>

export class Apis {
  unauthorizedHook: () => void = () => {}
  defHttp = createAxios(this)

  constructor() {}

  init(options: ApisOptions, unauthorizedHook: () => void = () => {}) {
    this.unauthorizedHook = unauthorizedHook
    this.defHttp.mergeOptions(options)
  }
}

export * from './httpEnum'

/**
 * 单例模式Apis
 */
const singleApis = singleton(Apis)

export const SingleApis = new singleApis()

export const defHttp = SingleApis.defHttp
