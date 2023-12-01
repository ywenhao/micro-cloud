<template>
  <a-form ref="formRef" :model="formData" :rules="formRules" inline>
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
    value: [{ required: true, message: '请选择缓存级别' }]
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
const options: LabelValue[] = [
  { label: '没有查询字符串', value: 1 },
  { label: '忽略查询字符串', value: 2 },
  { label: '标准', value: 3 }
]

defineExpose({
  validate() {
    return formRef.value?.validate()
  }
})
</script>
