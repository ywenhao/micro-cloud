<template>
  <div :class="props.class" class="detail-box">
    <b-title>{{ title }}</b-title>
    <slot />
    <a-spin class="w-full" :loading="loading">
      <detail-table :data="baseData" />
      <div class="detail-box my-24px">
        <div class="h-312px w-full">
          <watermark-show :data="detail" width="inherit" height="inherit" />
        </div>
        <detail-table class="mt-8px" :data="watermarkData" />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="tsx">
import { getMtsPresetFontApi, type WatermarkPresetModel } from '@vcp/apis/mts'
import { isNil } from 'lodash-es'
import { emptyText, type LabelValue, useSelectRemote } from 'vc-material'

import WatermarkShow from '@/components/workflow/form/watermark/WatermarkShow.vue'
import {
  watermarkLocationOpts,
  watermarkTimeLineOpts,
  watermarkTypeOpts
} from '@/utils/opts/preset'
import { getTimeBySecond } from '@/utils/time'

import BTitle from '../../common/BTitle.vue'
import DetailTable from '../../common/DetailTable.vue'

const props = defineProps<{
  title: string
  class?: string
  loading?: boolean
  data: WatermarkPresetModel | undefined
}>()

const { opts: fontOpts } = useSelectRemote(getMtsPresetFontApi, {
  labelKey: 'name',
  valueKey: 'key'
})

const detail = computed(() => props.data || {})

const baseData = computed(() => {
  const timeState = Object.keys(detail.value).filter(key =>
    key.startsWith('time')
  )
  const hasTimeLine = !!timeState.length
  return [
    { label: '名称', value: detail.value.name! },
    {
      label: '水印类型',
      value: getLabelByValue(watermarkTypeOpts, +detail.value.type!)
    },
    +detail.value.type! === 1 && {
      label: '水印路径',
      value: (
        <div>
          {detail.value.type === 1 ? (
            <>
              <div class="color-ct-3">{detail.value.image_bucket_name}/</div>
              <div class="mt-4px">{detail.value.image_path}</div>
            </>
          ) : (
            '-'
          )}
        </div>
      )
    },
    +detail.value.type! === 1 && {
      label: '图片自适应缩放',
      value: emptyText(detail.value.image_adaptive)
    },
    +detail.value.type! === 1 && {
      label: '水印位置',
      value: (
        <div class="flex items-center gap-24px">
          <span>
            {getLabelByValue(watermarkLocationOpts, +detail.value.location!)}
          </span>
          <span>横向边距：{detail.value.margin_w}px</span>
          <span>纵向边距：{detail.value.margin_h}px</span>
        </div>
      )
    },
    +detail.value.type! === 2 && {
      label: '水印文字',
      value: detail.value.text_word
    },
    +detail.value.type! === 2 && {
      label: '文字设置',
      value: (
        <div class="flex items-center gap-24px">
          <span>
            {getLabelByValue(fontOpts.value, +detail.value.text_font!)}
          </span>
          <span>{detail.value.text_font_size}号</span>
          <div class="flex items-center">
            <div>{detail.value.text_font_color}</div>
            <div
              class="w-12px h-12px rounded-2px ml-4px"
              style={{ backgroundColor: detail.value.text_font_color }}
            />
          </div>
        </div>
      )
    },
    hasTimeLine && {
      label: '水印时间线',
      value: !isNil(detail.value.time_line)
        ? getLabelByValue(watermarkTimeLineOpts, detail.value.time_line)
        : '-'
    },
    hasTimeLine && {
      label: '开始时间',
      value:
        detail.value.time_line === 1 && !isNil(detail.value.time_start)
          ? getTimeBySecond(detail.value.time_start)
              .map(v => String(v ?? '').padStart(2, '0'))
              .join(':')
          : '-'
    },
    hasTimeLine && {
      label: '持续时间',
      value: `${detail.value.time_duration ?? 0}s`
    }
    // hasTimeLine && {
    //   label: '调整到视频范围内',
    //   value: (
    //     <>
    //       {detail.value?.time_adjustment === 1 ? (
    //         '已开启'
    //       ) : (
    //         <span class="color-ct-3">未开启</span>
    //       )}
    //     </>
    //   )
    // }
  ].filter(Boolean) as LabelValue[]
})

const watermarkData = computed<LabelValue[]>(() => [
  {
    label: '预览画面尺寸',
    value: `${detail.value.preview_w}x${detail.value.preview_h}`
  }
])
</script>
