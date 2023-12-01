<script setup lang="ts">
import { RefererRequest, RefererTraffic } from './referer'
// 流量 请求数
const types = [
  { value: 'traffic', label: '流量' },
  { value: 'request', label: '请求数' }
]
const type = ref('traffic')

import { get } from 'lodash-es'

const components: Record<string, Component> = {
  traffic: RefererTraffic,
  request: RefererRequest
}
</script>

<template>
  <vc-card>
    <template #title>
      <div class="flex items-center gap-x-1">
        <vc-svg-icon :size="20" prefix="cdn" name="rank"></vc-svg-icon>
        <span class="text-base">TOP100 Referer</span>
      </div>
    </template>
    <template #extra>
      <a-radio-group
        type="button"
        v-model="type"
        :options="types"
      ></a-radio-group>
    </template>
    <component :is="get(components, type)" />
  </vc-card>
</template>
