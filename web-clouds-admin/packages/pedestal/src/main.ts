import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import './styles/global.less'
import 'vc-material/theme-chalk/src/vcloud.less'

import microApp from '@micro-zoe/micro-app'
import { SingleApis } from '@vca/apis'
import { baseURL } from '@vca/shared'
import { setupDirectives } from 'vc-material'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'

SingleApis.init({ baseURL }, async () => {
  useAppStore().clearLoginInfo()
})

microApp.start({
  lifeCycles: {
    created(e) {
      console.log('created', e)
    },
    beforemount(e) {
      console.log('beforemount', e)
    },
    mounted(e) {
      console.log('mounted', e)
    },
    unmount(e) {
      console.log('unmount', e)
    },
    error(e) {
      console.log('error', e)
    }
  }
})

// if (isDev) {
//   const apps = Object.keys(DEV_SUB_PORT_MAP).map(app => {
//     return {
//       name: app,
//       url: getMicroAppUrl(app)
//     }
//   })
//   microApp.preFetch(apps)
// }
const app = createApp(App)
app.use(store)
app.use(router)
setupDirectives(app)
app.mount('#app')
