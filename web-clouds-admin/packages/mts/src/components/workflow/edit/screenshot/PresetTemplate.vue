<template>
  <a-form :model="formState" ref="formRef" :rules="rules" layout="vertical">
    <a-form-item label="截图方式">
      <a-radio-group @change="handleScreenshotChange" v-model="screenshot">
        <a-radio :value="1">单张截图</a-radio>
        <a-radio :value="2">多张截图</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item hide-asterisk label="截图预设" field="screenshot_preset_id">
      <a-select
        placeholder="请选择预设"
        v-model="formState.screenshot_preset_id"
        :loading="presetLoading"
        :options="presetOpts"
      /> </a-form-item
  ></a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import { getMtsPresetListApi, type WorkflowScreenshotConf } from '@vca/apis/mts'
import { cloneDeep, omit } from 'lodash-es'
import { useRequest } from 'vc-material'

const props = defineProps<{
  data: WorkflowScreenshotConf
  dataLoaded: boolean
}>()

const initPresetState = (): WorkflowScreenshotConf['screenshot_preset'] => ({
  screenshot: 1
})

const rules: Rules = {
  screenshot_preset_id: [{ required: true, message: '请选择预设' }]
}

const formRef = ref<FormInstance>()
const formState = ref<WorkflowScreenshotConf>({})
const screenshot = computed({
  get: () => formState.value.screenshot_preset?.screenshot,
  set: val => {
    if (formState.value.screenshot_preset)
      formState.value.screenshot_preset.screenshot = val
  }
})

const {
  loading: presetLoading,
  data: presetData,
  run
} = useRequest(getMtsPresetListApi, { preset_type: 3 })
run()

const presetList = computed(
  () => presetData.value?.screenshot_preset_list || []
)
const presetOpts = computed(() => {
  return presetList.value
    .filter(v => v.screenshot === screenshot.value)
    .map(item => ({
      label: item.name,
      value: item.id
    }))
})

function handleScreenshotChange() {
  formState.value.screenshot_preset_id = undefined
  formState.value.screenshot_preset = {
    screenshot: formState.value.screenshot_preset?.screenshot
  }
}

watch(
  () => formState.value.screenshot_preset_id,
  id => {
    if (!id) return
    const item = presetList.value!.find(v => v.id === id)!

    // @ts-ignore
    formState.value.screenshot_preset = cloneDeep(omit(item, ['id', 'name']))
  }
)

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    formState.value = cloneDeep(props.data)
    if (!formState.value.screenshot_preset) {
      formState.value.screenshot_preset = {}
    }
    formState.value.screenshot_preset = {
      ...initPresetState(),
      ...formState.value.screenshot_preset
    }
  },
  { immediate: true }
)

function getData(isSubmit = false) {
  const preset = isSubmit ? { screenshot_preset: undefined } : {}
  const state = { ...formState.value, ...preset }
  return state
}

defineExpose({ getData, validate: () => formRef.value?.validate() })
</script>
