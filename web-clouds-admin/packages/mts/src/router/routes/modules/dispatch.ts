import type { RouteRecordRaw } from 'vue-router'

/** 调度管理 */
const routes: RouteRecordRaw[] = [
  {
    path: '/dispatch',
    name: 'Dispatch',
    meta: { title: '调度管理' },
    redirect: { name: 'DispatchNode' },
    children: [
      {
        path: 'node',
        name: 'DispatchNode',
        meta: { title: '节点管理' },
        component: () => import('@/views/dispatch/node')
      },
      {
        path: 'node-task',
        name: 'DispatchNodeTask',
        meta: { title: '节点任务' },
        component: () => import('@/views/dispatch/node-task')
      },
      {
        path: 'version',
        name: 'DispatchVersion',
        meta: { title: '版本管理' },
        component: () => import('@/views/dispatch/version')
      }
    ]
  }
]

export default routes
