import Cookies from 'js-cookie'

const MODE = import.meta.env.MODE

/** token name */
export const tokenName = `__VCLOUD__${MODE.toUpperCase()}__TOKEN__`

/**
 * 获取token
 * @returns
 */
export function getToken() {
  return Cookies.get(tokenName)
}
