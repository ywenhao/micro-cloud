<template>
  <a-drawer
    :title="title"
    :width="600"
    class="is-admin"
    v-model:visible="visible"
    :footer="false"
  >
    <watermark-item title="基本信息" :data="record" />
  </a-drawer>
</template>

<script setup lang="ts">
import { type WatermarkPresetModel } from '@vca/apis/mts'

import WatermarkItem from './WatermarkItem.vue'

const props = defineProps<{
  modelValue: boolean
  isPreset?: boolean
  record?: WatermarkPresetModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = useVModel(props, 'modelValue', emit)
const title = computed(() => (props.isPreset ? '预设详情' : '水印'))
</script>
