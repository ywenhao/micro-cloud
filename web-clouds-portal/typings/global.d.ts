import type {
  EventCenterForMicroApp,
  pureCreateElement,
  removeDomScope
} from '@micro-zoe/micro-app'

export {}

declare global {
  interface Window {
    [k: string]: any

    microApp: EventCenterForMicroApp & {
      removeDomScope: typeof removeDomScope
      pureCreateElement: typeof pureCreateElement
    }
    eventCenterForAppNameVite: any
    __MICRO_APP_NAME__: string
    microApp: any
    mount: CallableFunction
    unmount: CallableFunction
    __MICRO_APP_ENVIRONMENT__: string
  }

  interface AppRouteMeta extends Record<string | number | symbol, unknown> {
    // 路由title 一般必填
    title: string
    // 可以访问的角色，只在权限模式为Role的时候有效
    roles?: RoleEnum[]
    // 是否忽略KeepAlive缓存
    ignoreKeepAlive?: boolean
    // 图标，也是菜单图标
    icon?: string
    // 隐藏该路由在面包屑上面的显示
    hideBreadcrumb?: boolean
    // 隐藏所有子菜单
    hideChildrenInMenu?: boolean
    // 当前激活的菜单。用于配置详情页时左侧激活的菜单路径
    currentActive?: string
    // 当前路由不再标签页显示
    hideTab?: boolean
    // 当前路由不再菜单显示
    hideMenu?: boolean
    // 当前路由不显示布局
    hideLayout?: boolean
  }

  declare interface ViteEnv {
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
    // 开启图片压缩
    VITE_USE_IMAGEMIN: boolean

    VITE_ACCOUNT?: string
    VITE_PASSWORD?: string
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name?: string
    meta?: AppRouteMeta
    component?: Component | string
    components?: Component
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
  }

  type AppRouteModule = AppRouteRecordRaw

  interface LabelValue {
    label: string
    value: string | number
  }

  type ValidateCallback = (error: string) => void

  interface Strategies<T> {
    [k: string | number]: T
  }
}
