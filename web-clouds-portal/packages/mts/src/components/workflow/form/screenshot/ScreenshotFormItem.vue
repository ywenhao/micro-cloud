<template>
  <a-form-item label="截图类型">
    <a-radio-group
      @change="formRef?.clearValidate(['time_end', 'time_start'])"
      v-model="formState.screenshot"
    >
      <a-radio :value="1">单张截图</a-radio>
      <a-radio :value="2">多张截图</a-radio>
    </a-radio-group>
  </a-form-item>

  <a-form-item>
    <template #label>
      <vc-tips-pop title="截图格式" star>
        输出的目标截图格式，支持jpg、png。
      </vc-tips-pop>
    </template>
    <a-radio-group v-model="formState.screenshot_image">
      <a-radio :value="1">jpg</a-radio>
      <a-radio :value="2">png</a-radio>
    </a-radio-group>
  </a-form-item>
  <a-form-item v-if="formState.screenshot === 2">
    <template #label>
      <vc-tips-pop title="截图间隔时间">
        指定采样间隔，单位：秒。默认为5秒，精度为 100ms
      </vc-tips-pop>
    </template>
    <a-input-number
      v-model="formState.time_interval"
      :precision="1"
      :step="0.1"
      :min="0.1"
      class="suffix-input-number"
    >
      <template #suffix>
        <a-tag color="gray" class="suffix-tag">秒</a-tag>
      </template>
    </a-input-number>
  </a-form-item>
  <a-form-item
    hide-asterisk
    field="time_start"
    :rules="[
      { required: true, message: '请输入内容' },
      { validator: validatorTime }
    ]"
  >
    <template #label>
      <vc-tips-pop title="开始时间">
        <div>指定截取视频的时刻，单位：秒，精确到毫秒。</div>
        <div>最大输入时间：50时59分59秒</div>
        <div v-if="formState.screenshot === 2">开始时间不能大于结束时间</div>
      </vc-tips-pop>
    </template>
    <time-input :loaded="dataLoaded" v-model="formState.time_start" />
  </a-form-item>
  <a-form-item
    :rules="[
      { required: true, message: '请输入内容' },
      { validator: validatorTime }
    ]"
    hide-asterisk
    field="time_end"
    v-if="formState.screenshot === 2"
  >
    <template #label>
      <vc-tips-pop title="结束时间">
        <div>指定截取视频的时刻，单位：秒，精确到毫秒。</div>
        <div>最大输入时间：50时59分59秒</div>
      </vc-tips-pop>
    </template>
    <time-input :loaded="dataLoaded" v-model="formState.time_end" />
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="图片大小(宽*高)">
        <div>
          1. 指定截图分辨率，格式为宽 x 高
          ，长边取值范围[20,3840]的整数，短边取值范围[20,2160]的整数。
        </div>
        <div>2. 宽、高都为空时，则和原视频保持一致。</div>
        <div>3. 宽为空，高不为空，则按高的值对原视频等比例缩放。</div>
        <div>4. 宽不为空，高为空时，则按宽的值对原视频等比例缩放。</div>
        <div>5. 宽、高都不为空时，则根据宽、高来缩放。</div>
      </vc-tips-pop>
    </template>
    <div flex items-center w-full>
      <a-input-number
        :min="minMax[0][0]"
        :max="minMax[0][1]"
        :precision="0"
        :step="1"
        v-model="formState.image_w"
        placeholder="请输入"
      />
      <div class="color-ct-3 mx-8px">x</div>
      <a-input-number
        :min="minMax[1][0]"
        :max="minMax[1][1]"
        :precision="0"
        :step="1"
        v-model="formState.image_h"
        placeholder="请输入"
      />
    </div>
  </a-form-item>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import { type ScreenshotPresetModel } from '@vcp/apis/mts'

import TimeInput from '@/components/common/TimeInput.vue'

const props = defineProps<{
  formRef: FormInstance | undefined
  data: ScreenshotPresetModel
  dataLoaded: boolean
}>()

const formState = computed(() => props.data)

const minMax = computed(() =>
  getMinMax(
    [
      toRef(() => formState.value.image_w),
      toRef(() => formState.value.image_h)
    ],
    [20, 3840],
    [20, 2160]
  )
)

async function validatorTime(_value: any, callback: ValidateCallback) {
  await nextTick()
  if (
    formState.value.screenshot === 2 &&
    formState.value.time_start &&
    formState.value.time_end &&
    formState.value.time_start > formState.value.time_end
  ) {
    return callback('开始时间不能大于结束时间')
  }
  if (
    formState.value.screenshot === 2 &&
    formState.value.time_end &&
    formState.value.time_start
  ) {
    nextTick(() => {
      props.formRef?.clearValidate(['time_end', 'time_start'])
    })
  }
  return true
}
</script>
