import type { RouteRecordRaw } from 'vue-router'

/**任务触发器 */
const routes: RouteRecordRaw[] = [
  {
    path: '/trigger',
    name: 'Trigger',
    meta: {
      keepAlive: true,
      title: '任务触发器',
      hasSideBar: true,
      currentActive: 'Trigger'
    },
    component: () => import('@/views/trigger/IndexView.vue')
  },
  {
    path: 'trigger/detail/:id',
    name: 'TriggerDetail',
    meta: {
      title: '任务触发器详情',
      hasSideBar: true,
      currentActive: 'Trigger'
    },
    component: () => import('@/views/trigger/DetailView.vue')
  },
  {
    path: 'trigger/add/:regionId',
    name: 'TriggerAdd',
    meta: {
      title: '添加任务触发器',
      hasSideBar: true,
      currentActive: 'Trigger'
    },
    component: () => import('@/views/trigger/AddView.vue')
  }
]

export default routes
