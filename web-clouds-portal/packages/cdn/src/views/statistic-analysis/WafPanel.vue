<script setup lang="ts">
import { getCdnStatisticSummaryWafApi } from '@vcp/apis/cdn'

import VcaCard from '@/components/automatic/VcaCard.vue'

import { CodesPanel, MenacesPanel, PreventsPanel } from './waf'

const state = inject('statisticState') as any

// 威胁数: menaces 防护数: prevents 错误码: codes
const activeKey = ref('menaces')

// 威胁数: menaces 防护数: prevents 错误码: codes
const tabs: { value: string; label: string; component: Component }[] = [
  { value: 'menaces', label: '威胁数', component: MenacesPanel },
  { value: 'prevents', label: '防护数', component: PreventsPanel },
  { value: 'codes', label: '错误码', component: CodesPanel }
]

const summary = reactive({
  menaces: 0,
  prevents: 0,
  codes: 0
})

const summaryLoading = ref(false)
const getSummary = () => {
  summaryLoading.value = true
  getCdnStatisticSummaryWafApi(state.value)
    .then(res => {
      Object.assign(summary, res)
    })
    .finally(() => {
      summaryLoading.value = false
    })
}

watch(state, getSummary, { immediate: true, deep: true })
</script>

<template>
  <vca-card body-full class="h-[124px]" background>
    <a-spin class="w-full h-full" :loading="summaryLoading">
      <div class="summary-panel">
        <div class="summary-item">
          <span class="summary-item__title">威胁数</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value num"
              v-locale="summary?.menaces"
            ></span>
            <span class="summary-item__body-unit">次</span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">防护数</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value num"
              v-locale="summary?.prevents"
            ></span>
            <span class="summary-item__body-unit">次</span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">错误码</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value num"
              v-locale="summary?.codes"
            ></span>
            <span class="summary-item__body-unit">次</span>
          </div>
        </div>
      </div>
    </a-spin>
  </vca-card>
  <a-radio-group
    v-model="activeKey"
    :options="tabs"
    type="button"
    class="mt-4"
  ></a-radio-group>
  <a-tabs v-model:active-key="activeKey" type="capsule">
    <a-tab-pane
      v-for="{ value, label, component } in tabs"
      :key="value"
      :title="label"
    >
      <component :is="component" />
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="less" scoped>
:deep(.arco-tabs-nav) {
  display: none !important;
}
</style>
