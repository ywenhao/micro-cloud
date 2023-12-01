<template>
  <vc-dialog
    :title="title"
    v-model="visible"
    :loading="loading"
    @close="handleClose"
    :on-before-ok="handleSubmit"
    modal-class="form-dialog"
  >
    <a-form
      :label-col-props="{ span: 0 }"
      :wrapper-col-props="{ span: 24 }"
      ref="formRef"
      :model="formState"
      :rules="rules"
      class="w-full"
    >
      <a-form-item field="account">
        <div v-if="step === 1 && isChangeType" class="flex flex-col gap-y-2">
          <span class="text-[#868d9d]">请先验证身份</span>
          <span class="text-[#454954] flex items-center gap-x-1"
            >发送验证码 至
            <span><vc-text-ell :content="appStore.userInfo?.email" /></span
          ></span>
        </div>
        <a-input
          v-else
          v-model="formState.account"
          placeholder="请输入邮箱地址"
          :max-length="200"
        ></a-input>
      </a-form-item>
      <a-form-item field="code">
        <a-input v-model="formState.code" placeholder="请输入验证码">
          <template #suffix>
            <a-button
              type="text"
              class="send-code-btn"
              :disabled="sending || captchaWait"
              @click="handleGetCaptcha"
              >{{ captchaValue }}</a-button
            >
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import {
  adminEditApi,
  captchaSendApi,
  captchaValidateApi,
  ResultEnum
} from '@vcp/apis/pedestal'
import { pick } from 'lodash-es'
import { emailReg, useVerifyCode } from 'vc-material'

const props = defineProps<{
  modelValue: boolean
}>()

const visible = useVModel(props, 'modelValue')

const formRef = ref<FormInstance>()
const appStore = useAppStore()

const sending = ref(false)
const step = ref<1 | 2>(1)
const isChangeType = computed(() => !!appStore.userInfo?.email)

const title = computed(() => (isChangeType.value ? '修改邮箱' : '绑定邮箱'))

const formState = reactive({
  account: '',
  code: '',
  scene: 2
})

watchEffect(() => {
  if (isChangeType.value) {
    // 修改邮箱(老邮箱)
    if (step.value === 1) {
      formState.scene = 3
      return
    }
    // 修改邮箱(新邮箱)
    formState.scene = 4
    return
  }
  // 绑定邮箱
  formState.scene = 2
})

watchEffect(() => {
  if (appStore.userInfo?.email) {
    formState.account = appStore.userInfo?.email
  }
})

const rules: Record<string, FieldRule[]> = {
  account: [
    { required: true, message: '邮箱不能为空' },
    {
      match: emailReg,
      message: '邮箱格式不正确，请重新输入'
    }
  ],
  code: [{ required: true, message: '验证码不能为空' }]
}

const loading = ref(false)
const { time: captchaTime, wait: captchaWait } = useVerifyCode()

const captchaValue = computed(() =>
  sending.value
    ? '发送中'
    : captchaWait.value
    ? `${captchaTime.value}秒后重试`
    : '发送验证码'
)

function handleClose() {
  step.value = 1
  sending.value = false
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  captchaWait.value = false
}

async function setCodeErrorMsg(val: boolean) {
  formRef.value?.setFields({
    code: val
      ? {
          status: 'error',
          message: '验证码错误或已失效，请重新输入'
        }
      : {
          status: undefined
        }
  })
}

async function handleGetCaptcha() {
  setCodeErrorMsg(false)
  formRef.value?.clearValidate()
  const validateField = await formRef.value?.validateField('account')
  if (validateField) return

  try {
    sending.value = true
    await captchaSendApi(pick(formState, ['account', 'scene']))
    captchaWait.value = true
  } finally {
    sending.value = false
  }
}

async function checkEmail() {
  let flag = true
  try {
    loading.value = true
    const res = await captchaValidateApi(formState)
    if (res.code === ResultEnum.SUCCESS) {
      if (isChangeType.value && step.value === 1) {
        step.value = 2
        setCodeErrorMsg(false)
        captchaWait.value = false
        flag = false
        formRef.value?.clearValidate()
        formState.account = ''
        formState.code = ''
      }
      return flag
    } else {
      setCodeErrorMsg(true)
      flag = false
    }
  } finally {
    loading.value = false
  }
  return flag
}

async function handleSubmit() {
  const validate = await formRef.value?.validate()
  if (validate) return false

  const check = await checkEmail()
  if (!check) return false

  loading.value = true
  setCodeErrorMsg(false)
  try {
    await adminEditApi({ email: formState.account })
    appStore.userInfoAction()
    Message.success(isChangeType.value ? '修改成功' : '绑定成功')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.send-code-btn {
  --color-fill-2: transparent;
  --color-fill-3: transparent;
  padding: 0;
}
</style>
