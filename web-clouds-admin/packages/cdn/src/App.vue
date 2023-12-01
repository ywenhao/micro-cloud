<script setup lang="tsx">
import { type MicroAppData, SubAppLayout } from '@vca/shared'
import { type VcAppMenuRaw, VcSvgIcon } from 'vc-material'

const getData = () => (window.microApp.getData() || {}) as MicroAppData
const data = getData()
const title = data.productName || '云分发 CDN'

const menus: VcAppMenuRaw[] = [
  {
    name: 'Overview',
    title: '首页概览',
    icon: [
      <VcSvgIcon prefix="cdn" name="overview"></VcSvgIcon>,
      <VcSvgIcon prefix="cdn" name="overview_active"></VcSvgIcon>
    ],
    children: []
  },
  {
    name: 'Site',
    title: '站点管理',
    icon: [
      <VcSvgIcon prefix="cdn" name="site"></VcSvgIcon>,
      <VcSvgIcon prefix="cdn" name="site_active"></VcSvgIcon>
    ],
    children: [
      { name: 'SiteStatisticAnalysis', title: '统计分析', children: [] },
      { name: 'SiteList', title: '站点列表', children: [] },
      { name: 'SiteGlobalSetup', title: '全局配置', children: [] }
    ]
  },
  {
    name: 'Analysis',
    title: '解析管理',
    icon: [
      <VcSvgIcon prefix="cdn" name="analysis"></VcSvgIcon>,
      <VcSvgIcon prefix="cdn" name="analysis_active"></VcSvgIcon>
    ],
    children: [
      { name: 'AnalysisDomain', title: '解析域名', children: [] },
      { name: 'AnalysisRegion', title: '区域解析', children: [] }
    ]
  },
  {
    name: 'Node',
    title: '节点管理',
    icon: [
      <VcSvgIcon prefix="cdn" name="node"></VcSvgIcon>,
      <VcSvgIcon prefix="cdn" name="node_active"></VcSvgIcon>
    ],
    children: [
      { name: 'NodeAnalysis', title: '统计分析', children: [] },
      { name: 'NodeCacheTemplate', title: '缓存模板', children: [] },
      { name: 'NodeList', title: '节点列表', children: [] },
      { name: 'NodeVersion', title: '版本管理', children: [] },
      { name: 'NodeServer', title: '服务配置', children: [] }
    ]
  },
  {
    name: 'Secure',
    title: '安全配置',
    icon: [
      <VcSvgIcon prefix="cdn" name="secure"></VcSvgIcon>,
      <VcSvgIcon prefix="cdn" name="secure_active"></VcSvgIcon>
    ],
    children: [
      { name: 'WafSetup', title: 'WAF配置', children: [] },
      { name: 'WafPresetRules', title: 'WAF预置规则', children: [] }
    ]
  },
  {
    name: 'PortSetup',
    title: '端口配置',
    icon: [
      <VcSvgIcon prefix="cdn" name="port"></VcSvgIcon>,
      <VcSvgIcon prefix="cdn" name="port_active"></VcSvgIcon>
    ],
    children: []
  }
]
</script>

<template>
  <a-config-provider update-at-scroll scroll-to-close>
    <template #empty="{ component }">
      <div class="flex flex-col items-center justify-center py-8">
        <vc-svg-icon
          :size="component === 'table' ? 104 : 74"
          name="empty"
        ></vc-svg-icon>
        <span class="text-ct-3">暂无数据</span>
      </div>
    </template>
    <sub-app-layout
      :route="$route"
      :router="$router"
      :menus="menus"
      :title="title"
    />
  </a-config-provider>
</template>
