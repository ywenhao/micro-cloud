import { getAppName } from '@vcp/shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(`product/${getAppName()}`),
  routes: routes as unknown as RouteRecordRaw[],
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

export default router
