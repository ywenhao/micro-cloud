<script setup lang="ts">
import { get } from 'lodash-es'

import { UrlRequest, UrlTraffic } from './url'
const type = ref('traffic')
// 流量 请求数
const types = [
  { value: 'traffic', label: '流量' },
  { value: 'request', label: '请求数' }
]

const components: Record<string, Component> = {
  traffic: UrlTraffic,
  request: UrlRequest
}
</script>

<template>
  <vc-card>
    <template #title>
      <div class="flex items-center gap-x-1">
        <vc-svg-icon :size="20" prefix="cdn" name="rank"></vc-svg-icon>
        <span class="text-base">TOP100 URL</span>
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
