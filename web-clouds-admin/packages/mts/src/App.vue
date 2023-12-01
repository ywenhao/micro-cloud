<script setup lang="tsx">
import { type MicroAppData, SubAppLayout } from '@vca/shared'
import { type VcAppMenuRaw, VcSvgIcon } from 'vc-material'
const getData = () => (window.microApp.getData() || {}) as MicroAppData
const data = getData()
const title = data.productName || '云转码 MTS'

const menus: VcAppMenuRaw[] = [
  {
    name: 'Overview',
    title: '概览',
    icon: [
      <VcSvgIcon prefix="mts" name="overview"></VcSvgIcon>,
      <VcSvgIcon prefix="mts" name="overview_active"></VcSvgIcon>
    ]
  },
  {
    name: 'Task',
    title: '任务管理',
    icon: [
      <VcSvgIcon prefix="mts" name="task"></VcSvgIcon>,
      <VcSvgIcon prefix="mts" name="task_active"></VcSvgIcon>
    ],
    children: [
      { name: 'TaskManage', title: '任务管理' },
      { name: 'TaskTrigger', title: '任务触发器' },
      { name: 'TaskWorkflow', title: '工作流' },
      { name: 'TaskQueue', title: '队列管理' }
    ]
  },
  {
    name: 'Presets',
    title: '预设管理',
    icon: [
      <VcSvgIcon prefix="mts" name="presets"></VcSvgIcon>,
      <VcSvgIcon prefix="mts" name="presets_active"></VcSvgIcon>
    ],
    children: [
      { name: 'PresetsSys', title: '系统预设' },
      {
        name: 'PresetsUser',
        path: '/presets/user/transcode',
        title: '用户预设'
      }
    ]
  },
  {
    name: 'Data',
    title: '数据统计',
    icon: [
      <VcSvgIcon prefix="mts" name="data"></VcSvgIcon>,
      <VcSvgIcon prefix="mts" name="data_active"></VcSvgIcon>
    ],
    children: [
      { name: 'DataTask', title: '任务处理统计' },
      { name: 'DataActiveUsers', title: '活跃用户统计' }
    ]
  },
  {
    name: 'Dispatch',
    title: '调度管理',
    icon: [
      <VcSvgIcon prefix="mts" name="dispatch"></VcSvgIcon>,
      <VcSvgIcon prefix="mts" name="dispatch_active"></VcSvgIcon>
    ],
    children: [
      { name: 'DispatchNode', title: '节点管理' },
      { name: 'DispatchNodeTask', title: '节点任务' },
      { name: 'DispatchVersion', title: '版本管理' }
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
  </a-config-provider>
</template>
