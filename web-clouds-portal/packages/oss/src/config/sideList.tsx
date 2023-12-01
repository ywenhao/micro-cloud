import { type Aside } from '@vcp/shared'
import { VcSvgIcon } from 'vc-material'

export type AsideKeys = 'oss'
const ossAsideList: Aside<AsideKeys> = {
  title: '云存储 OSS',
  key: 'oss',
  menus: [
    {
      name: 'HomeStatistic',
      title: '概览',
      icon: [
        <VcSvgIcon prefix="oss" name="side_overview"></VcSvgIcon>,
        <VcSvgIcon prefix="oss" name="side_overview_active"></VcSvgIcon>
      ],
      children: []
    },
    {
      name: 'SpaceManage',
      title: '空间管理',
      icon: [
        <VcSvgIcon prefix="oss" name="side_space"></VcSvgIcon>,
        <VcSvgIcon prefix="oss" name="side_space_active"></VcSvgIcon>
      ]
    },
    {
      name: 'Statistical',
      title: '统计分析',
      icon: [
        <VcSvgIcon prefix="oss" name="side_statistic"></VcSvgIcon>,
        <VcSvgIcon prefix="oss" name="side_statistic_active"></VcSvgIcon>
      ]
    }
  ]
}

export const asideList = [ossAsideList]
