<template>
  <a-modal
    modal-class="vc-dialog form-dialog"
    title-align="start"
    v-model:visible="modelValue"
    :esc-to-close="false"
    :mask-closable="false"
    :cancel-button-props="{ loading }"
    title="修改密码"
    :width="480"
    @before-ok="handleConfirm"
    @before-close="handleBeforeClose"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        asterisk-position="end"
        validate-trigger="input"
        field="password"
        label="原密码"
      >
        <a-input-password
          :max-length="64"
          :key="String(modelValue)"
          v-model="formState.password"
          placeholder="请输入原密码"
        ></a-input-password>
      </a-form-item>
      <a-form-item
        ref="newPasswordRef"
        asterisk-position="end"
        validate-trigger="input"
        field="new_password"
        label="新密码"
        class="mb-6!"
        :help="newPasswordHelp"
      >
        <a-input-password
          :max-length="64"
          :key="String(modelValue)"
          v-model="formState.new_password"
          placeholder="请输入新密码"
        ></a-input-password>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="input"
        field="repeat_new_password"
        label="确认新密码"
      >
        <a-input-password
          :max-length="64"
          :key="String(modelValue)"
          v-model="formState.repeat_new_password"
          placeholder="请再次输入新密码"
        ></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  adminUpdatePwdApi,
  type AxiosResponse,
  type Result,
  ResultEnum
} from '@vca/apis/pedestal'
import { computed } from 'vue'

const formRef = ref<FormInstance>()
const modelValue = defineModel()
const loading = defineModel<boolean>('loading', { default: false })

const formState = ref<{
  password: string
  new_password: string
  repeat_new_password: string
}>({
  password: '',
  new_password: '',
  repeat_new_password: ''
})

const newPasswordRef = ref<FormItemInstance>()

const NEW_PASSWORD_HELP =
  '请输入6-64个字符，可包含英文字母、数字和标点符号（除空格）'
const newPasswordHelp = ref<string | undefined>(NEW_PASSWORD_HELP)
watchEffect(() => {
  newPasswordHelp.value = newPasswordRef.value?.isError
    ? undefined
    : NEW_PASSWORD_HELP
})
const passwordValidate = (value: any, callback: (error?: string) => void) => {
  const reg = /^[0-9a-zA-Z_()`!@#$%^&*_\-+=|{}[\]:;'<>,.?]{6,64}$/

  if (!value) {
    return callback('密码不能为空')
  }
  if (!reg.test(value)) {
    callback('请输入6-64个字符，可包含英文字母、数字和标点符号（除空格）')
  }
}
const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    new_password: [{ required: true, validator: passwordValidate }],
    password: [{ required: true, message: '密码不能为空' }],
    repeat_new_password: [
      {
        required: true,
        validator(value, callback) {
          if (value !== formState.value.new_password) {
            callback('两次密码输入不一致')
          } else {
            callback()
          }
        }
      }
    ]
  }
  return res
})

const handleCancel = () => {
  modelValue.value = false
}

const handleBeforeClose = (done: any) => {
  formRef.value?.resetFields()
  nextTick(done)
}
/** 编辑提交事件 */
const handleEditorSubmit = async () => {
  try {
    const { data } = (await adminUpdatePwdApi(
      formState.value
    )) as unknown as AxiosResponse<Result>
    const { code, message } = data
    if (code === ResultEnum.SUCCESS) {
      Message.success('修改成功')
      return true
    } else if (ResultEnum.Old_PASSWORD_ERROR === code) {
      formRef.value?.setFields({
        password: {
          message: message,
          status: 'error'
        }
      })
    } else if (ResultEnum.PASSWORD_OLD_EQ_NEW === code) {
      formRef.value?.setFields({
        new_password: {
          message: message,
          status: 'error'
        }
      })
    } else {
      Message.error(message || '')
    }
    return false
  } catch (e) {
    return false
  }
}

const handleConfirm = async () => {
  const errors = await formRef.value?.validate()
  if (errors) {
    return false
  }
  return handleEditorSubmit()
}
</script>
