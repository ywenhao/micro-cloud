<template>
  <component
    :key="item.id"
    :id="item.id"
    ref="drawerRefs"
    :data="item.data"
    :dataLoaded="dataLoaded"
    :type="item.type"
    :is="comp[item.type]"
    v-for="item in data"
    :model-value="activeId === item.id && visible"
    @update:model-value="visible = false"
  />
</template>

<script setup lang="ts">
import type { WorkflowNodeConf } from '@vca/apis/mts'
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
  dataLoaded: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const drawerRefs = ref<any[]>([])

const comp = {
  normalTranscode: NormalTranscodeDrawer,
  screenshot: ScreenshotDrawer,
  videoSplice: VideoSpliceDrawer,
  output: OutputDrawer
} as Record<NodeTypeKeys, Component>

const visible = useVModel(props, 'modelValue', emit)

function getData(isSubmit = false) {
  const data = drawerRefs.value?.map(v => v.getData(isSubmit))
  return data as DataMap
}

function validate(): Promise<{ err: boolean; id: string }[]>
// eslint-disable-next-line no-redeclare
function validate(id: string): Promise<boolean>
// eslint-disable-next-line no-redeclare
async function validate(id?: string) {
  if (id) {
    const validate = await drawerRefs.value?.find(v => v.id === id)?.validate()
    return validate
  }
  const validate = await Promise.all(drawerRefs.value?.map(v => v.validate()))
  return validate.map((v, i) => ({ err: v, id: props.data[i].id }))
}

defineExpose({ getData, validate })
</script>
