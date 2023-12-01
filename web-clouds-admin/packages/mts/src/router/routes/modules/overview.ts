import type { RouteRecordRaw } from 'vue-router'

/** 首页概览 */
const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Overview',
    meta: { title: '概览' },
    component: () => import('@/views/overview')
  }
]

export default routes
