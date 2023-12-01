import 'virtual:uno.css'
import 'virtual:svg-icons-register'
// import 'vc-material/theme-chalk/src/base/var.less'
// import 'vc-material/theme-chalk/src/base/reset.less'
import 'vc-material/theme-chalk/src/vcloud.less'
import './style/index.less'

import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import microApp from '@micro-zoe/micro-app'
import { SingleApis } from '@vcp/apis'
import { baseURL } from '@vcp/shared'
import { setupDirectives } from 'vc-material'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'

SingleApis.init({ baseURL }, () => {
  const appStore = useAppStore()
  appStore.signOut()
})

microApp.start({
  // disableScopecss: true
})
const app = createApp(App)

app.use(ArcoVueIcon)
app.use(store)
app.use(router)
setupDirectives(app)

app.mount('#app')
