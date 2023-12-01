<template>
  <vc-container page-title="我的证书">
    <a-tabs :default-active-key="defaultTabKey" @change="handleTabChange">
      <a-tab-pane :key="2" title="已签发"> </a-tab-pane>
      <a-tab-pane :key="1" title="自有证书"> </a-tab-pane>
    </a-tabs>
    <license-pane :key="defaultTabKey" :is-own="defaultTabKey"></license-pane>
  </vc-container>
</template>
<script lang="ts" setup>
// import 'vc-material/theme-chalk/table.css'

import LicensePane from './components/LicensePane.vue'
const defaultTabKey = ref<number>(2)

// tab切换
const handleTabChange = (key: number | string) => {
  defaultTabKey.value = key as number
}
</script>
<style lang="less" scoped>
.apply-list {
  @apply p-6 rounded-sm! bg-white h-full w-full;
}
.edit-desc {
  cursor: pointer;
  visibility: hidden;
}
:deep(.user-cell) {
  color: rgb(var(--primary-6));
  cursor: pointer;
}
:deep(.arco-tabs-tab) {
  padding-top: 16px !important;
}
:deep(.arco-tabs-content) {
  // padding-top: 0 !important;
  display: none;
}
</style>
