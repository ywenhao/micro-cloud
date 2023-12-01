<template>
  <a-layout class="vca-sub-app-layout">
    <a-layout-sider class="vca-sub-app-layout__sider" :width="200">
      <div class="product-name">
        <icon-left
          class="vc-icon-button"
          :size="18"
          @click="handleBackProductList"
        />
        <span class="title">{{ title }}</span>
      </div>
      <div class="flex-1 overflow-hidden">
        <vc-scrollbar>
          <vc-menu
            v-if="defaultActive"
            auto-open-selected
            :selected-keys="[defaultActive]"
            @menu-item-click="handleMenuClick"
            :menus="menus"
          ></vc-menu>
        </vc-scrollbar>
      </div>
    </a-layout-sider>
    <a-layout-content>
      <vc-scrollbar view-class="vca-sub-scrollbar__view">
        <router-view v-slot="{ Component }">
          <keep-alive :exclude="keepAliveExclude" :key="keepAliveKey">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </vc-scrollbar>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="tsx">
import './layout.less'

import { Notification } from '@arco-design/web-vue'
import { IconLeft } from '@arco-design/web-vue/es/icon'
import { getMicroAppData } from '@vca/shared'
import { type VcAppMenuRaw } from 'vc-material'
import { VcModal } from 'vc-material'
import { computed, onMounted } from 'vue'
import { type RouteLocationNormalizedLoaded, type Router } from 'vue-router'

import { useKeepAlive } from '../hooks'
import { useSubTitle } from './useSubTitle'

const menus = defineModel<VcAppMenuRaw[]>('menus', { default: () => [] })
const title = defineModel<string>('title', { default: '' })
const route = defineModel<RouteLocationNormalizedLoaded>('route', {
  required: true
})
const router = defineModel<Router>('router', {
  required: true
})
const defaultActive = computed(() =>
  (route.value?.meta?.currentActive || route.value?.name || '').toString()
)

const { keepAliveExclude, keepAliveKey } = useKeepAlive()

useSubTitle(route, menus, title)

const handleMenuClick = (name: string) => {
  if (name === route.value.name) return
  const item = menus.value
    .map(item => item.children?.find(v => v.name === name))
    .filter(Boolean)[0]
  try {
    router.value.push(item?.path || { name })
  } catch (error) {
    if ((error as Error).message.indexOf('No match for') > -1) {
      Notification.clear()
      Notification.error({
        title: '路由跳转错误',
        content: `请检查您的菜单配置 name 和 routes 中是否包含有 ${name}!`
      })
    }
  }
}
const handleBackProductList = () => {
  // const data = {
  //   command: 'BACK_PRODUCTS'
  // }
  // window.microApp.dispatch(data)
  const url = window.location.href
  history.replaceState({}, '', url)
  getMicroAppData().pedestalRouter.push({ name: 'Products' })
}

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
.title {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
}
</style>
