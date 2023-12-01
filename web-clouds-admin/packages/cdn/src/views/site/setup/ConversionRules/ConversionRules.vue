<template>
  <a-tabs v-model:active-key="module" type="capsule">
    <a-tab-pane
      v-for="(value, key) in panesConfig"
      :key="key"
      :title="value.label"
      lazy-load
    >
      <component :is="value.component" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
const UrlRewrite = defineAsyncComponent(() => import('./UrlRewrite.vue'))
const RequestHeaderModify = defineAsyncComponent(
  () => import('./RequestHeaderModify.vue')
)
const ResponseHeaderModify = defineAsyncComponent(
  () => import('./ResponseHeaderModify.vue')
)

const panesConfig = {
  urlRewrite: { label: 'URL重写', component: UrlRewrite },
  requestHeaderModify: {
    label: 'HTTP请求头修改',
    component: RequestHeaderModify
  },
  responseHeaderModify: {
    label: 'HTTP响应头修改',
    component: ResponseHeaderModify
  }
}
const module = ref('urlRewrite')
</script>

<style scoped>
:deep(.arco-tabs-nav-tab) {
  justify-content: flex-start !important;
}
</style>
