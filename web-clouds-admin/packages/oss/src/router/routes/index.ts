import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomeStatistic',
    component: () => import('@/views/home-statistic')
  },
  {
    path: '/region',
    name: 'Region',
    meta: {
      title: '区域管理',
      icon: 'products'
    },
    component: () => import('@/views/region-manage')
  },
  {
    path: '/node',
    name: 'Node',
    meta: {
      title: '节点管理',
      icon: 'products'
    },
    component: () => import('@/views/node-manage')
  },
  {
    path: '/space-list',
    redirect: { name: 'SpaceList' },
    children: [
      {
        path: '/space-list',
        name: 'SpaceList',
        component: () => import('@/views/space-manage/space-list'),
        meta: {
          title: '空间列表',
          keepAlive: true
        }
      },
      {
        path: '/space-detail/:command?/:id?/:label?',
        name: 'SpaceDetail',
        component: () => import('@/views/space-manage/space-list/space-detail'),
        meta: {
          title: '空间详情',
          currentActive: 'SpaceList'
        }
      },
      {
        path: '/link-domain',
        name: 'LinkDomain',
        component: () => import('@/views/space-manage/link-domain'),
        meta: {
          title: '空间外链域名'
        }
      }
    ]
  },
  {
    path: '/static-analysis',
    name: 'Statistical',
    meta: {
      title: '统计分析',
      icon: 'products'
    },
    component: () => import('@/views/statistical-analysis')
  },
  {
    path: '/store-configuration',
    name: 'store_domain',
    redirect: { name: 'store' },
    meta: {
      title: '存储配置',
      icon: 'user'
    },
    children: [
      {
        path: '/chain-domain',
        name: 'ChainDomain',
        component: () => import('@/views/storage-config/chain-domain'),
        meta: {
          title: '外链调度域名'
        }
      },
      {
        path: 'store-limit',
        name: 'StoreLimit',
        component: () => import('@/views/storage-config/storage-limit'),
        meta: {
          title: '存储限制'
        }
      }
    ]
  }
]
