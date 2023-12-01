import 'virtual:uno.css'
import 'virtual:svg-icons-register'
// import 'vc-material/theme-chalk/src/base/var.less'
// import 'vc-material/theme-chalk/src/base/reset.less'
import 'vc-material/theme-chalk/src/vcloud.less'

import type { SubAppBootstrapOptions } from '@vcp/shared'
import { baseURL } from '@vcp/shared'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'

const app = createApp(App)

const initConfig: SubAppBootstrapOptions = {
  app,
  store,
  router,
  baseURL
}
subAppBootstrap(initConfig)
