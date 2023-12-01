import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import 'vc-material/theme-chalk/src/vcloud.less'

import {
  baseURL,
  subAppBootstrap,
  type SubAppBootstrapOptions
} from '@vcp/shared'
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
