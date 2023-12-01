<template>
  <a-drawer
    :title="title"
    :width="600"
    class="is-admin"
    v-model:visible="visible"
    :footer="false"
  >
    <div class="detail-box">
      <b-title>基本信息</b-title>
      <detail-table :data="baseData" />
    </div>
  </a-drawer>
</template>

<script setup lang="tsx">
import type { ScreenshotPresetModel } from '@vca/apis/mts'
import { isNil } from 'lodash-es'

import { getTimeBySecond } from '@/utils/time'

import BTitle from '../../common/BTitle.vue'
import DetailTable from '../../common/DetailTable.vue'

const props = defineProps<{
  modelValue: boolean
  isPreset?: boolean
  record?: ScreenshotPresetModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = useVModel(props, 'modelValue', emit)
const title = computed(() => (props.isPreset ? '预设详情' : '截图'))

const detail = computed(() => props.record || {})

const baseData = computed(() =>
  [
    { label: '名称', value: detail.value.name! },
    {
      label: '截图类型',
      value: detail.value.screenshot === 1 ? '单张截图' : '多张截图'
    },
    {
      label: '截图格式',
      value: detail.value.screenshot_image === 1 ? 'jpg' : 'png'
    },
    {
      label: '截图间隔时间',
      value: `${detail.value.time_interval}s`
    },
    {
      label: '开始时间',
      value: !isNil(detail.value.time_start)
        ? getTimeBySecond(detail.value.time_start)
            .map(v => String(v ?? '').padStart(2, '0'))
            .join(':')
        : '-'
    },
    {
      label: '结束时间',
      value: !isNil(detail.value.time_end)
        ? getTimeBySecond(detail.value.time_end)
            .map(v => String(v ?? '').padStart(2, '0'))
            .join(':')
        : '-'
    },
    {
      label: '图片大小(宽*高)',
      value: `${detail.value.image_w}x${detail.value.image_h}`
    }
  ].filter(v => !isNil(v.value))
)
</script>
