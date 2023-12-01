import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'OSS',
    meta: { title: '云存储OSS' },
    redirect: { name: 'HomeStatistic' },
    children: [
      {
        path: '/home-statistic',
        name: 'HomeStatistic',
        component: () => import('@/views/home-statistic'),
        meta: {
          currentActive: 'HomeStatistic',
          hasSideBar: true,
          title: '概览'
        }
      },
      {
        path: '/space-manage',
        name: 'SpaceManage',
        meta: {
          keepAlive: true,
          title: '空间管理',
          currentActive: 'SpaceManage',
          hasSideBar: true
        },
        component: () => import('@/views/space-manage')
      },
      {
        path: '/space-detail/:command?/:id?/:label?',
        name: 'SpaceDetail',
        component: () => import('@/views/space-manage/space-detail'),
        meta: {
          currentActive: 'SpaceManage',
          hasSideBar: true,
          title: '空间详情'
        }
      },
      {
        path: '/static-analysis',
        name: 'Statistical',
        meta: {
          currentActive: 'Statistical',
          hasSideBar: true,
          title: '统计分析'
        },
        component: () => import('@/views/statistical-analysis')
      }
    ]
  }
]
