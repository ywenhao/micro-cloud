<template>
  <component
    :key="item.id"
    :record="getData(item)"
    :is="comp[item.type]"
    :id="item.id"
    v-for="item in data"
    :model-value="activeId === item.id && visible"
    @update:model-value="visible = false"
  />
</template>

<script setup lang="ts">
import type { WorkflowNodeConf } from '@vcp/apis/mts'
import type { Component } from 'vue'

import type { NodeTypeKeys } from '@/components/flow/types'

import OutputDrawer from './OutputDrawer.vue'
import ScreenshotDrawer from './ScreenshotDrawer.vue'
import NormalTranscodeDrawer from './TranscodeDrawer.vue'
import VideoSpliceDrawer from './VideoSpliceDrawer.vue'

export type DataMap = {
  id: string
  type: NodeTypeKeys
  data: WorkflowNodeConf
}[]

const props = defineProps<{
  activeId: string
  data: DataMap
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const comp = {
  normalTranscode: NormalTranscodeDrawer,
  screenshot: ScreenshotDrawer,
  videoSplice: VideoSpliceDrawer,
  output: OutputDrawer
} as Record<NodeTypeKeys, Component>

const getData = (item: any) => {
  const type = item.type as string
  if (type === 'output') return item.data
  const map = {
    normalTranscode: 'video_preset',
    videoSplice: 'splice_preset',
    screenshot: 'screenshot_preset'
  }
  return item.data[map[item.type as keyof typeof map]]
}

const visible = useVModel(props, 'modelValue', emit)
</script>
