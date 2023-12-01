<template>
  <a-tabs v-model:active-key="module" type="capsule">
    <a-tab-pane
      v-for="(value, key) in panesConfig"
      :key="key"
      :title="value.label"
    >
      <component :is="value.component" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
const WafPane = defineAsyncComponent(() => import('./WafPane.vue'))
const PresetRules = defineAsyncComponent(() => import('./PresetRules.vue'))
const SafetyChain = defineAsyncComponent(() => import('./SafetyChain.vue'))

const panesConfig = {
  waf: { label: 'WAF', component: WafPane },
  presetRules: { label: 'WAF预置规则', component: PresetRules },
  safetyChain: { label: '防盗链', component: SafetyChain }
}
const module = ref('waf')
</script>

<style scoped>
:deep(.arco-tabs-nav-tab) {
  justify-content: flex-start !important;
}
</style>
