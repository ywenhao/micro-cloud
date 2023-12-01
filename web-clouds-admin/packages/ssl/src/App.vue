<script setup lang="tsx">
import { type MicroAppData, SubAppLayout } from '@vca/shared'
import { type VcAppMenuRaw, VcSvgIcon } from 'vc-material'

import { userDataKey } from '@/config/provideKeys'

const getData = () => (window.microApp.getData() || {}) as MicroAppData
const data = getData()
const title = data.productName || 'SSL 证书'
const userData = {
  adminInfo: data.adminInfo,
  token: data.token ?? ''
}
provide(userDataKey, userData)
const menus: VcAppMenuRaw[] = [
  {
    name: 'Apply',
    title: '申请列表',
    icon: [
      <VcSvgIcon prefix="ssl" name="side_apply"></VcSvgIcon>,
      <VcSvgIcon prefix="ssl" name="side_apply_active"></VcSvgIcon>
    ],
    children: []
  },
  {
    name: 'License',
    title: '用户证书',
    icon: [
      <VcSvgIcon prefix="ssl" name="side_license"></VcSvgIcon>,
      <VcSvgIcon prefix="ssl" name="side_license_active"></VcSvgIcon>
    ]
  },
  {
    name: 'Config',
    title: '申请配置',
    icon: [
      <VcSvgIcon prefix="ssl" name="side_config"></VcSvgIcon>,
      <VcSvgIcon prefix="ssl" name="side_config_active"></VcSvgIcon>
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
      :menus="menus"
      :title="title"
      :route="$route"
      :router="$router"
      class="vc-ssl"
    />
  </a-config-provider>
</template>
