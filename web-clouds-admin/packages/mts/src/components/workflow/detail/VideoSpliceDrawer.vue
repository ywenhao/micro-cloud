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
import type { SplicePresetModel } from '@vca/apis/mts'
import { isNil } from 'lodash-es'
import { emptyText } from 'vc-material'

import BTitle from '../../common/BTitle.vue'
import DetailTable from '../../common/DetailTable.vue'

const props = defineProps<{
  modelValue: boolean
  isPreset?: boolean
  record?: SplicePresetModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = useVModel(props, 'modelValue', emit)
const title = computed(() => (props.isPreset ? '预设详情' : '视频拼接'))

const detail = computed(() => props.record || {})

const baseData = computed(() =>
  [
    { label: '名称', value: detail.value.name! },
    {
      label: '拼接文件',
      value: (
        <>
          <div class="color-ct-3">{detail.value.bucket_name}/</div>
          {(detail.value.video_paths || []).map(v => (
            <div class="mt-4px">{v}</div>
          ))}
        </>
      )
    },
    {
      label: '目标视频封装格式',
      value: ['MP4', 'FLV'][+detail.value.format!] || '-'
    },
    {
      label: '目标视频分辨率(w*h)',
      value: `${detail.value.resolution_w}x${detail.value.resolution_h}`
    },
    { label: '源文件拼接位置', value: emptyText(detail.value.splice_location) },
    { label: '峰值码率(kbps)', value: emptyText(detail.value.code_rate) },
    {
      label: '填充音频流',
      value: (
        <>
          {detail.value.audio === 1 ? (
            '已开启'
          ) : (
            <span class="color-ct-3">未开启</span>
          )}
        </>
      )
    },
    {
      label: '拼接视频加黑边',
      value: (
        <>
          {detail.value.black_border === 1 ? (
            '已开启'
          ) : (
            <span class="color-ct-3">未开启</span>
          )}
        </>
      )
    }
  ].filter(v => !isNil(v.value))
)
</script>
