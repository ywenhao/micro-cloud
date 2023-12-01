<template>
  <div class="form-box">
    <a-form
      :model="videoFormState"
      ref="videoFormRef"
      :rules="videoRules"
      layout="vertical"
    >
      <b-title>转码设置</b-title>
      <div class="box-body">
        <transcode-tab-form
          ref="tabFormRef"
          :data="videoFormState"
          :dataLoaded="true"
        />
      </div>
    </a-form>
  </div>
  <div class="form-box">
    <b-title
      >水印设置
      <a-switch
        class="ml-8px!"
        @change="handleWatermarkSwitch"
        v-model="watermarkSwitch"
      />
    </b-title>

    <div class="box-body" v-if="watermarkSwitch">
      <div class="watermark-tabs">
        <a-button
          v-for="(item, index) in watermarkList"
          :key="item.id"
          @click="watermarkActive = index"
          type="outline"
          class="config-btn"
          :class="{ active: watermarkActive === index }"
          >水印{{ index + 1 }}
          <template v-if="watermarkList.length > 1">
            <icon-close
              size="16"
              class="cursor-pointer!"
              @click.stop="handleDeleteWatermark(index)"
            />
          </template>
        </a-button>
        <div
          class="add-btn"
          @click="handleAddWatermark"
          v-if="watermarkList.length <= 50"
        >
          <icon-plus size="16" />
          <div class="ml-4px">添加水印</div>
        </div>
      </div>
      <a-form
        ref="watermarkFormRefs"
        layout="vertical"
        :rules="watermarkRules"
        :model="watermarkList[index]"
        v-for="(item, index) in watermarkList"
        :key="index"
        v-show="watermarkActive === index"
      >
        <a-form-item hide-label>
          <watermark-show width="100%" :height="260" :data="item" />
        </a-form-item>
        <a-form-item label="预览画面尺寸" required asterisk-position="end">
          <div flex w="full" items-center>
            <a-input-number
              :min="1"
              :step="1"
              :precision="0"
              v-model="item.preview_w"
              placeholder="请输入宽度"
            />
            <div class="color-ct-3 mx-8px">x</div>
            <a-input-number
              :min="1"
              :step="1"
              :precision="0"
              v-model="item.preview_h"
              placeholder="请输入高度"
            />
          </div>
        </a-form-item>
        <watermark-form-item
          ref="watermarkRefs"
          :form-ref="watermarkFormRefs?.[index]"
          :region-id="regionId"
          :data="item"
          :data-loaded="true"
          :time-line-visible="!!time_line[index]"
          @update:time-line-visible="time_line[index] = !!$event"
        />
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormItemInstance } from '@arco-design/web-vue'
import type {
  VideoPresetModel,
  WatermarkPresetModel,
  WorkflowVideoConf
} from '@vcp/apis/mts'
import { cloneDeep, merge } from 'lodash-es'

import BTitle from '@/components/common/BTitle.vue'
import TranscodeTabForm, {
  type ConfigKey
} from '@/components/workflow/form/transcode/TranscodeTabForm.vue'
import WatermarkFormItem from '@/components/workflow/form/watermark/WatermarkFormItem.vue'
import WatermarkShow from '@/components/workflow/form/watermark/WatermarkShow.vue'
import {
  filterState as filterVideoState,
  initBackState as initBackVideoState,
  initState as initVideoState
} from '@/components/workflow/utils/transcode'
import {
  filterState as filterWatermarkState,
  initState as initWatermarkState
} from '@/components/workflow/utils/watermark'

const props = defineProps<{
  data: WorkflowVideoConf
  dataLoaded: boolean
}>()

const regionId = inject('regionId') as Ref<string>
const videoFormRef = ref<FormInstance>()
const tabFormRef = ref()
const btnActive = computed<ConfigKey[]>(
  () => tabFormRef?.value?.btnActive || []
)
const watermarkFormRefs = ref<FormInstance[]>()
const watermarkRefs = ref<any[]>([])
const imagePathRefs = computed<FormItemInstance[]>(() =>
  watermarkRefs.value?.map(v => v?.imagePathRef)
)

const formState = ref<WorkflowVideoConf>({})

const videoFormState = computed(
  () => formState.value.video_preset as VideoPresetModel
)
const watermarkList = computed(
  () => videoFormState.value?.watermark_list || []
) as ComputedRef<WatermarkPresetModel[]>

