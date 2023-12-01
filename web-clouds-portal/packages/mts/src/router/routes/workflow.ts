import type { RouteRecordRaw } from 'vue-router'

/**工作流 */
const routes: RouteRecordRaw[] = [
  {
    path: '/workflow',
    name: 'Workflow',
    meta: {
      keepAlive: true,
      title: '工作流',
      hasSideBar: true,
      currentActive: 'Workflow'
    },
    component: () => import('@/views/workflow/IndexView.vue')
  },
  {
    path: '/workflow/detail/:id',
    name: 'WorkflowDetail',
    meta: {
      title: '工作流详情',
      hasSideBar: true,
      currentActive: 'Workflow'
    },
    component: () => import('@/views/workflow/DetailView.vue')
  },
  {
    path: '/workflow/add/:regionId',
    name: 'WorkflowAdd',
    meta: {
      title: '新建工作流',
      hasSideBar: true,
      currentActive: 'Workflow'
    },
    component: () => import('@/views/workflow/AddView.vue')
  },
  {
    path: '/workflow/edit/:regionId/:id',
    name: 'WorkflowEdit',
    meta: {
      title: '编辑工作流',
      hasSideBar: true,
      currentActive: 'Workflow'
    },
    component: () => import('@/views/workflow/AddView.vue')
  }
]

export default routes
