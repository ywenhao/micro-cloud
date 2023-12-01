import { type Aside } from '@vcp/shared'
import { VcSvgIcon } from 'vc-material'

const cdnAsideList: Aside<string> = {
  title: '云分发CDN',
  key: 'cdn',
  menus: [
    {
      name: 'Overview',
      title: '首页概览',
      icon: [
        <VcSvgIcon prefix="cdn" name="overview"></VcSvgIcon>,
        <VcSvgIcon prefix="cdn" name="overview_active"></VcSvgIcon>
      ]
    },
    {
      name: 'SiteList',
      title: ' 站点管理',
      icon: [
        <VcSvgIcon prefix="cdn" name="site"></VcSvgIcon>,
        <VcSvgIcon prefix="cdn" name="site_active"></VcSvgIcon>
      ]
    },
    {
      name: 'StatisticAnalysis',
      title: '统计分析',
      icon: [
        <VcSvgIcon prefix="cdn" name="statistic_analysis"></VcSvgIcon>,
        <VcSvgIcon prefix="cdn" name="statistic_analysis_active"></VcSvgIcon>
      ],
      children: [
        {
          name: 'StatisticAnalysisTraffic',
          title: '流量'
        },
        {
          name: 'StatisticAnalysisWaf',
          title: '安全'
        },
        {
          name: 'StatisticAnalysisProper',
          title: '性能'
        },
        {
          name: 'StatisticAnalysisRank',
          title: '排行'
        }
      ]
    }
  ]
}

export const asideList = [cdnAsideList]
