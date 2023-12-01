import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dns',
    meta: { title: '云解析DNS' },
    redirect: { name: 'DomainResolve' },
    children: [
      {
        path: '/resolve/:groupId?',
        name: 'DomainResolve',
        meta: {
          keepAlive: true,
          title: '域名解析',
          hasSideBar: true,
          currentActive: 'DomainResolve'
        },
        component: () => import('@/views/DomainResolve.vue')
      },
      {
        path: '/resolve/info/:id',
        name: 'DomainResolveInfo',
        meta: {
          title: '解析设置',
          hasSideBar: true,
          currentActive: 'DomainResolve'
        },
        component: () => import('@/views/DomainResolveInfo.vue')
      },
      {
        path: '/resolve/batch-add',
        name: 'DomainBatchAdd',
        meta: {
          title: '批量操作',
          hasSideBar: true,
          currentActive: 'DomainResolve'
        },
        component: () => import('@/views/DomainBatchAdd.vue')
      },
      {
        path: '/group',
        name: 'DomainGroup',
        meta: {
          title: '域名分组',
          hasSideBar: true,
          currentActive: 'DomainGroup'
        },
        component: () => import('@/views/DomainGroup.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: { hasSideBar: true, title: '404' },
    component: () => import('../../../../shared/components/NotFound.vue')
  }
]
