export const CONF_MAP: Record<number, string> = {
  1: '用户注册',
  2: '基础配置',
  3: 'SEO站内优化',
  4: '联系方式',
  5: '协议配置',
  6: '邮箱配置',
  7: '域名配置',
  8: '关于我们'
}

export const DEFAULT_PASSWORD = 'abcd.1234'

export enum RoleEnum {
  // 超级管理员
  SUPER = 1,
  // 2.普通管理员
  ADMIN = 2,
  //  3.运营
  OPERATIONS = 3,
  //  4.客服
  CUSTOMER_SERVICE = 4
}

export const RoleLabelMap: Record<number, string> = {
  1: '超级管理员',
  2: '普通管理员',
  3: '运营',
  4: '客服'
}

export const HOME_PATH = (role: number) => {
  return {
    1: '/overview',
    2: '/overview',
    3: '/operation/notification',
    4: '/customer-service/work-record'
  }[role]
}

export const DEV_SUB_PORT_MAP: Record<string, number> = {
  dns: 10011,
  ssl: 10012,
  cdn: 10013,
  oss: 10014,
  mts: 10015
}

export const APP_TITLE = import.meta.env.VITE_APP_TITLE

export const isDev = import.meta.env.DEV

const { protocol, hostname, origin } = window.location
export const getMicroAppUrl = (appName: string) => {
  if (isDev) {
    return `${protocol}/${hostname}:${DEV_SUB_PORT_MAP[appName]}`
  }
  return `${origin}/${appName}`
}
