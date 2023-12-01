import type { RouteRecordRaw } from 'vue-router'

/**任务 */
const routes: RouteRecordRaw[] = [
  {
    path: '/task',
    name: 'Task',
    meta: {
      keepAlive: true,
      title: '任务',
      hasSideBar: true,
      currentActive: 'Task'
    },
    component: () => import('@/views/task/IndexView.vue')
  },
  {
    path: '/task/detail/:id',
    name: 'TaskDetail',
    meta: {
      title: '任务详情',
      hasSideBar: true,
      currentActive: 'Task'
    },
    component: () => import('@/views/task/DetailView.vue')
  },
  {
    path: '/task/add/:regionId',
    name: 'TaskAdd',
    meta: {
      title: '添加任务',
      hasSideBar: true,
      currentActive: 'Task'
    },
    component: () => import('@/views/task/AddView.vue')
  }
]

export default routes
