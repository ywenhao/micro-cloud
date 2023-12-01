<template>
  <a-form-item
    :wrapper-col-style="{ minHeight: 'fit-content' }"
    content-class="min-h-[fit-content]!"
  >
    <template #label>
      <vc-tips-pop title="编码格式">
        视频编码格式，支持 H.264 和 H.265 两种
      </vc-tips-pop>
    </template>
    <a-radio-group
      @change="e => handleEncodingFormatChange(e as number)"
      v-model="formState.encoding_format"
      :options="videoEncodingFormatOpts"
    />
  </a-form-item>
  <a-form-item label="码率" class="mb-24px!">
    <a-input-number
      :min="10"
      :max="60000"
      :step="0.1"
      v-model="formState.code_rate"
      placeholder="请输入码率"
    />
    <!-- <div class="flex items-center w-full">
      <a-checkbox
        class="ml-16px"
        :model-value="+formState.code_rate_use! === 1"
        @update:model-value="formState.code_rate_use = $event ? 1 : 2"
        >强制使用</a-checkbox
      >
    </div> -->
    <template #help>
      <div>
        1.
        视频码率，单位：千比特每秒（kbit/s），常用视频码率：128k，1280k，5120k等，码率限制大小为
        [10，60000]，支持到小数点后一位;
      </div>
      <div>
        2.
        在不改变视频编码格式时，若指定码率大于原视频码率，则使用原视频码率进行转码;
      </div>
    </template>
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="crf(固定码率系数)">
        <div class="w-340px" text-justify>
          设置crf值，为整数，编码格式为 H.264 时取值为范围 [18,28]，编码格式为
          H.265 时取值范围为 [23,33]；其
          值越小，输出视频质量越好，输出文件可能变大。注
          意：不可与视频码率共用。
        </div>
      </vc-tips-pop>
    </template>
    <a-input-number
      :step="1"
      :min="crfSize.min"
      :max="crfSize.max"
      :precision="0"
      :disabled="!!formState.code_rate"
      v-model="formState.crf"
      placeholder="请输入系数"
    />
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="分辨率(w:h)">
        <div class="w-410px" text-justify>
          <div>
            1. 指定目标视频分辨率，格式为宽 x 高
            ，长边取值范围[20,8192]的整数，短边取值范围[20,4320]的整数。
          </div>
          <div>2. w、h 都为空时，则和原视频保持一致。</div>
          <div>3. w为空，h不为空，则按h的值对原视频等比例缩放。</div>
          <div>4. w不为空，h为空时，则按w的值对原视频等比例缩放。</div>
          <div>5. w、h都不为空时，则根据w、h来缩放。</div>
        </div>
      </vc-tips-pop>
    </template>
    <div>
      <div flex items-center>
        <a-select
          v-model="fen"
          placeholder="请选择分辨率"
          :options="videoFenOpts"
          @change="e => handleFenChange(e as string)"
        />
        <a-input-number
          :min="minMax[0][0]"
          :max="minMax[0][1]"
          :step="1"
          :precision="0"
          class="ml-16px"
          @change="fen = videoFenOpts[0].value"
          v-model="formState.resolution_w"
          placeholder="请输入系数"
        />
        <div class="color-ct-3 mx-8px">x</div>
        <a-input-number
          :min="minMax[1][0]"
          :max="minMax[1][1]"
          :step="1"
          :precision="0"
          @change="fen = videoFenOpts[0].value"
          v-model="formState.resolution_h"
          placeholder="请输入系数"
        />
      </div>
    </div>
  </a-form-item>
  <a-form-item>
    <template #label>
      <vc-tips-pop title="在播放器中宽高比(w:h)">
        <div class="w-330px" text-justify>
          <div>
            该参数为视频在播放器中显示的宽高比，格式为&lt;width&gt;:&lt;height&gt;，取值范围为[1,100]的整数。
          </div>
          <div>例如：取值3:4表示视频在播放器中播放是宽:高=3:4。</div>
        </div>
      </vc-tips-pop>
    </template>
    <div flex items-center w-full>
      <a-input-number
        :min="1"
        :max="100"
        :step="1"
        :precision="0"
        v-model="formState.player_w"
        placeholder="请输入系数"
      />
      <div class="color-ct-3 mx-8px">x</div>
      <a-input-number
        :min="1"
        :max="100"
        :step="1"
        v-model="formState.player_h"
        placeholder="请输入系数"
      />
    </div>
  </a-form-item>
  <a-form-item :wrapper-col-style="{ display: playRatioSwitch ? '' : 'none' }">
    <template #label>
      <div class="flex items-center">
        <vc-tips-pop title="视频按比例缩放">
          <div class="w-370px" text-justify>
            <div>1. 配合分辨率参数使用。</div>
            <div>
              2. 指定为1时，把视频按原始比例缩放到分辨率指定的矩形框内。
            </div>
            <div>
              3.
              指定为2时，把视频按分辨率中指定的比例添加黑框后，再等比例缩放到分辨率指定到矩形框内。
            </div>
            <div>4. 关闭时，会强制缩放到对应分辨率，可能造成视频变形。</div>
          </div>
        </vc-tips-pop>
        <a-switch
          class="ml-4px!"
          v-model="playRatioSwitch"
          @change="formState.play_ratio = undefined"
        />
      </div>
    </template>
    <a-select
      v-if="playRatioSwitch"
      v-model="formState.play_ratio"
      :options="[1, 2]"
    />
  </a-form-item>
  <a-form-item hide-label :merge-props="false">
    <a-form-item>
      <template #label>
        <vc-tips-pop title="帧率(fps)">
          <div class="w-345px" text-justify>
            视频帧率，每秒显示的帧数，单位：赫兹（Hz），
            常用帧率：24，25，30等， 帧率限制大小在 [1，60]。
          </div>
        </vc-tips-pop>
      </template>
      <a-input-number
        :step="1"
        :min="1"
        :max="60"
        v-model="formState.fps"
        placeholder="请输入帧率"
      />
    </a-form-item>
    <a-form-item class="ml-16px">
      <template #label>
        <vc-tips-pop title="关键帧最大间隔(frame)">
          <div class="w-313px" text-justify>
            <div>
              1.
              GOP参数，即视频流关键帧间的间隔帧数，取值[0,3000]的整数，默认为0表示采用指定视频编码格式的默认GOP值；
            </div>
            <div>
              2. 例如 H.264
              格式默认GOP值为250。GOP取值过小会影响视频编码压缩率，码率变大，过大会使图像群组的时长跨度过大，影响播放随机性，故一般建议采用默认值。
            </div>
          </div>
        </vc-tips-pop>
      </template>
      <a-input-number
        :step="1"
        :min="0"
        :max="3000"
        :precision="0"
        v-model="formState.frame"
        placeholder="请输入最大间隔"
      />
    </a-form-item>
  </a-form-item>
  <a-form-item hide-label>
    <div class="flex items-center">
      <div>片段截取</div>
      <a-switch
        class="ml-4px!"
        v-model="partSpiltSwitch"
        @change="handlePartSpiltSwitch"
      />
    </div>
  </a-form-item>
  <a-form-item hide-label :merge-props="false" v-if="partSpiltSwitch">
    <a-form-item>
      <template #label>
        <vc-tips-pop title="开始时间(s)">
          <div class="w-313px" text-justify>
            用于音视频截取，从一段音视频中截取一段音视频；
            指定音视频截取的开始时间，单位：秒，支持精确到毫秒，例如3.345s。
          </div>
        </vc-tips-pop>
      </template>
      <a-input-number
        :step="1"
        :min="1"
        :precision="3"
        v-model="formState.part_spilt_start"
        placeholder="请输入开始时间"
      />
    </a-form-item>
    <a-form-item class="ml-16px">
      <template #label>
        <vc-tips-pop title="截取长度(s)">
          <div>1. 用于视频截取，从一段视频中截取一段视频；</div>
          <div>
            2. 指定音视频截取的长度，单位：秒，支持精确到毫秒，例如1.500s。
          </div>
        </vc-tips-pop>
      </template>
      <a-input-number
        :step="1"
        :min="1"
        :precision="3"
        v-model="formState.part_spilt_len"
        placeholder="请输入截取长度"
      />
    </a-form-item>
  </a-form-item>
  <a-form-item v-if="formState.format && +formState.format === 3">
    <template #label>
      <vc-tips-pop title="分段时长(s)">
        <div class="w-313px" text-justify>
          用于 HLS
          自定义每一小段视频流及其包含的音频流的播放时间长度，取值范围为[2,120]，单位：秒，默认值为
          10秒。
        </div>
      </vc-tips-pop>
    </template>
    <a-input-number
      :step="1"
      :min="2"
      :max="120"
      v-model="formState.segment_time"
      placeholder="请输入分段时长"
    />
  </a-form-item>
