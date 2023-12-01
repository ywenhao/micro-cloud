<template>
  <a-form-item label="水印类型">
    <a-radio-group v-model="formState.type" :options="watermarkTypeOpts" />
  </a-form-item>
  <template v-if="formState.type === 1">
    <a-form-item hide-asterisk ref="imagePathRef" field="image_path">
      <template #label>
        <vc-tips-pop title="选择水印" star>
          用于设置视频水印的图片文件，只能是{{ watermarkSuffixList.join('/') }}
          文件，且不超过 20MB。
        </vc-tips-pop>
      </template>
      <space-object-select
        v-model:space="formState.image_bucket_id"
        v-model:object="formState.image_path"
        :default-params="{ region_id: regionId, limit: 500 }"
        :checkObject="checkObject"
      />
    </a-form-item>
    <a-form-item>
      <template #label>
        <vc-tips-pop title="图片自适应缩放">
          适用于图片水印，
          指定水印图片的短边与输入视频之间的比例，取值为(0,1]，数值支持小数点后2位。
        </vc-tips-pop>
      </template>
      <a-input-number
        v-model="formState.image_adaptive"
        :min="0.01"
        :max="1"
        :step="0.01"
        :precision="2"
      />
    </a-form-item>
  </template>
  <template v-else-if="formState.type === 2">
    <a-form-item asterisk-position="end" label="水印文字" field="text_word">
      <a-input
        placeholder="请输入水印文字"
        v-model="formState.text_word"
        show-word-limit
        :max-length="100"
      />
    </a-form-item>
    <a-form-item label="文字设置">
      <div flex items-center w="full">
        <a-select
          placeholder="选择字体"
          v-model="formState.text_font"
          :loading="fontLoading"
          :options="fontOpts"
        />
        <a-input-number
          class="suffix-input-number ml-8px"
          v-model="formState.text_font_size"
          :min="1"
          :max="1e4"
          :step="1"
          :precision="0"
          placeholder="字体大小"
        >
          <template #suffix>
            <a-tag color="gray" class="suffix-tag">px</a-tag>
          </template>
        </a-input-number>
        <color-picker class="ml-8px" v-model="formState.text_font_color" />
      </div>
    </a-form-item>
  </template>
  <a-form-item :merge-props="false" hide-label>
    <a-form-item label="水印位置">
      <location-button v-model="formState.location" />
    </a-form-item>
    <div class="w-full ml-16px">
      <a-form-item label="横向边距">
        <a-input-number
          class="suffix-input-number"
          v-model="formState.margin_w"
          :step="1"
          :precision="0"
        >
          <template #suffix>
            <a-tag color="gray" class="suffix-tag">px</a-tag>
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="纵向边距" class="mt-28px">
        <a-input-number
          class="suffix-input-number"
          v-model="formState.margin_h"
          :precision="0"
          :step="1"
        >
          <template #suffix>
            <a-tag color="gray" class="suffix-tag">px</a-tag>
          </template>
        </a-input-number>
      </a-form-item>
    </div>
  </a-form-item>
  <a-form-item
    >水印时间线
    <a-switch class="ml-8px!" v-model="timeLineSwitch" />
  </a-form-item>
  <template v-if="timeLineSwitch">
    <a-form-item hide-label>
      <div flex items-center w="full" class="tab-btn-box">
        <div
          class="tab-btn"
          @click="formState.time_line = 1"
          :class="{ active: formState.time_line === 1 }"
        >
          从片头开始
        </div>
        <div
          class="tab-btn"
          @click="formState.time_line = 2"
          :class="{ active: formState.time_line === 2 }"
        >
          从片尾开始（反向）
        </div>
      </div>
    </a-form-item>
    <a-form-item label="开始时间" v-if="formState.time_line === 1">
      <time-input
        isSecond
        :loaded="dataLoaded"
        v-model="formState.time_start"
      />
    </a-form-item>
    <a-form-item
      class="mb-4!"
      field="time_duration"
      hide-asterisk
      ref="timeDurationRef"
      :help="
        timeDurationRef?.isError
          ? undefined
          : '当持续时间大于视频时间时，水印将自动调整到视频时间内'
      "
      :rules="[{ required: true, message: '请输入内容' }]"
    >
      <template #label>
        <vc-tips-pop title="持续时间">
          指定图片或文字水印显示的持续时间，单位：秒。
        </vc-tips-pop>
      </template>
      <a-input-number
        :min="1"
        :precision="1"
        :step="1"
        class="suffix-input-number"
        v-model="formState.time_duration"
      >
        <template #suffix>
          <a-tag color="gray" class="suffix-tag">秒</a-tag>
        </template>
      </a-input-number>
    </a-form-item>
    <!-- <a-form-item>
      <vc-tips-pop title="调整到视频范围内">
        <div>
          水印设置的开始时间在视频范围内，若设置持续时间后超出了视频范围，是否自动调整到视频范围内。
        </div>
        <div>开启，调整到视频范围内；</div>
        <div>关闭，不处理；</div>
        <div>
          示例：视频时长60s，水印开始时间0s，持续时间65s，启用后，会自动将持续时间调整到视频范围内。
        </div>
      </vc-tips-pop>
      <a-switch
        class="ml-8px!"
        :unchecked-value="2"
        :checked-value="1"
        v-model="formState.time_adjustment"
      />
    </a-form-item> -->
  </template>
