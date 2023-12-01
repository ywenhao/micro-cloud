<script setup lang="tsx">
import { type MicroAppData, SubAppLayout } from '@vca/shared'
import { type VcAppMenuRaw, VcSvgIcon } from 'vc-material'
const getData = () => (window.microApp.getData() || {}) as MicroAppData
const data = getData()
const title = data.productName || '云解析 DNS'

const menus: VcAppMenuRaw[] = [
  {
    name: 'UserDomain',
    title: '用户域名',
    icon: [
      <VcSvgIcon prefix="dns" name="user_domain"></VcSvgIcon>,
      <VcSvgIcon prefix="dns" name="user_domain_active"></VcSvgIcon>
    ],
    children: []
  },
  {
    name: 'SysDomain',
    title: '系统域名',
    icon: [
      <VcSvgIcon prefix="dns" name="sys_domain"></VcSvgIcon>,
      <VcSvgIcon prefix="dns" name="sys_domain_active"></VcSvgIcon>
    ]
  },
  {
    name: 'DnsConfig',
    title: 'DNS配置',
    icon: [
      <VcSvgIcon prefix="dns" name="dns"></VcSvgIcon>,
      <VcSvgIcon prefix="dns" name="dns_active"></VcSvgIcon>
    ],
    children: []
  },
  {
    name: 'VersionManage',
    title: '版本管理',
    icon: [
      <VcSvgIcon prefix="dns" name="version"></VcSvgIcon>,
      <VcSvgIcon prefix="dns" name="version_active"></VcSvgIcon>
    ],
    children: []
  },
  {
    name: 'FunctionConfig',
    title: '功能配置',
    icon: [
      <VcSvgIcon prefix="dns" name="function"></VcSvgIcon>,
      <VcSvgIcon prefix="dns" name="function_active"></VcSvgIcon>
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
      class="dns-sub-app-layout"
    />
  </a-config-provider>
</template>

<style lang="less">
.dns-sub-app-layout {
  .vca-sub-app-layout__sider {
    .arco-menu.vc-menus {
      .arco-menu-item::before {
        display: none;
      }
    }
  }
}
</style>
