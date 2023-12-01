<template>
  <a-form-item hide-label>
    禁用音频
    <a-switch
      class="ml-4px!"
      :unchecked-value="2"
      :checked-value="1"
      v-model="formState.audio_disable"
    />
  </a-form-item>
  <div v-if="!disabled">
    <a-form-item>
      <template #label>
        <vc-tips-pop title="编码格式">
          <div>1. 音频编码格式，支持 MP3、AAC 和 ACC_HE 三种。</div>
          <div>2. 为空时，与源视频一致。</div>
        </vc-tips-pop>
      </template>
      <a-select
        @change="handleCodeChange"
        v-model="formState.audio_encoding_format"
        :options="audioEncodingFormatOpts"
      />
    </a-form-item>
    <a-form-item>
      <template #label>
        <vc-tips-pop title="声道数">
          <div class="w-410px" text-justify>
            <div>
              1.
              音频声道数量，单位：整数值，输出文件的声道数不能大于输入源的声道数量。
            </div>
            <div>
              2. 目前 acodec 为 aac 时，支持的声道数量为
              1、2、4、5、6、8，其他数值不合法。
            </div>
            <div>
              3. acodec 为mp3 时，支持的声道数量为 1、2，其他数值不合法。
            </div>
            <div>
              4. acodec 为aac_he 时，支持的声道数量为
              1、2、4、5、6、8，其他数值不合法。
            </div>
            <div>备注：当编码格式为空时，声道数也为空，默认与源视频一致。</div>
          </div>
        </vc-tips-pop>
      </template>
      <a-select v-model="formState.audio_channel" :options="singOptions" />
    </a-form-item>
    <a-form-item label="码率(kbps)" class="mb-24px!">
      <div class="flex items-center">
        <a-input-number
          :min="1"
          :max="600"
          :step="0.1"
          v-model="formState.audio_code_rate"
          placeholder="请输入码率"
        />
      </div>
      <template #help>
        <div>
          1.
          音频码率，单位：千比特每秒（kbit/s），常用码率：64k，128k，192k，256k，320k等，音频码率限制大小为
          [1，600]，支持到小数点后一位。
        </div>
        <div>2. 无论是否改变编码格式，都使用指定音频码率进行转码。</div>
      </template>
    </a-form-item>
    <a-form-item>
      <template #label>
        <vc-tips-pop title="采样率">
          <div class="w-330px" text-justify>
            <div>1. 音频采样频率，单位：赫兹（Hz），取值为整数。</div>
            <div>
              2. 常用音频采样频率有 8000,
              11025、12000、16000、22050、24000、32000、44056、44100、47250、48000、50000、64000、88200、96000
              等，限制大小为 [8000，100000]。
            </div>
          </div>
        </vc-tips-pop>
      </template>
      <a-input-number
        :step="1"
        :min="8000"
        :max="100000"
        :precision="0"
        v-model="formState.audio_sampling_rate"
        placeholder="请输入采样率"
      />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import type { VideoPresetModel } from '@vca/apis/mts'

import { audioEncodingFormatOpts } from '@/utils/opts/preset'

const props = defineProps<{
  data: VideoPresetModel
  dataLoaded: boolean
}>()

const formState = computed(() => props.data)

const disabled = computed(() => +formState.value.audio_disable! === 1)

const singOptions = computed(() => {
  const first = !formState.value.audio_encoding_format
    ? [{ label: '-', value: 0 }]
    : []
  const listMap = new Map([
    [1, [1, 2]],
    [2, [1, 2, 4, 5, 6, 8]],
    [3, [1, 2, 4, 5, 6, 8]]
  ])
  const code = formState.value.audio_encoding_format
  const list =
    listMap.get(code!)?.map(v => ({ label: String(v), value: v })) || []
  return [...first, ...list]
})

function handleCodeChange() {
  const value = singOptions.value[0]
  formState.value.audio_channel = value.value
}

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    // 编码格式
    if (props.data.audio_encoding_format === undefined) {
      formState.value.audio_encoding_format = 0
    }
    // 声道数
    if (props.data.audio_channel === undefined) {
      formState.value.audio_channel = 0
    }
  },
  { immediate: true }
)
</script>
