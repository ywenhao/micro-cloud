import Cookies from 'js-cookie'

/** token name */
export const tokenName = 'token'

/**
 * 获取token
 * @returns
 */
export function getToken() {
  return Cookies.get(tokenName)
}
