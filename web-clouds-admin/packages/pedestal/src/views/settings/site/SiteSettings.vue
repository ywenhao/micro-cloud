<script setup lang="ts">
const BasePane = defineAsyncComponent(() => import('./BasePane.vue'))
const ConnectPane = defineAsyncComponent(() => import('./ConnectPane.vue'))
const DomainPane = defineAsyncComponent(() => import('./DomainPane.vue'))
const ProtocolPane = defineAsyncComponent(() => import('./ProtocolPane.vue'))
const AboutUsPane = defineAsyncComponent(() => import('./AboutUsPane.vue'))

const activeName = ref('base_conf')

const confNameMap: Record<string, string> = {
  base_conf: '基本设置',
  system_conf_seo_conf: 'SEO站内优化',
  connect_conf: '联系方式',
  protocol_conf: '协议配置',
  domain_conf: '域名配置',
  about_us_conf: '关于我们'
}
</script>

<template>
  <vc-container admin page-title="网站配置">
    <a-tabs v-model="activeName" class="mt-2">
      <a-tab-pane :title="confNameMap.base_conf" key="base_conf">
        <base-pane />
      </a-tab-pane>
      <a-tab-pane lazy-load :title="confNameMap.domain_conf" key="domain_conf">
        <domain-pane />
      </a-tab-pane>
      <a-tab-pane
        lazy-load
        :title="confNameMap.connect_conf"
        key="connect_conf"
      >
        <connect-pane />
      </a-tab-pane>
      <a-tab-pane
        lazy-load
        :title="confNameMap.protocol_conf"
        key="protocol_conf"
      >
        <protocol-pane />
      </a-tab-pane>
      <a-tab-pane
        lazy-load
        :title="confNameMap.about_us_conf"
        key="about_us_conf"
      >
        <about-us-pane />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<style scoped lang="less">
:deep(.vc-container__content) {
  display: flex !important;
  flex-direction: column !important;
  .arco-tabs,
  .arco-tabs-content,
  .arco-tabs-content-item.arco-tabs-content-item-active,
  .arco-tabs-pane {
    flex: 1;
    display: flex !important;
    flex-direction: column !important;
  }
  .arco-tabs-content-list {
    flex: 1;
    .arco-tabs-content-item {
      min-width: 100% !important;
    }
  }
}
</style>
