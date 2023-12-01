/**
 * 获取 API 域名
 * @param url 当前页面的 URL
 * @returns Api 域名
 * @example
 * ```ts
 * const inputURL1 = 'https://axshare.com'
 * const result1 = apiDomain(inputURL1)
 * console.log(result1)
 *
 * const inputURL2 = 'https://4ha.axshare.com'
 * const result2 = apiDomain(inputURL2)
 * console.log(result2)
 *
 * const result3 = apiDomain()
 * console.log(result3)
 * ```
 */
export function apiDomain(url: string = window.location.href) {
  // 使用 URL 构造函数解析 URL
  const { protocol, hostname, port } = new URL(url || window.location.href)
  // 提取协议和主域名部分
  let domain = hostname
  // 删除主域名中的子域名部分（如果有）
  const parts = domain.split('.')
  // 有子域名 删除子域名
  if (parts.length > 2) {
    domain = parts.slice(-2).join('.')
  }
  // 组装 API URL
  const apiUrl = `${protocol}//api-admin.${domain}${port ? `:${port}` : ''}`
  // 去除所有空格
  return apiUrl.replace(/\s/g, '')
}

export const baseURL = import.meta.env.VITE_BASE_URL || apiDomain()