</template>

<script setup lang="ts">
import type { VideoPresetModel } from '@vca/apis/mts'
import { isNil } from 'lodash-es'

import { videoEncodingFormatOpts, videoFenOpts } from '@/utils/opts/preset'
import { getMinMax } from '@/utils/time'

const props = defineProps<{
  data: VideoPresetModel
  dataLoaded: boolean
}>()

const partSpiltSwitch = ref(false)
const playRatioSwitch = ref(false)
const fen = ref('')

const formState = computed(() => props.data)
const crfSize = reactive({ min: 18, max: 28 })

const minMax = computed(() =>
  getMinMax(
    [
      toRef(() => formState.value.resolution_w),
      toRef(() => formState.value.resolution_h)
    ],
    [20, 8092],
    [20, 4320]
  )
)

function handlePartSpiltSwitch() {
  formState.value.part_spilt_len = undefined
  formState.value.part_spilt_start = undefined
}

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    // 片段截取
    if (props.data.part_spilt_start || props.data.part_spilt_len) {
      partSpiltSwitch.value = true
    }
    // 视频按比例缩放
    if (props.data.play_ratio) {
      playRatioSwitch.value = true
    }
    // 分辨率
    const resolution_w = props.data.resolution_w
    const resolution_h = props.data.resolution_h
    if (resolution_w && resolution_h) {
      const value = `${resolution_w}*${resolution_h}`
      if (videoFenOpts.some(item => item.value === value)) {
        fen.value = value
      }
    }
  },
  { immediate: true }
)

// 编码格式
function handleEncodingFormatChange(encoding_format: number) {
  crfSize.min = +encoding_format! === 2 ? 23 : 18
  crfSize.max = +encoding_format! === 2 ? 33 : 28
  const crf = +formState.value.crf! || 0
  if (isNil(formState.value.crf)) return
  if (crf || 0 < crfSize.min) formState.value.crf = crfSize.min
  else if (crf! > crfSize.max) formState.value.crf = crfSize.max
}

// 分辨率
function handleFenChange(value: string) {
  if (value === '') {
    formState.value.resolution_w = undefined
    formState.value.resolution_h = undefined
    return
  }
  const [resolution_w, resolution_h] = value.split('*')
  formState.value.resolution_w = +resolution_w
  formState.value.resolution_h = +resolution_h
}
</script>
