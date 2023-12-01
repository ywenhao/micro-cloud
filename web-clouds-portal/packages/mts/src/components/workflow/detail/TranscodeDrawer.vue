<template>
  <a-drawer
    :title="title"
    :width="600"
    v-model:visible="visible"
    :footer="false"
    @close="handleClose"
  >
    <div class="detail-box">
      <b-title>基本信息</b-title>
      <detail-table :data="baseData" />
    </div>
    <div class="detail-box mt-24px">
      <tabs-title :data="tabs" v-model:active="active" />
      <detail-table :data="paramsData" />
    </div>

    <watermark-item
      v-if="watermarkCount"
      class="mt-24px"
      title="水印设置"
      :data="watermarkData"
      :loading="watermarkLoading"
    >
      <div class="tab-box">
        <div
          class="tab-btn"
          @click="watermarkActive = index"
          v-for="(_, index) in watermarkCount"
          :key="index"
          :class="{ active: watermarkActive === index }"
        >
          <span>水印{{ index + 1 }}</span>
        </div>
      </div>
    </watermark-item>
  </a-drawer>
</template>

<script setup lang="tsx">
import {
  getMtsPresetInfoDetailApi,
  type VideoPresetModel,
  type WatermarkPresetModel
} from '@vcp/apis/mts'
import { isNil } from 'lodash-es'
import { emptyText, type LabelValue } from 'vc-material'

import TabsTitle from '@/components/TabsTitle.vue'
import {
  audioEncodingFormatOpts,
  videoEncodingFormatOpts,
  videoFormatOpts
} from '@/utils/opts/preset'

import BTitle from '../../common/BTitle.vue'
import DetailTable from '../../common/DetailTable.vue'
import WatermarkItem from './WatermarkItem.vue'

const props = defineProps<{
  modelValue: boolean
  isPreset?: boolean
  record?: VideoPresetModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const title = computed(() => (props.isPreset ? '预设详情' : '普通转码'))
const visible = useVModel(props, 'modelValue', emit)
const active = ref('视频参数')

const detail = computed(() => props.record || {})
const tabs = computed(() => {
  const list = ['视频参数', '音频参数', '字幕参数']
  if (detail.value.audio_disable === 1) list.splice(1, 1)
  if (detail.value.subtitle_disable === 1) list.splice(2, 1)
  return list
})

const watermarkLoading = ref(false)
const watermarkActive = ref(0)
const watermarkPreset = ref<WatermarkPresetModel>()
const watermark_list = computed(() => detail.value.watermark_list || [])
const watermark_preset_id_list = computed(
  () => ((detail.value as any).watermark_preset_id_list || []) as string[]
)
const watermarkCount = computed<number>(() => {
  return watermark_list.value.length || watermark_preset_id_list.value.length
})

const watermarkData = computed(() => {
  if (watermark_list.value.length)
    return watermark_list.value[watermarkActive.value]
  if (watermarkPreset.value) return watermarkPreset.value
  return {}
})

const getWatermarkPresetById = async (id: string) => {
  watermarkLoading.value = true
  watermarkPreset.value = undefined
  try {
    const res = await getMtsPresetInfoDetailApi({ id, preset_type: '2' })
    watermarkPreset.value = res.watermark_preset as WatermarkPresetModel
  } finally {
    watermarkLoading.value = false
  }
}

// watermark_list没有，watermark_preset_id_list有才去详情接口获取
watchEffect(() => {
  if (watermark_list.value.length) return
  if (watermark_preset_id_list.value.length) {
    const id = watermark_preset_id_list.value[watermarkActive.value]
    getWatermarkPresetById(id)
  }
})

const baseData = computed<LabelValue[]>(() =>
  [
    { label: '名称', value: detail.value.name! },
    {
      label: '封装格式',
      value: getLabelByValue(videoFormatOpts, +detail.value.format!)
    }
  ].filter(v => !isNil(v.value))
)

const videoData = computed(() => [
  {
    label: '编码格式',
    value: getLabelByValue(
      videoEncodingFormatOpts,
      +detail.value.encoding_format!
    )
  },
  {
    label: 'crf(固定码率系数)',
    value: isNil(detail.value.crf!) ? '-' : `${detail.value.crf!} kbps`
  },
  {
    label: '分辨率(w:h)',
    value: `${detail.value.resolution_w!}*${detail.value.resolution_h!}`
  },
  {
    label: '在播放器中宽高比(w:h)',
    value: `${detail.value.player_w!} x ${detail.value.player_h!}`
  },
  {
    label: '视频按比例缩放',
    value:
      +detail.value?.play_ratio! === 1 ? (
        '启用'
      ) : (
        <span class="color-ct-4">未启用</span>
      )
  },
  {
    label: '帧率',
    value: isNil(detail.value.fps!) ? '-' : `${detail.value.fps!} fps`
  },
  {
    label: '关键帧最大间隔',
    value: isNil(detail.value.frame!) ? '-' : `${detail.value.frame!}frame`
  },
  {
    label: '片段截取',
    value:
      isNil(detail.value?.part_spilt_start) &&
      isNil(detail.value?.part_spilt_len)
        ? '未启用'
        : (() => {
            const len = detail.value?.part_spilt_len
            const start = detail.value?.part_spilt_start
            const isLen = !isNil(len)
            const isStart = !isNil(start)
            return (
              <span class="inline-flex">
                {isLen && <span>截取长度：{len}s</span>}
                {isStart && isLen && <span class="w-24px" />}
                {isStart && <span>开始时间：{start}s</span>}
              </span>
            )
          })()
  },
  {
    label: '分段时长',
    value: isNil(detail.value.segment_time!)
      ? '-'
      : `${detail.value.segment_time!}s`
  }
])

const audioData = computed<LabelValue[]>(() => [
  {
    label: '编码格式',
    value: getLabelByValue(
      audioEncodingFormatOpts,
      +detail.value.audio_encoding_format!
    )
  },
  {
    label: '声道数',
    value: +detail.value.audio_channel! ? +detail.value.audio_channel! : '-'
  },
  {
    label: '码率',
    value: isNil(detail.value.audio_code_rate!)
      ? '-'
      : `${detail.value.audio_code_rate!} kbps`
  },
  {
    label: '采样率',
    value: isNil(detail.value.audio_sampling_rate!)
      ? '-'
      : `${detail.value.audio_sampling_rate!}Hz`
  }
])

const captionsData = computed<LabelValue[]>(() => [
  { label: '字幕空间', value: emptyText(detail.value.subtitle_bucket_name) },
  { label: '字幕对象', value: emptyText(detail.value.subtitle_path) }
])

const paramsData = computed(() => {
  const list = {
    视频参数: videoData.value,
    音频参数: audioData.value,
    字幕参数: captionsData.value
  }
  return list[active.value as keyof typeof list] || []
})

function handleClose() {
  active.value = '视频参数'
}
</script>

<style lang="less" scoped>
.tab-box {
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--color-border-1);
  border-bottom: none;
  .tab-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 96px;
    height: 28px;
    font-size: 14px;
    color: var(--color-text-1);
    background-color: var(--color-fill-2);
    border: 1px solid;
    border-color: var(--color-border-2);
    border-radius: 6px;
    font-weight: 400;
    cursor: pointer;
    &.active {
      color: rgba(var(--primary-6));
      background-color: rgba(var(--primary-1));
      border-color: rgba(var(--primary-6));
    }
  }
}
</style>
