import type { RouteRecordRaw } from 'vue-router'

/** 首页概览 */
const overview: RouteRecordRaw = {
  path: '',
  name: 'Overview',
  component: () => import('@/views/overview'),
  meta: {
    title: '首页概览'
  }
}

/** 站点路由 */
const site: RouteRecordRaw = {
  path: '/site',
  name: 'Site',
  redirect: { name: 'SiteStatisticAnalysis' },
  meta: { title: '站点管理' },
  children: [
    {
      path: 'statistic-analysis',
      name: 'SiteStatisticAnalysis',
      component: () => import('@/views/site/statistic-analysis'),
      meta: { title: '统计分析' }
    },
    {
      path: 'list',
      name: 'SiteList',
      component: () => import('@/views/site/list'),
      meta: { title: '站点列表', keepAlive: true }
    },
    {
      path: 'setup/:domain/:id/:userId/:module?',
      name: 'SiteSetup',
      component: () => import('@/views/site/setup'),
      meta: { title: '站点配置', currentActive: 'SiteList' }
    },
    {
      path: 'global-setup',
      name: 'SiteGlobalSetup',
      component: () => import('@/views/site/global-setup'),
      meta: { title: '全局配置' }
    }
  ]
}

/** 解析管理 */
const analysis: RouteRecordRaw = {
  path: '/analysis',
  name: 'Analysis',
  redirect: { name: 'AnalysisDomain' },
  meta: { title: '解析管理' },
  children: [
    {
      path: 'domain',
      name: 'AnalysisDomain',
      component: () => import('@/views/analysis/domain'),
      meta: { title: '解析域名' }
    },
    {
      path: 'region',
      name: 'AnalysisRegion',
      component: () => import('@/views/analysis/region'),
      meta: { title: '区域解析' }
    }
  ]
}

/** 节点管理 */
const node: RouteRecordRaw = {
  path: '/node',
  name: 'Node',
  redirect: { name: 'NodeAnalysis' },
  meta: { title: '节点管理' },
  children: [
    {
      path: 'analysis',
      name: 'NodeAnalysis',
      component: () => import('@/views/node/analysis'),
      meta: { title: '统计分析', currentActive: 'NodeAnalysis' }
    },
    {
      path: 'cache-template',
      name: 'NodeCacheTemplate',
      component: () => import('@/views/node/cache-template'),
      meta: { title: '缓存模板', currentActive: 'NodeCacheTemplate' }
    },
    {
      path: 'list',
      name: 'NodeList',
      component: () => import('@/views/node/list'),
      meta: { title: '节点列表', keepAlive: true, currentActive: 'NodeList' }
    },
    {
      path: 'editor/:id',
      name: 'NodeEdit',
      component: () => import('@/views/node/edit'),
      meta: { title: '编辑节点', currentActive: 'NodeList' }
    },
    {
      path: 'setup/:id',
      name: 'NodeSetup',
      component: () => import('@/views/node/setup'),
      meta: { title: '节点配置', currentActive: 'NodeList' }
    },
    {
      path: 'version',
      name: 'NodeVersion',
      component: () => import('@/views/node/version'),
      meta: { title: '版本管理', currentActive: 'NodeVersion' }
    },
    {
      path: 'server',
      name: 'NodeServer',
      component: () => import('@/views/node/server'),
      meta: { title: '服务配置', currentActive: 'NodeServer' }
    }
  ]
}

/** 安全配置 */
const secure: RouteRecordRaw = {
  path: '/secure',
  name: 'Secure',
  redirect: { name: 'WafSetup' },
  meta: { title: '安全配置' },
  children: [
    {
      path: 'waf-setup',
      name: 'WafSetup',
      component: () => import('@/views/secure/waf-setup'),
      meta: { title: 'WAF配置' }
    },
    {
      path: 'waf-preset-rules',
      name: 'WafPresetRules',
      component: () => import('@/views/secure/waf-preset-rules'),
      meta: { title: 'WAF预置规则' }
    }
  ]
}

/** 端口配置 */
const port: RouteRecordRaw = {
  path: '/port-setup',
  name: 'PortSetup',
  meta: { title: '端口配置' },
  component: () => import('@/views/port')
}

export const routes: RouteRecordRaw[] = [
  overview,
  site,
  analysis,
  node,
  secure,
  port,

  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: {
      title: '404'
    },
    component: () => import('@/views/NotFound.vue')
  }
]
