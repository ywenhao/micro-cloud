import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { SingleApis } from '@vcp/apis'
import type { ProductInfoModel, UserInfoModel } from '@vcp/apis/pedestal'
import type { Pinia } from 'pinia'
import { setupDirectives } from 'vc-material'
import type { App } from 'vue'
import type { Router } from 'vue-router'

export type MicroAppData = {
  token: string | undefined
  signOut: () => void
  userInfo: UserInfoModel
  productList: ProductInfoModel[]
  pedestalRouter: Router
}

export function getEnvName(upperCase: boolean = false) {
  const { MODE } = import.meta.env
  return upperCase ? MODE.toUpperCase() : MODE
}

export type SubAppBootstrapOptions = {
  app: App<Element>
  router: Router
  store: Pinia
  baseURL?: string
}
export function subAppBootstrap(options: SubAppBootstrapOptions) {
  const { app, router, store, baseURL } = options

  // @ts-ignore
  const getData = () => (window.microApp?.getData() || {}) as MicroAppData

  SingleApis.init({ baseURL }, () => {
    getData().signOut?.()
  })

  // @ts-ignore
  const appName = window.__MICRO_APP_NAME__

  if (getEnvName() !== 'production') {
    // eslint-disable-next-line no-console
    console.log(
      `%c子产品: ${appName}; 环境: ${getEnvName()}`,
      `display: inline-block;
       border: 2px solid #94bfff;
       background: #94bfff;
       color: #2253e6;
       border-radius: 4px;
       padding: 10px;
       margin: 20px;`
    )
  }

  app.use(store)
  setupDirectives(app)
  app.use(router)
  app.use(ArcoVueIcon)

  app.mount('#app')
}

export function getAppName(upperCase: boolean = false) {
  // @ts-ignore
  const appName = window.__MICRO_APP_NAME__ as string

  return upperCase ? appName.toUpperCase() : appName
}
