<script setup lang="ts">
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-cn'
import { postUserVisitEventApi } from '@vcp/apis/pedestal'
import { useReport, VcModal } from 'vc-material'

// import { APP_TITLE } from './config'
import LayoutDefault from './layout/LayoutDefault.vue'
const appStore = useAppStore()
!appStore.token && appStore.signInAction()
useHtmlTitle(appStore)
onMounted(() => {
  appStore.getBaseConf()

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
  // appStore.userInfoAction()
})

useReport(
  'portal',
  computed(() => appStore.userInfo?.id),
  postUserVisitEventApi
)
</script>

<template>
  <a-config-provider :locale="zhCn" update-at-scroll scroll-to-close>
    <template #empty="{ component }">
      <div class="flex flex-col items-center justify-center py-8">
        <vc-svg-icon
          :size="component === 'table' ? 104 : 74"
          name="empty"
        ></vc-svg-icon>
        <span class="text-ct-3">暂无数据</span>
      </div>
    </template>
    <router-view v-if="$route.meta.ignoreAuth && $route.name === 'NotFound'" />
    <layout-default v-else-if="appStore.token" />
  </a-config-provider>
</template>
