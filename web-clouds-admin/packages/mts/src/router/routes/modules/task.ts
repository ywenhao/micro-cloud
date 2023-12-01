import type { RouteRecordRaw } from 'vue-router'

/** 任务管理 */
const routes: RouteRecordRaw[] = [
  {
    path: '/task',
    name: 'Task',
    redirect: { name: 'TaskManage' },
    meta: { title: '任务管理' },
    children: [
      {
        path: 'manage',
        name: 'TaskManage',
        meta: { title: '任务', keepAlive: true },
        component: () => import('@/views/task/manage')
      },
      {
        path: 'trigger',
        name: 'TaskTrigger',
        meta: { title: '任务触发器', keepAlive: true },
        component: () => import('@/views/task/trigger')
      },
      {
        path: 'workflow',
        name: 'TaskWorkflow',
        meta: { title: '工作流', keepAlive: true },
        component: () => import('@/views/task/workflow')
      },
      {
        path: 'queue',
        name: 'TaskQueue',
        meta: { title: '队列管理' },
        component: () => import('@/views/task/queue')
      },
      {
        path: 'manage/detail/:id',
        name: 'TaskManageDetail',
        meta: { title: '任务详情', currentActive: 'TaskManage' },
        component: () => import('@/views/task/manage/DetailView.vue')
      },
      {
        path: 'trigger/detail/:id',
        name: 'TaskTriggerDetail',
        meta: { title: '任务触发器详情', currentActive: 'TaskTrigger' },
        component: () => import('@/views/task/trigger/DetailView.vue')
      },
      {
        path: 'workflow/detail/:id',
        name: 'TaskWorkflowDetail',
        meta: { title: '工作流详情', currentActive: 'TaskWorkflow' },
        component: () => import('@/views/task/workflow/DetailView.vue')
      }
    ]
  }
]

export default routes
