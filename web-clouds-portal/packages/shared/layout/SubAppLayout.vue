<template>
  <a-layout
    class="h-full w-full sub-app-layout"
    :style="{ background: `url(${Bg} center / cover no-repeat` }"
  >
    <vc-aside :menus="menus" v-if="hasSideBar" />
    <div class="vcp-layout__main pb-24px">
      <vc-scrollbar
        wrap-class="layout__main-scrollbar"
        :view-class="`min-h-full  rounded-12px flex flex-col ${viewClass()}`"
      >
        <router-view v-slot="{ Component }">
          <keep-alive :exclude="keepAliveExclude" :key="keepAliveKey">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </vc-scrollbar>
    </div>
  </a-layout>
</template>

<script setup lang="tsx">
import { postUserVisitEventApi } from '@vcp/apis/pedestal'
import { useReport, VcModal } from 'vc-material'

import { type MicroAppData, useKeepAlive, VcAside } from '..'
import Bg from '../assets/layout-bg.png'
import type { Aside } from './aside'
import { useSubTitle } from './useSubTitle'

const props = defineProps<{
  menus: Aside<string>[]
  hasSideBar?: boolean
}>()

const route = useRoute()
useSubTitle(props.menus, route)
const { keepAliveExclude, keepAliveKey } = useKeepAlive()

const viewClass = () => {
  return route.name === 'NotFound'
    ? 'h-full!'
    : route.name === 'HomeStatistic' || route.name === 'Overview'
    ? ''
    : 'bg-white'
}

// @ts-ignore
const microAppData = () => (window.microApp.getData() || {}) as MicroAppData

useReport(
  'portal',
  computed(() => microAppData()?.userInfo?.id),
  postUserVisitEventApi
)
provide('microAppData', toRef(microAppData))
onMounted(() => {
  window.onload = () => {
    document.body.addEventListener('plugin_web_update_notice', () => {
      VcModal.confirm({
        title: '版本升级',
        content: '程序版本更新，请刷新页面以获取最新的资源',
        closable: false,
        maskClosable: false,
        hideCancel: true,
        width: 420,
        okText: '刷新',
        onOk: () => {
          window.location.reload()
        }
      })
    })
  }
})
</script>

<style lang="less" scoped>
.sub-app-layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.layout__main-scrollbar {
  padding-top: 24px;
}
</style>
