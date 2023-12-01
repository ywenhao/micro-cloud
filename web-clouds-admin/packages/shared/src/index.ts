import { SingleApis } from '@vca/apis'
import type { AdminModel, ProductModel } from '@vca/apis/pedestal'
import Cookies from 'js-cookie'
import type { Pinia } from 'pinia'
import { setupDirectives } from 'vc-material'
import type { App } from 'vue'
import type { Router } from 'vue-router'

export type MicroAppData = {
  token: string | undefined
  signOut: () => void
  productList: ProductModel[]
  adminInfo: AdminModel | undefined
  pedestalRouter: Router
  productName?: string
}

export function getEnvName(upperCase: boolean = false) {
  const { MODE } = import.meta.env

  return upperCase ? MODE.toUpperCase() : MODE
}

export const tokenName = `__VCLOUD__${getEnvName(true)}__TOKEN__`

export type SubAppBootstrapOptions = {
  app: App<Element>
  router: Router
  store: Pinia
  baseURL?: string
}
export function subAppBootstrap(options: SubAppBootstrapOptions): MicroAppData {
  // 返回主应用下发的data数据
  // @ts-ignore
  const getData = () => (window.microApp.getData() || {}) as MicroAppData
  const data = getData()
  if (data?.token) {
    Cookies.set(tokenName, data?.token || '', { sameSite: 'lax' })
  }

  const { app, router, store, baseURL } = options

  SingleApis.init({ baseURL }, () => {
    getData().signOut?.()
  })

  router.beforeEach(to => {
    // 不用登录的页面
    if (to.meta.ignoreAuth) {
      return true
    }
    const token = Cookies.get(tokenName)
    // console.log({ token })
    if (!token && to.path !== '/sign-in') {
      return `/sign-in`
    }
  })

  // @ts-ignore
  const appName = window.__MICRO_APP_NAME__

  if (getEnvName() !== 'production') {
    console.log(
      `%c子产品: ${appName}; 环境: ${getEnvName()}`,
      `display: inline-block;
       border: 2px solid #94bfff;
       background: #94bfff;
       color: #2253e6;
       border-radius: 4px;
       padding: 10px;
       margin: 20px;\n`
    )
  }

  app.use(store)
  setupDirectives(app)
  app.use(router)

  app.mount('#app')

  return data
}

export function getAppName(upperCase: boolean = false) {
  // @ts-ignore
  const appName = window.__MICRO_APP_NAME__ as string

  return upperCase ? appName.toUpperCase() : appName
}

export * from './components'
export * from './hooks'
export * from './SubAppLayout'
export * from './utils'