const time_line = reactive<boolean[]>([])

const videoRules: Rules = {}

const watermarkRules: Rules = {
  image_path: [{ required: true, message: '请选择水印' }],
  text_word: [{ required: true, message: '请输入内容' }]
}

const watermarkSwitch = ref(false)

const watermarkActive = ref(0)

function handleAddWatermark() {
  watermarkList.value.push({ ...initWatermarkState() })
  time_line.push(false)
}

function handleDeleteWatermark(index: number) {
  watermarkList.value.splice(index, 1)
  time_line.splice(index, 1)
}

function getVideoState() {
  if (!formState.value.video_preset) {
    // @ts-ignore
    formState.value.video_preset = initVideoState()
  }
  const state = initBackVideoState({ ...props.data?.video_preset })
  merge(videoFormState.value, state)
}

// 回显处理
function getWatermarkState<T extends Record<string, any>>(value: T) {
  const state = { ...value }
  for (const key in state) {
    if (key === 'name') continue
    if (!Array.isArray(state[key]) && state[key] === 0) {
      // @ts-ignore
      state[key] = undefined
    }
  }
  const timeState = Object.keys(state).filter(key => key.startsWith('time'))
  const idx = watermarkList.value.findIndex(v => v.id === state.id)
  time_line[idx] = !!timeState.length
  return state
}

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    formState.value = cloneDeep(props.data)
    getVideoState()
    watermarkSwitch.value = !!watermarkList.value.length
  },
  { immediate: true }
)

// 过滤参数
function filterState() {
  const state = { ...formState.value, video_preset_id: undefined }
  // video
  // @ts-ignore
  state.video_preset = filterVideoState(state.video_preset!, btnActive.value)

  // watermark
  if (watermarkSwitch.value) {
    const video_preset = state.video_preset!
    if (!video_preset.watermark_list) video_preset.watermark_list = []
    const watermark_list = video_preset.watermark_list!
    watermark_list.forEach((item, index) => {
      watermark_list[index] = filterWatermarkState(
        item,
        toRef(() => time_line[index])
      )
    })
  } else {
    state.video_preset!.watermark_list = []
  }
  return state
}

function handleWatermarkSwitch() {
  const value = watermarkSwitch.value
  if (value && !watermarkList.value.length) {
    const list = [{ ...initWatermarkState() }]
    videoFormState.value.watermark_list = list.map(v => getWatermarkState(v))
    time_line.length = 0
    time_line.push(false)
  }
}

async function checkErr() {
  const videoErr = await videoFormRef.value?.validate()
  if (videoErr) return videoErr
  // 水印组校验
  if (watermarkSwitch.value) {
    if (imagePathRefs.value.some(v => v?.isError)) return true
    const waterErrs = await Promise.all(
      watermarkFormRefs.value!.map(v => v.validate())
    )
    if (waterErrs.some(v => v)) return waterErrs.filter(Boolean)
  }
  return false
}

function getData() {
  const state = filterState()
  return state
}

defineExpose({ getData, validate: () => checkErr() })
</script>

<style lang="less" scoped>
.form-box {
  border: 1px solid var(--color-border-1);
  border-radius: 6px;

  & + .form-box {
    margin-top: 32px;
  }

  .box-body {
    padding: 16px;
  }
}

.watermark-tabs {
  display: flex;
  margin-bottom: 8px;
  width: 100%;
  font-size: 14px;
  flex-wrap: wrap;
  // gap: 8px;
  gap: 6px;
  font-weight: 400;
  line-height: 20px;

  .config-btn {
    justify-content: space-around;
    padding: 0 8px;
    margin: 0;
    width: 97px;
    height: 28px;

    &.active {
      color: rgb(var(--primary-6));
      background: rgb(var(--primary-1, #e8f3ff));
      border-color: rgb(var(--primary-6));
    }
  }

  .add-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 97px;
    height: 28px;
    color: rgb(var(--primary-6));
    border: 1px dashed var(--color-border-2);
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.1s;

    &:hover {
      color: rgb(var(--primary-5));
      border-color: rgb(var(--primary-6));
    }
  }
}

:deep(.arco-form-item) {
  .arco-form-item {
    margin-bottom: 0;
  }
}

:deep(.arco-form) {
  .arco-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
