<template>
  <a-form :model="formState" ref="formRef" :rules="rules" layout="vertical">
    <a-form-item hide-asterisk label="视频拼接预设" field="splice_preset_id">
      <a-select
        placeholder="请选择预设"
        v-model="formState.splice_preset_id"
        :loading="presetLoading"
        :options="presetOpts"
      /> </a-form-item
  ></a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import { getMtsPresetListApi, type WorkflowSpliceConf } from '@vca/apis/mts'
import { cloneDeep, omit } from 'lodash-es'
import { useRequest } from 'vc-material'

const props = defineProps<{
  data: WorkflowSpliceConf
  dataLoaded: boolean
}>()

const rules: Rules = {
  splice_preset_id: [{ required: true, message: '请选择预设' }]
}

const formRef = ref<FormInstance>()
const formState = ref<WorkflowSpliceConf>({})

const {
  loading: presetLoading,
  data: presetData,
  run
} = useRequest(getMtsPresetListApi, { preset_type: 4 })
run()

const presetList = computed(() => presetData.value?.splice_preset_list || [])
const presetOpts = computed(() => {
  return presetList.value.map(item => ({
    label: item.name,
    value: item.id
  }))
})

watch(
  () => formState.value.splice_preset_id,
  id => {
    if (!id) return
    const item = presetList.value!.find(v => v.id === id)!

    // @ts-ignore
    formState.value.splice_preset = cloneDeep(omit(item, ['id', 'name']))
  }
)

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    formState.value = cloneDeep(props.data)
  },
  { immediate: true }
)

function getData(isSubmit = false) {
  const preset = isSubmit ? { splice_preset: undefined } : {}
  const state = { ...formState.value, ...preset }
  return state
}

defineExpose({ getData, validate: () => formRef.value?.validate() })
</script>
