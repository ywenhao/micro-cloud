<script setup lang="ts">
import { get } from 'lodash-es'

import {
  UaBrowserRequest,
  UaBrowserTraffic,
  UaDeviceRequest,
  UaDeviceTraffic,
  UaSystemRequest,
  UaSystemTraffic
} from './ua'
const type = ref('traffic')
// 流量 请求数
const types = [
  { value: 'traffic', label: '流量' },
  { value: 'request', label: '请求数' }
]

const option = ref('device')
// 流量 请求数
const options = [
  { value: 'device', label: '设备' },
  { value: 'system', label: '操作系统' },
  { value: 'browser', label: '浏览器' }
]

const components: Record<string, Record<string, Component>> = {
  device: { traffic: UaDeviceTraffic, request: UaDeviceRequest },
  system: { traffic: UaSystemTraffic, request: UaSystemRequest },
  browser: { traffic: UaBrowserTraffic, request: UaBrowserRequest }
}
</script>

<template>
  <vc-card>
    <template #title>
      <div class="flex items-center gap-x-1">
        <vc-svg-icon :size="20" prefix="cdn" name="rank"></vc-svg-icon>
        <span class="text-base">TOP100 UA</span>
      </div>
    </template>
    <template #extra>
      <a-radio-group
        class="mr-8"
        type="button"
        v-model="option"
        :options="options"
      ></a-radio-group>
      <a-radio-group
        type="button"
        v-model="type"
        :options="types"
      ></a-radio-group>
    </template>
    <component :is="get(components, `${option}.${type}`)" />
  </vc-card>
</template>
