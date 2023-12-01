import type { RouteRecordRaw } from 'vue-router'

const statisticAnalysisView = () => import('@/views/statistic-analysis')
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'CDN',
    meta: { title: '云分发CDN' },
    redirect: { name: 'Overview' },
    children: [
      {
        path: '',
        name: 'Overview',
        component: () => import('@/views/overview'),
        meta: {
          currentActive: 'Overview',
          hasSideBar: true,
          title: '首页概览'
        }
      },
      {
        path: '/site/list',
        name: 'SiteList',
        component: () => import('@/views/site'),
        meta: {
          title: '站点列表',
          keepAlive: true,
          hasSideBar: true,
          currentActive: 'SiteList'
        }
      },
      {
        path: '/SiteList/setup/:domain/:id/:userId/:module?',
        name: 'SiteSetup',
        component: () => import('@/views/site/setup'),
        meta: { title: '站点配置', hasSideBar: true, currentActive: 'SiteList' }
      },

      {
        path: '/statistic-analysis/traffic',
        name: 'StatisticAnalysisTraffic',
        meta: {
          currentActive: 'StatisticAnalysisTraffic',
          hasSideBar: true,
          title: '统计分析 - 流量',
          type: 'traffic'
        },
        component: statisticAnalysisView
      },
      {
        path: '/statistic-analysis/waf',
        name: 'StatisticAnalysisWaf',
        meta: {
          currentActive: 'StatisticAnalysisWaf',
          hasSideBar: true,
          title: '统计分析 - 安全',
          type: 'waf'
        },
        component: statisticAnalysisView
      },
      {
        path: '/statistic-analysis/proper',
        name: 'StatisticAnalysisProper',
        meta: {
          currentActive: 'StatisticAnalysisProper',
          hasSideBar: true,
          title: '统计分析 -  性能',
          type: 'proper'
        },
        component: statisticAnalysisView
      },
      {
        path: '/statistic-analysis/rank',
        name: 'StatisticAnalysisRank',
        meta: {
          currentActive: 'StatisticAnalysisRank',
          hasSideBar: true,
          title: '统计分析 -  性能',
          type: 'rank'
        },
        component: statisticAnalysisView
      }
    ]
  }
]
