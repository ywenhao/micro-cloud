<template>
  <a-drawer
    :title="title"
    :width="600"
    class="is-admin"
    v-model:visible="visible"
    :footer="false"
    @before-open="getFatherData"
  >
    <div class="detail-box">
      <b-title>基本信息</b-title>
      <detail-table :data="baseData" />
    </div>
  </a-drawer>
</template>

<script setup lang="tsx">
import type { WorkflowOutPutConf } from '@vca/apis/mts'
import { emptyText, type LabelValue } from 'vc-material'

import { useSuffix } from '@/components/workflow/hooks'

import BTitle from '../../common/BTitle.vue'
import DetailTable from '../../common/DetailTable.vue'

const props = defineProps<{
  modelValue: boolean
  id: string
  isPreset?: boolean
  record?: WorkflowOutPutConf
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = useVModel(props, 'modelValue', emit)
const title = computed(() => (props.isPreset ? '预设详情' : '输出'))
const detail = computed(() => props.record || {})

const { isManyScreenshot, isHls, hlsSuffix, format, getFatherData } = useSuffix(
  toRef(() => props.id),
  detail
)

const baseData = computed<LabelValue[]>(() => [
  { label: '名称', value: detail.value.name! },
  {
    label: '输出空间',
    value: emptyText(detail.value.bucket_name)
  },
  {
    label: '文件名',
    value: (
      <div class="whitespace-nowrap">
        <div class="flex items-center">
          <div>{detail.value.name}</div>
          <div class="middle-input">
            <span>+</span>
            <span>原文件名</span>
            <span>+</span>
          </div>
          <div>{detail.value.name_suffix}</div>
          {isManyScreenshot.value ? (
            <div class="middle-input pr-0!">
              <span>+</span>
              <span>{'{count}'}</span>
            </div>
          ) : null}
          <div pl-8px color-ct-3>
            .{format.value}
          </div>
        </div>
        {isHls.value ? (
          <div class="flex items-center">
            <div>{detail.value.hls_name}</div>
            <div class="middle-input">
              <span>+</span>
              <span>原文件名</span>
              <span>+</span>
            </div>
            <div>{detail.value.hls_suffix}</div>
            <div class="middle-input pr-0!">
              <span>+</span>
              <span>{'{count}'}</span>
            </div>
            <div pl-8px color-ct-3>
              .{hlsSuffix}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
])
</script>
