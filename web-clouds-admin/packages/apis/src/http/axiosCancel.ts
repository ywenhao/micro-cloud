import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'

let pendingMap = new Map<string, Canceler>()

export const getPendingUrl = (config: AxiosRequestConfig) =>
  [config.method, config.url].join('&')

export class AxiosCanceler {
  /**
   * 添加请求
   * @param {Object} config
   */
  addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getPendingUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken(cancel => {
        if (!pendingMap.has(url)) {
          // 如果没有挂起的当前请求，添加
          pendingMap.set(url, cancel)
        }
      })
  }

  /**
   * @description: 清除所有挂起
   */
  removeAllPending() {
    pendingMap.forEach(cancel => {
      cancel && typeof cancel === 'function' && cancel()
    })
    pendingMap.clear()
  }

  /**
   * 清除请求
   * @param {Object} config
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      // 如果存在当前请求标识符，需要取消并删除当前请求
      const cancel = pendingMap.get(url)
      cancel && cancel(url)
      pendingMap.delete(url)
    }
  }

  /**
   * @description: 重置
   */
  reset(): void {
    pendingMap = new Map<string, Canceler>()
  }
}
