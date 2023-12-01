<template>
  <a-form-item
    field="video_paths"
    hide-asterisk
    class="paths-form-item"
    :rules="videoPathsRules"
  >
    <template #label>
      <div flex w-full items-center justify-between>
        <vc-tips-pop title="拼接文件" star>
          <div>
            1. 除去源文件以外，还可以指定最多20个视频文件(即总计21个片段)；
          </div>
          <div>2. 所有拼接文件必须属于同一存储空间。</div>
        </vc-tips-pop>
        <a-link
          :hoverable="false"
          class="add-btn"
          :disabled="(formState.video_paths || []).length >= 20"
          @click="handleAddVideoPaths"
        >
          <icon-plus size="16" />
          <div class="ml-4px">添加</div>
        </a-link>
      </div>
    </template>
    <file-select-group
      v-model:bucket-id="formState.bucket_id"
      v-model:paths="formState.video_paths"
      :region-id="regionId"
    />
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="目标视频封装格式">
        <div>1. 目标视频指拼接后得到的视频；</div>
        <div>2. 目标视频的格式，mp4、flv。</div>
      </vc-tips-pop>
    </template>
    <a-radio-group
      v-model="formState.format"
      :options="[
        { label: 'MP4', value: 1 },
        { label: 'FLV', value: 2 }
      ]"
    />
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="目标视频分辨率(w*h)">
        指定目标视频分辨率，格式为宽 x 高
        ，长边取值范围[20,3840]的整数，短边取值范围[20,2160]的整数。
      </vc-tips-pop>
    </template>
    <div flex w="full" items-center>
      <a-input-number
        :min="minMax[0][0]"
        :max="minMax[0][1]"
        :step="1"
        :precision="0"
        v-model="formState.resolution_w"
        placeholder="请输入宽度"
      />
      <div class="color-ct-3 mx-8px">x</div>
      <a-input-number
        :min="minMax[1][0]"
        :max="minMax[1][1]"
        :step="1"
        :precision="0"
        v-model="formState.resolution_h"
        placeholder="请输入高度"
      />
    </div>
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="源文件拼接位置">
        <div>用于设置源文件在拼接时的位置（表示位于第几个视频），默认值为1</div>
        <div>
          表示源文件在拼接时作为第一个视频，最大值为拼接视频的文件数，如果设置的值超过最大值，则会报错。
        </div>
      </vc-tips-pop>
    </template>
    <a-input-number
      :min="1"
      :max="(formState.video_paths || []).filter(Boolean).length + 1"
      :step="1"
      :precision="0"
      v-model="formState.splice_location"
      placeholder="请输入"
    />
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="峰值码率(kbps)">
        <div>
          1. 使用该参数限制输出视频流的峰值码率，单位：千比特每秒(kbit/s)；
        </div>
        <div>2. 仅对输出格式为 mp4 时有效；</div>
        <div>3. 输入范围：10-100000</div>
      </vc-tips-pop>
    </template>
    <a-input-number
      :min="10"
      :max="1e5"
      :step="1"
      :precision="0"
      v-model="formState.code_rate"
      placeholder="请输入"
    />
  </a-form-item>
  <a-form-item hide-label>
    <div flex items-center w="full">
      <vc-tips-pop title="填充音频流">
        待拼接视频文件中，是否给没有音频流的视频文件填充空的音频流，启用为填充。
      </vc-tips-pop>
      <a-switch
        class="ml-8px!"
        :unchecked-value="2"
        :checked-value="1"
        v-model="formState.audio"
      />
    </div>
  </a-form-item>
  <a-form-item hide-label>
    <div flex items-center w="full">
      <vc-tips-pop title="拼接视频加黑边">
        开启后，当拼接视频与原视频分辨率不一致时，会给拼接视频按照原视频比例补上黑边，再进行等比例分辨率缩放。
      </vc-tips-pop>
      <a-switch
        class="ml-8px!"
        :unchecked-value="2"
        :checked-value="1"
        v-model="formState.black_border"
      />
    </div>
  </a-form-item>
</template>

<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'
import type { SplicePresetModel } from '@vca/apis/mts'

import FileSelectGroup from '@/components/file-select-group/FileSelectGroup.vue'
import { getMinMax } from '@/utils/time'

const props = defineProps<{
  data: SplicePresetModel
  dataLoaded: boolean
  regionId: string
}>()

const formState = computed(() => props.data)

const videoPathsRules: FieldRule[] = [
  {
    type: 'array',
    validator(value: string[], callback) {
      value = value.filter(Boolean)
      if (!value.length) {
        return callback('请添加拼接文件')
      }
      return true
    }
  }
]

const minMax = computed(() =>
  getMinMax(
    [
      toRef(() => formState.value.resolution_w),
      toRef(() => formState.value.resolution_h)
    ],
    [20, 3840],
    [20, 2160]
  )
)

function handleAddVideoPaths() {
  const paths = formState.value.video_paths!
  formState.value.video_paths = [...paths, '']
}
</script>

<style lang="less" scoped>
.add-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  &:hover {
    color: rgb(var(--primary-5));
  }
}

.paths-form-item {
  :deep(.arco-form-item-label) {
    width: 100%;
  }
}
</style>
