<script setup lang="tsx">
import { type MicroAppData, SubAppLayout } from '@vca/shared'
import { type VcAppMenuRaw, VcSvgIcon } from 'vc-material'

import TaskCenter from '@/components/task-center/TaskCenter.vue'
import { useAppStore } from '@/stores/modules/app'
const getData = () => (window.microApp.getData() || {}) as MicroAppData
const data = getData()
const title = data.productName || '云存储 OSS'

const useStore = useAppStore()

useStore.GET_REGION_DATA_LIST()

const menus: VcAppMenuRaw[] = [
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
    name: 'Region',
    title: '区域管理',
    icon: [
      <VcSvgIcon prefix="oss" name="side_region"></VcSvgIcon>,
      <VcSvgIcon prefix="oss" name="side_region_active"></VcSvgIcon>
    ]
  },
  {
    name: 'Node',
    title: '节点管理',
    icon: [
      <VcSvgIcon prefix="oss" name="side_node"></VcSvgIcon>,
      <VcSvgIcon prefix="oss" name="side_node_active"></VcSvgIcon>
    ],
    children: []
  },
  {
    name: 'Space',
    title: '空间管理 ',
    icon: [
      <VcSvgIcon prefix="oss" name="side_space"></VcSvgIcon>,
      <VcSvgIcon prefix="oss" name="side_space_active"></VcSvgIcon>
    ],
    children: [
      { name: 'SpaceList', title: '空间列表', children: [] },
      { name: 'LinkDomain', title: '空间外链域名', children: [] }
    ]
  },
  {
    name: 'Statistical',
    title: '统计分析',
    icon: [
      <VcSvgIcon prefix="oss" name="side_statistic"></VcSvgIcon>,
      <VcSvgIcon prefix="oss" name="side_statistic_active"></VcSvgIcon>
    ]
  },
  {
    name: 'Settings',
    title: '存储配置 ',
    icon: [
      <VcSvgIcon prefix="oss" name="side_storage"></VcSvgIcon>,
      <VcSvgIcon prefix="oss" name="side_storage_active"></VcSvgIcon>
    ],
    children: [
      { name: 'ChainDomain', title: '外链调度域名', children: [] },
      { name: 'StoreLimit', title: '存储限制', children: [] }
    ]
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
    <task-center />
  </a-config-provider>
</template>
