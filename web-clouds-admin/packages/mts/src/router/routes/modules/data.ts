import type { RouteRecordRaw } from 'vue-router'

/** 数据统计 */
const routes: RouteRecordRaw[] = [
  {
    path: '/data',
    name: 'Data',
    redirect: { name: 'DataTask' },
    meta: { title: '数据统计' },
    children: [
      {
        path: 'task',
        name: 'DataTask',
        meta: { title: '任务处理统计' },
        component: () => import('@/views/data/task')
      },
      {
        path: 'active-users',
        name: 'DataActiveUsers',
        meta: { title: '活跃用户统计' },
        component: () => import('@/views/data/active-users')
      }
    ]
  }
]

export default routes
