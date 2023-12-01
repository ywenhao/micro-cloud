<script setup lang="ts">
import { VcModal } from 'vc-material'

import { useHtmlTitle } from './hooks/useHtmlTitle'

const appStore = useAppStore()
useHtmlTitle()
onMounted(() => {
  appStore.getAdminInfo().then(() => {
    appStore.getProductList()
  })

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
    <router-view />
  </a-config-provider>
</template>
