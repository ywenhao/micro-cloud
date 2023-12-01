<template>
  <a-modal
    :width="480"
    modal-class="vc-modal message-box"
    title-align="start"
    cancel-text="取消"
    :hideCancel="false"
    :simple="false"
    :cancelButtonProps="{ type: 'outline' }"
    ok-text="确定"
    v-model:visible="visible"
    title="确认重置密码"
    @before-close="handleBeforeClose"
    @before-ok="handleBeforeOk"
  >
    <a-alert class="mb-6">
      <template #icon> <icon-info-circle-fill /> </template>
      {{ isUser }}
      确定重置该用户密码吗？
    </a-alert>
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-form-item asterisk-position="end" field="password" label="密码">
        <a-input-password
          placeholder="请输入密码"
          :key="String(visible)"
          :max-length="64"
          v-model="form.password"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { IconInfoCircleFill } from '@arco-design/web-vue/es/icon'
import { adminResetApi, updateUserPasswordResetApi } from '@vca/apis/pedestal'
import { passwordValidate } from 'vc-material'

const loading = ref(false)
const visible = defineModel<boolean>()
const isUser = defineModel<boolean>('isUser')
const recordId = defineModel<string>('recordId')
const formRef = ref<FormInstance>()
const form = reactive({
  password: DEFAULT_PASSWORD
})

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    password: [{ required: true, validator: passwordValidate }]
  }
  return res
})

const handleBeforeClose = () => {
  form.password = DEFAULT_PASSWORD
  visible.value = false
  formRef.value?.clearValidate()
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    const action = isUser.value ? updateUserPasswordResetApi : adminResetApi
    action({
      id: recordId.value!,
      password: form.password
    })
      .then(() => {
        Message.success('重置成功')
        resolve(true)
      })
      .catch(() => reject())
      .finally(() => {
        loading.value = false
      })
  })
}

const handleBeforeOk = (done: (closed: boolean) => void) => {
  formRef.value
    ?.validate()
    .then(res => {
      if (!res) {
        return handleEditorSubmit()
      }
      done(false)
    })
    .then(() => done(true))
    .catch(() => done(false))
}
</script>
