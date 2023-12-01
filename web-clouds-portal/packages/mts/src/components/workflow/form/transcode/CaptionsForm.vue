<template>
  <a-form-item hide-label>
    禁用字幕
    <a-switch
      class="ml-4px!"
      :unchecked-value="0"
      :checked-value="1"
      v-model="formState.subtitle_disable"
    />
  </a-form-item>
  <a-form-item hide-label v-if="+formState.subtitle_disable! !== 1">
    <a-form-item>
      <template #label>
        <vc-tips-pop title="添加字幕">
          添加字幕，支持：srt格式字幕（uft-8编码和和utf-8
          BOM编码）、带有字幕的mkv文件、embed（将原视频的字幕流嵌入目标视频）。
        </vc-tips-pop>
      </template>
      <space-object-select
        v-model:space="formState.subtitle_bucket_id"
        v-model:object="formState.subtitle_path"
        :default-params="{ region_id: regionId, limit: 500 }"
      />
    </a-form-item>
  </a-form-item>
</template>

<script setup lang="ts">
import type { VideoPresetModel } from '@vcp/apis/mts'

import SpaceObjectSelect from './SpaceObjectSelect.vue'

const props = defineProps<{
  data: VideoPresetModel
  dataLoaded: boolean
}>()

const route = useRoute()
const regionId = computed(() => route.params.regionId as string)

const formState = computed(() => props.data)
</script>
