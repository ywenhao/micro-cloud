import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'UserDomain' }
  },
  {
    path: '/user-domain',
    name: 'UserDomain',
    meta: { title: '用户域名', keepAlive: true },
    component: () => import('@/views/user-domain/IndexView.vue')
  },
  {
    path: '/user-domain/info/:id',
    name: 'UserDomainResolveInfo',
    meta: {
      title: '解析设置',
      hasSideBar: true,
      currentActive: 'UserDomain'
    },
    component: () => import('@/views/DomainResolveInfo.vue')
  },
  {
    path: '/sys-domain',
    name: 'SysDomain',
    meta: { title: '系统域名', keepAlive: true },
    component: () => import('@/views/sys-domain/IndexView.vue')
  },
  {
    path: '/sys-domain/info/:id',
    name: 'SysDomainResolveInfo',
    meta: {
      title: '解析设置',
      hasSideBar: true,
      currentActive: 'SysDomain'
    },
    component: () => import('@/views/DomainResolveInfo.vue')
  },
  {
    path: '/dns-config',
    name: 'DnsConfig',
    meta: { title: 'DNS配置' },
    component: () => import('@/views/dns-config/IndexView.vue')
  },
  {
    path: '/version-manage',
    name: 'VersionManage',
    meta: { title: '版本管理' },
    component: () => import('@/views/version-manage/IndexView.vue')
  },
  {
    path: '/function-config',
    name: 'FunctionConfig',
    meta: { title: '功能配置' },
    component: () => import('@/views/function-config/IndexView.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: {
      title: '404',
      ignoreAuth: true
    },
    component: () => import('@/views/NotFound.vue')
  }
]