</template>

<script setup lang="ts">
import type { FormInstance, FormItemInstance } from '@arco-design/web-vue'
import { getMtsPresetFontApi, type WatermarkPresetModel } from '@vca/apis/mts'
import type { fileListModel } from '@vca/apis/oss'
import { useFormField, useSelectRemote } from 'vc-material'

import ColorPicker from '@/components/ColorPicker.vue'
import { watermarkTypeOpts } from '@/utils/opts/preset'

import LocationButton from '../../../common/LocationButton.vue'
import TimeInput from '../../../common/TimeInput.vue'
import { watermarkSuffixList } from '../../utils/suffix'
import SpaceObjectSelect from '../transcode/SpaceObjectSelect.vue'

const props = defineProps<{
  data: WatermarkPresetModel
  dataLoaded: boolean
  timeLineVisible: boolean
  regionId: string
  formRef: FormInstance | undefined
}>()

const emit = defineEmits<{
  'update:timeLineVisible': [value: boolean]
}>()

const formState = computed(() => props.data)
const imagePathRef = ref<FormItemInstance>()
const timeDurationRef = ref<FormItemInstance>()

const timeLineSwitch = useVModel(props, 'timeLineVisible', emit)

const { setFieldError } = useFormField<'image_path'>(toRef(props, 'formRef'))

function checkObject(item: fileListModel) {
  const suffixList = watermarkSuffixList.slice()
  const fileSize = 20
  const msg = `只能是${suffixList.join('/')} 文件，且不超过 ${fileSize}MB。`
  const suffix = item.key!.split('.').filter(Boolean)
  const hasSuffix =
    suffixList.length >= 2 && suffixList.includes(suffix.pop()?.toLowerCase()!)
  if ((+item.size! || 0) > fileSize * 1024 * 1024 || !hasSuffix) {
    setFieldError('image_path', msg)
    return false
  }
  return true
}

const { loading: fontLoading, opts: fontOpts } = useSelectRemote(
  getMtsPresetFontApi,
  {
    labelKey: 'name',
    valueKey: 'key'
  }
)

defineExpose({ imagePathRef })
</script>

<style lang="less" scoped>
.tab-btn-box {
  display: flex;
  align-items: center;
  width: 100%;
  .tab-btn {
    cursor: pointer;
    padding: 6px 0;
    font-size: 14px;
    text-align: center;
    color: var(--color-text-1, #1d2129);
    border: 1px solid;
    border-color: var(--color-border-2);
    border-radius: 6px;
    flex: 1;
    font-weight: 400;
    line-height: 20px;
    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
    }
    &.active {
      z-index: 1;
      color: rgb(var(--primary-6));
      background: rgb(var(--primary-1));
      border-color: rgb(var(--primary-6));
    }
  }
}
</style>
