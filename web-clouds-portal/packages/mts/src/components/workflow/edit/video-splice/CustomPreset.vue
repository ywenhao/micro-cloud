<template>
  <a-form :model="presetState" ref="formRef" layout="vertical">
    <video-splice-form-item
      :data="presetState"
      :region-id="regionId"
      :dataLoaded="dataLoaded"
    />
  </a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import type { SplicePresetModel, WorkflowSpliceConf } from '@vcp/apis/mts'
import { cloneDeep, merge } from 'lodash-es'

import VideoSpliceFormItem from '../../form/video-splice/VideoSpliceFormItem.vue'
import { filterState, initBackState, initState } from '../../utils/videoSplice'

const props = defineProps<{
  dataLoaded: boolean
  data: WorkflowSpliceConf
}>()

const regionId = inject('regionId') as Ref<string>

const formRef = ref<FormInstance>()
const formState = ref<WorkflowSpliceConf>({})
const presetState = computed(
  () => formState.value.splice_preset as SplicePresetModel
)

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    formState.value = cloneDeep(props.data)
    if (!formState.value.splice_preset) {
      formState.value.splice_preset = initState()
    }
    const state = initBackState({
      ...initState(),
      ...formState.value.splice_preset!
    })
    merge(presetState.value, state)
  },
  { immediate: true }
)

function getData() {
  const state = { ...formState.value, splice_preset_id: undefined }
  const preset = filterState({ ...state.splice_preset })
  state.splice_preset = preset
  return state
}

defineExpose({ getData, validate: () => formRef.value?.validate() })
</script>
