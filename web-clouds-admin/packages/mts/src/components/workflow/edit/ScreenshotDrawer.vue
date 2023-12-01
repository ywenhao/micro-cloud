<template>
  <a-drawer
    title="截图"
    :width="600"
    v-model:visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    class="tab-drawer"
  >
    <a-tabs v-model:active-key="active">
      <a-tab-pane :key="0" title="预设模板">
        <preset-template
          :data="formState"
          :dataLoaded="dataLoaded"
          :ref="el => formRefs.push(el)"
        />
      </a-tab-pane>
      <a-tab-pane :key="1" title="自定义预设">
        <custom-preset
          :data="formState"
          :data-loaded="dataLoaded"
          :ref="el => formRefs.push(el)"
        />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup lang="ts">
import type { WorkflowScreenshotConf } from '@vca/apis/mts'
import { isEmpty } from 'lodash-es'

import type { NodeTypeKeys } from '@/components/flow/types'

import CustomPreset from './screenshot/CustomPreset.vue'
import PresetTemplate from './screenshot/PresetTemplate.vue'

const props = defineProps<{
  id: string
  type: NodeTypeKeys
  modelValue: boolean
  data: WorkflowScreenshotConf
  dataLoaded: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = useVModel(props, 'modelValue', emit)

const active = ref(0)
const formRefs = ref<any[]>([])
const formRef = computed(() => formRefs.value[active.value])
const formState = computed(() => props.data)

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    active.value =
      isEmpty(formState.value) || formState.value.screenshot_preset_id ? 0 : 1
  },
  { immediate: true }
)

function getData(isSubmit = false) {
  const data = formRef.value?.getData(isSubmit)
  return { data, id: props.id, type: props.type }
}

defineExpose({ getData, validate: () => formRef.value?.validate() })
</script>
