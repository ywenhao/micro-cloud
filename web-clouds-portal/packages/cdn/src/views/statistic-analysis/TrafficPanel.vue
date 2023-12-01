<script setup lang="ts">
import { getCdnStatisticSummaryTrafficApi } from '@vcp/apis/cdn'
import type { Component } from 'vue'

import VcaCard from '@/components/automatic/VcaCard.vue'

import {
  BandwidthPanel,
  DistributionPanel,
  HitPanel,
  IpPanel,
  RequestPanel,
  TrafficPanel
} from './traffic'

// 流量 带宽 请求数 独立IP访问数 命中率 访问用户分布
const tabs: { value: string; label: string; component: Component }[] = [
  { value: 'traffic', label: '流量', component: TrafficPanel },
  { value: 'bandwidth', label: '带宽', component: BandwidthPanel },
  { value: 'request', label: '请求数', component: RequestPanel },
  { value: 'ip', label: '独立IP访问数', component: IpPanel },
  { value: 'hit', label: '命中率', component: HitPanel },
  { value: 'distribution', label: '访问用户分布', component: DistributionPanel }
]
const state = inject('statisticState') as any
const activeKey = ref('traffic')

const summary = reactive<{
  total_bytes: number
  total_requests: number
  hit_rate: number
  top_speed: number
  ips: number
}>({
  total_bytes: 0,
  total_requests: 0,
  hit_rate: 0,
  top_speed: 0,
  ips: 0
})
const summaryLoading = ref(false)

const getSummary = () => {
  summaryLoading.value = true
  getCdnStatisticSummaryTrafficApi(state.value)
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
          <span class="summary-item__title">总流量</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value"
              v-trans-byte="[summary?.total_bytes, '.unit']"
            >
              <span class="summary-item__body-unit unit"></span>
            </span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">带宽峰值</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value"
              v-trans-ps="[summary?.top_speed, '.unit']"
            >
              <span class="summary-item__body-unit unit"></span>
            </span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">请求数</span>
          <div class="summary-item__body">
            <span v-locale="summary?.total_requests"></span>
            <span class="summary-item__body-unit">次</span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">独立IP访问数</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value"
              v-locale="summary?.ips"
            ></span>
            <span class="summary-item__body-unit">个</span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">命中率</span>
          <div class="summary-item__body">
            <span class="summary-item__body-value">
              {{ summary?.hit_rate }}
            </span>
            <span class="summary-item__body-unit">%</span>
          </div>
        </div>
      </div>
    </a-spin>
  </vca-card>
  <a-radio-group
    class="mt-4"
    v-model="activeKey"
    :options="tabs"
    type="button"
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
