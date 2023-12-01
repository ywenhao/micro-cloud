<template>
  <a-form
    ref="formRef"
    class="w-full"
    :model="formData"
    :rules="formRules"
    inline
  >
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
  modelValue: number | null
}

const emit = defineEmits<IEmit>()
const props = defineProps<IProps>()

const formRef = ref<FormInstance>()
const formData = reactive({
  value: useVModel(props, 'modelValue', emit) as Ref<number>
})
const formRules = computed<Rules>(() => {
  return {
    value: [{ required: true, message: '请选择浏览器缓存TTL' }]
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
  { label: '2分钟', value: 120 },
  { label: '5分钟', value: 300 },
  { label: '20分钟', value: 1200 },
  { label: '30分钟', value: 1800 },
  { label: '1小时', value: 3600 },
  { label: '2小时', value: 7200 },
  { label: '3小时', value: 10800 },
  { label: '4小时', value: 14400 },
  { label: '8小时', value: 28800 },
  { label: '16小时', value: 57600 },
  { label: '20小时', value: 72000 },
  { label: '1天', value: 86400 },
  { label: '2天', value: 172800 },
  { label: '3天', value: 259200 },
  { label: '4天', value: 345600 },
  { label: '5天', value: 432000 },
  { label: '16天', value: 1382400 },
  { label: '24天', value: 2073600 },
  { label: '2个月', value: 5184000 },
  { label: '6个月', value: 15552000 },
  { label: '1年', value: 31536000 }
]

defineExpose({
  validate() {
    return formRef.value?.validate()
  }
})
</script>
