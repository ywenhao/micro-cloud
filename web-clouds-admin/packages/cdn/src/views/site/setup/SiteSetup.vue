<template>
  <vc-container
    admin
    header-bordered
    :page-title="`站点配置 ${route.params?.domain}`"
    :back="() => $router.push({ name: 'SiteList' })"
  >
    <a-tabs
      v-model:active-key="activeKey"
      lazy-load
      destroy-on-hide
      @change="handleChangeTabs"
    >
      <a-tab-pane
        v-for="(value, key) in panesConfig"
        :key="key"
        :title="value.label"
      >
        <component :is="value.component" @tab-change="handleChangeTabs" />
      </a-tab-pane>
      <!-- <a-tab-pane title="基础信息" key="basic">
        <basic-view></basic-view>
      </a-tab-pane>
      <a-tab-pane title="源站配置" key="source">
        <source-view></source-view>
      </a-tab-pane>
      <a-tab-pane title="协议配置" key="protocol"></a-tab-pane>
      <a-tab-pane title="证书配置" key="certificate"></a-tab-pane> -->
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
const BasicView = defineAsyncComponent(() => import('./BasicView.vue'))
const CacheView = defineAsyncComponent(() => import('./CacheView.vue'))
const CertificateView = defineAsyncComponent(
  () => import('./CertificateView.vue')
)
const ConversionRules = defineAsyncComponent(() => import('./ConversionRules'))
const CustomErrorPages = defineAsyncComponent(
  () => import('./CustomErrorPages.vue')
)
const NetworkView = defineAsyncComponent(() => import('./NetworkView.vue'))
const PageRules = defineAsyncComponent(() => import('./PageRules'))
const PerfOptimal = defineAsyncComponent(() => import('./PerfOptimal.vue'))
const ProtocolView = defineAsyncComponent(() => import('./ProtocolView.vue'))
const SecurityView = defineAsyncComponent(() => import('./SecurityView'))
const SourceView = defineAsyncComponent(() => import('./SourceView.vue'))

const route = useRoute()
const router = useRouter()

const panesConfig = {
  basic: { label: '基础信息', component: BasicView },
  source: { label: '源站配置', component: SourceView },
  protocol: { label: '协议配置', component: ProtocolView },
  certificate: { label: '证书配置', component: CertificateView },
  security: { label: '安全配置', component: SecurityView },
  perf_optimal: {
    label: '性能优化',
    component: PerfOptimal
  },
  cache: { label: '缓存配置', component: CacheView },
  page_rules: { label: '页面规则', component: PageRules },
  conversion_rules: { label: '转换规则', component: ConversionRules },
  custom_error_pages: { label: '自定义错误页面', component: CustomErrorPages },
  network: { label: '网络配置', component: NetworkView }
}

const activeKey = ref('basic')
watchPostEffect(() => {
  activeKey.value = String(route.params?.module || 'basic')
})
const handleChangeTabs = (key: string | number) => {
  console.log(1)
  router.replace({
    ...route,
    params: { domain: route.params?.domain, module: key }
  })
}
</script>

<style scoped>
:deep(.vc-container__header) {
  margin-bottom: 8px !important;
}
</style>
