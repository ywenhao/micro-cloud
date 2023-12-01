import type { RouteRecordRaw } from 'vue-router'

/**队列 */
const routes: RouteRecordRaw[] = [
  {
    path: '/queue',
    name: 'Queue',
    meta: {
      title: '队列',
      hasSideBar: true,
      currentActive: 'Queue'
    },
    component: () => import('@/views/queue/IndexView.vue')
  }
]

export default routes
