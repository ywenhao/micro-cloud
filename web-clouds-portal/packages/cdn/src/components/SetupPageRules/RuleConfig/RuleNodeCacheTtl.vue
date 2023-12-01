<template>
  <a-form ref="formRef" class="w-full" :model="formData" :rules="formRules">
    <a-form-item
      validate-trigger="change"
      class="w-full mb-0!"
      hide-label
      field="value"
    >
      <a-select
        placeholder="请选择"
        v-model="formData.value"
        :options="options"
        class="w-full"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import type { Ref } from 'vue'

import type { RuleValue } from './types'

export interface IEmit {
  (event: 'update:modelValue', value: RuleValue): void
}

export interface IProps {
  modelValue: RuleValue
}

const emit = defineEmits<IEmit>()
const props = defineProps<IProps>()

const formRef = ref<FormInstance>()
const formData = reactive({
  value: useVModel(props, 'modelValue', emit) as Ref<number>
})
const formRules = computed<Rules>(() => {
  return {
    value: [{ required: true, message: '请选择节点缓存TTL' }]
  }
})
watch(
  () => formData,
  async () => {
    await nextTick()
    formRef.value?.validate()
  },
  { deep: true }
)

const options: LabelValue<number>[] = [
  { label: '20分钟', value: 1200 },
  { label: '30分钟', value: 1800 },
  { label: '1小时', value: 3600 },
  { label: '2小时', value: 7200 },
  { label: '3小时', value: 10800 },
  { label: '4小时', value: 14400 },
  { label: '5小时', value: 18000 },
  { label: '8小时', value: 28800 },
  { label: '10小时', value: 36000 },
  { label: '15小时', value: 54000 },
  { label: '18小时', value: 64800 },
  { label: '20小时', value: 72000 }
]

defineExpose({
  validate() {
    return formRef.value?.validate()
  }
})
</script>
