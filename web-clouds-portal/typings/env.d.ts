/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 项目标题
  VITE_APP_TITLE: string
  // 基础请求url
  VITE_BASE_URL: string
  // 本地服务端口
  VITE_PORT: number
  // 是否删除控制台打印
  VITE_DROP_CONSOLE: boolean
  // 本地存储Key前缀
  VITE_STORE_PREFIX: string
  // 开启功能列表
  VITE_FEATURES: string
}
