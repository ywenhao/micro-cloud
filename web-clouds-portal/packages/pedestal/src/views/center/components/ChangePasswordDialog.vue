<template>
  <vc-dialog
    title="修改密码"
    v-model="visible"
    :loading="loading"
    @close="handleClose"
    :on-before-ok="handleSubmit"
    modal-class="form-dialog"
  >
    <a-form
      ref="formRef"
      :key="formKey"
      :model="formState"
      layout="vertical"
      :rules="rules"
    >
      <a-form-item asterisk-position="end" label="原密码" field="password">
        <password-input
          v-model="formState.password"
          placeholder="请输入原密码"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        ref="newPasswordRef"
        asterisk-position="end"
        label="新密码"
        field="new_password"
        class="help-item"
        :help="newPasswordHelp"
      >
        <password-input
          v-model="formState.new_password"
          placeholder="请输入新密码"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        label="确认新密码"
        field="repeat_new_password"
      >
        <password-input
          v-model="formState.repeat_new_password"
          autocomplete="off"
          placeholder="请再次输入新密码"
        />
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import { ResultEnum } from '@vcp/apis'
import { updatePasswordApi } from '@vcp/apis/pedestal'
import { passwordValidate } from 'vc-material'

const props = defineProps<{
  modelValue: boolean
}>()

const visible = useVModel(props, 'modelValue')

const formRef = ref<FormInstance>()
const newPasswordRef = ref<FormItemInstance>()
const loading = ref(false)
const formKey = ref(Date.now())

interface FormState {
  password: string
  new_password: string
  repeat_new_password: string
}

const formState = reactive<FormState>({
  password: '',
  new_password: '',
  repeat_new_password: ''
})

const setFieldError = (
  field: 'password' | 'new_password',
  message?: string
) => {
  formRef.value?.setFields({
    [field]: message
      ? {
          status: 'error',
          message
        }
      : {
          status: undefined
        }
  })
}

const newPasswordHelp = ref()

watchEffect(() => {
  newPasswordHelp.value = newPasswordRef?.value?.isError
    ? undefined
    : '请输入6-64个字符，可包含英文字母、数字和标点符号（除空格）'
})

const validatePass2 = (value: any, callback: (error?: string) => void) => {
  if (!value) {
    return callback('请再次输入新密码')
  }
  if (value !== formState.new_password) {
    return callback('两次密码输入不一致')
  }
}
const rules: Record<keyof FormState, FieldRule[]> = {
  password: [{ required: true, message: '密码不能为空' }],
  new_password: [
    {
      required: true,
      message: '密码不能为空'
    },
    {
      validator(value, callback: (error?: string) => void) {
        if (value === formState.password) {
          return callback('新密码不能与原密码相同')
        }
      }
    },
    {
      validator: passwordValidate
    }
  ],
  repeat_new_password: [
    { required: true, message: '两次密码输入不一致' },
    { validator: validatePass2 }
  ]
}

const handleSubmit = async () => {
  const validate = await formRef.value?.validate()
  if (validate) return false

  loading.value = true
  setFieldError('password')
  setFieldError('new_password')
  try {
    const res = await updatePasswordApi(formState)
    if (res.code === ResultEnum.SUCCESS) {
      Message.success('修改成功')
      return true
    } else if (res.code === ResultEnum.ErrOldPasswordWrong) {
      setFieldError('password', '原密码不正确，请重新输入')
    } else if (res.code === ResultEnum.ErrPasswordSame) {
      setFieldError('new_password', '新密码不能与原密码相同')
    } else {
      Message.error((res.message as string) || '')
    }
    return false
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  setFieldError('password')
  setFieldError('new_password')
  formRef.value?.resetFields()
  formKey.value = Date.now()
}
</script>
