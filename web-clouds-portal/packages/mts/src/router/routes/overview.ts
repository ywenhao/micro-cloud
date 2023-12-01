import type { RouteRecordRaw } from 'vue-router'

/**概览 */
const routes: RouteRecordRaw[] = [
  {
    path: '/overview',
    name: 'Overview',
    meta: {
      title: '概览',
      hasSideBar: true,
      currentActive: 'Overview'
    },
    component: () => import('@/views/overview/IndexView.vue')
  }
]

export default routes
