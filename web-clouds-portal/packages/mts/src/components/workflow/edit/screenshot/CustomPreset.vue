<template>
  <a-form :model="presetState" ref="formRef" layout="vertical">
    <screenshot-form-item
      :data="presetState"
      :dataLoaded="dataLoaded"
      :form-ref="formRef"
    />
  </a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import type {
  ScreenshotPresetModel,
  WorkflowScreenshotConf
} from '@vcp/apis/mts'
import { cloneDeep, merge } from 'lodash-es'

import ScreenshotFormItem from '../../form/screenshot/ScreenshotFormItem.vue'
import { filterState, initBackState, initState } from '../../utils/screenshot'

const props = defineProps<{
  dataLoaded: boolean
  data: WorkflowScreenshotConf
}>()

const formRef = ref<FormInstance>()
const formState = ref<WorkflowScreenshotConf>({})
const presetState = computed(
  () => formState.value.screenshot_preset as ScreenshotPresetModel
)

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    formState.value = cloneDeep(props.data)
    if (!formState.value.screenshot_preset) {
      formState.value.screenshot_preset = initState()
    }
    const state = initBackState({
      ...initState(),
      ...formState.value.screenshot_preset!
    })
    merge(presetState.value, state)
  },
  { immediate: true }
)

function getData() {
  const state = { ...formState.value, screenshot_preset_id: undefined }
  const preset = filterState({ ...state.screenshot_preset })
  state.screenshot_preset = preset
  return state
}

defineExpose({ getData, validate: () => formRef.value?.validate() })
</script>
