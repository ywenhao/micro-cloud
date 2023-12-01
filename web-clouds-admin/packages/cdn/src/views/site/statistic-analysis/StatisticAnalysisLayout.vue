<template>
  <div id="statistic-analysis-layout">
    <vc-container admin page-title="统计分析">
      <a-tabs v-model:active-key="activeKey" class="mt-2">
        <a-tab-pane v-for="{ key, title } in tabs" :key="key" :title="title" />
      </a-tabs>
      <slot name="filter"></slot>

      <slot></slot>
      <template v-for="item in panes" :key="item.key">
        <component v-if="item.key === activeKey" :is="item.component" />
      </template>
    </vc-container>
    <component
      v-if="has(extendPanel, activeKey)"
      :is="extendPanel[activeKey]"
    />
  </div>
</template>

<script setup lang="ts">
import { has } from 'lodash-es'
import type { Component } from 'vue'

import ProperPanel from './ProperPanel.vue'
import RankPanel from './RankPanel.vue'
import TrafficPanel from './TrafficPanel.vue'
import { LogView } from './waf'
import WafPanel from './WafPanel.vue'
// 流量 性能 安全 排行
const tabs = [
  { key: 'traffic', title: '流量' },
  { key: 'waf', title: '安全' },
  { key: 'proper', title: '性能' },
  { key: 'rank', title: '排行' }
]
// 流量面板 性能面板 安全面板 排行面板
const panes = [
  { key: 'traffic', component: TrafficPanel },
  { key: 'proper', component: ProperPanel },
  { key: 'waf', component: WafPanel },
  { key: 'rank', component: RankPanel }
]
// 拓展数组
const extendPanel: Record<string, Component> = { waf: LogView }

const activeKey = ref('traffic')
</script>

<style lang="less" scoped>
:deep(.summary-panel) {
  @apply w-full h-full flex items-center mt-4;
  .summary-item {
    @apply flex flex-col justify-center items-center gap-y-2  h-full px-14;
    &__body {
      @apply text-primary text-7 font-big-num;

      &-unit {
        @apply text-sm! pl-1;
      }
    }
    & + .summary-item {
      @apply ml-16 relative;
      &::before {
        @apply block absolute! top-1/2 -left-8 h-60px relative;
        // left: -65px;
        width: 1px;
        background-color: var(--color-border-1);
        content: '';
        transform: translateY(-50%);
      }
    }
  }
}
</style>
