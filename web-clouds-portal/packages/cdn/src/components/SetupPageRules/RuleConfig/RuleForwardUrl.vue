<template>
  <a-form
    ref="formRef"
    inline
    :model="formData"
    :rules="formRules"
    label-width="0"
    class="flex items-center w-full"
  >
    <a-form-item
      class="w-full mb-0!"
      validate-trigger="input"
      hide-label
      field="value"
    >
      <a-input
        v-model="formData.value"
        placeholder="请输入完整的URL"
        class="w-[160px]"
      ></a-input>
    </a-form-item>
    <a-form-item
      validate-trigger="change"
      class="flex-1 ml-4 mb-0!"
      hide-label
      field="code"
    >
      <a-select
        placeholder="请选择"
        v-model="formData.code"
        :options="options"
        class="w-full"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'

interface IData {
  destination_url: string
  status_code: number
}

interface IEmit {
  (event: 'update:modelValue', value: IData): void
}

interface IProps {
  modelValue: IData | null
}

const emit = defineEmits<IEmit>()
const props = defineProps<IProps>()

const formRef = ref<FormInstance>()
const formData = reactive({
  code: props.modelValue?.status_code || undefined,
  value: props.modelValue?.destination_url
})
const formRules = computed<Rules>(() => {
  return {
    value: [
      { required: true, message: '请输入完整的URL' },
      { validator: validateURL }
    ],
    code: [{ required: true, message: '请选择状态码' }]
  }
})

const options: LabelValue[] = [
  { label: '301永久重定向', value: 301 },
  { label: '302临时重定向', value: 302 }
]

watch(
  formData,
  async () => {
    emit('update:modelValue', {
      destination_url: formData.value as string,
      status_code: formData.code as number
    })

    await nextTick()
    formRef.value?.validate()
  },
  { deep: true }
)

defineExpose({
  validate() {
    return formRef.value?.validate()
  }
})
</script>

<style scoped lang="less">
.el-form-item {
  margin: 0;
}
</style>
