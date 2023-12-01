<template>
  <vc-dialog
    title="新建队列"
    :loading="loading"
    v-model="visible"
    :on-before-ok="handleSubmit"
    @close="handleClose"
  >
    <a-form ref="formRef" :rules="rules" :model="formState" layout="vertical">
      <a-form-item
        field="name"
        :help="
          nameRef?.isError
            ? undefined
            : '队列名称只能由 0-9、A-Z、a-z、-、_ 组成，长度为5-20'
        "
        ref="nameRef"
        label="队列名称"
        hide-asterisk
        validate-trigger="input"
      >
        <a-input
          :max-length="20"
          show-word-limit
          v-model="formState.name"
          placeholder="请输入名称"
        />
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import { addMtsQueueApi } from '@vcp/apis/mts'

interface IProps {
  modelValue: boolean
  checkName: (name: string) => string | undefined
}

interface IEmits {
  (event: 'submit'): void
  (event: 'update:modelValue', value: string): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()
const visible = useVModel(props, 'modelValue')
const formRef = ref<FormInstance>()
const nameRef = ref<FormItemInstance>()

const formState = reactive({
  name: ''
})

const reg = /^[0-9A-Za-z_-]{5,20}$/
const rules: Rules = {
  name: [
    { required: true, message: '请输入名称' },
    {
      match: reg,
      message: '队列名称只能由 0-9、A-Z、a-z、-、_ 组成，长度为5-20'
    },
    {
      validator: (value, callback) => callback(props.checkName(value))
    }
  ]
}

const loading = ref(false)
async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  try {
    loading.value = true
    await addMtsQueueApi({
      name: formState.name.trim()
    })
    Message.success('创建成功')
    emit('submit')
  } finally {
    loading.value = false
  }
}

function handleClose() {
  formRef.value?.resetFields()
}
</script>
