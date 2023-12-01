<template>
  <vc-container
    admin
    page-title="注册配置"
    description="用户端邮箱注册、找回密码等功能使用"
    header-bordered
  >
    <a-spin :loading="loading" class="flex! w-full flex-1 max-w-[400px]">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        class="flex flex-col min-h-full"
        layout="vertical"
        @submit-success="handleSubmitSuccess"
      >
        <a-form-item
          field="address"
          class="mb-8!"
          asterisk-position="end"
          label="主机地址"
        >
          <a-input
            v-model="formState.address"
            placeholder="请输入主机地址"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="port"
          class="mb-8!"
          asterisk-position="end"
          label="主机端口"
        >
          <a-input
            v-model="formState.port"
            placeholder="请输入主机端口"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="title"
          class="mb-8!"
          asterisk-position="end"
          label="邮箱标题"
        >
          <a-input
            v-model="formState.title"
            placeholder="请输入邮箱标题"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="name"
          class="mb-8!"
          asterisk-position="end"
          label="发送方用户名"
        >
          <a-input
            v-model="formState.name"
            placeholder="请输入发送方用户名"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="password"
          class="mb-8!"
          asterisk-position="end"
          label="发送方用户密码"
        >
          <a-input
            v-model="formState.password"
            placeholder="请输入发送方用户密码"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="email"
          class="mb-8!"
          asterisk-position="end"
          label="邮箱测试"
        >
          <a-input v-model="formState.email" placeholder="请输入邮箱地址">
            <template #suffix>
              <a-link
                :disabled="emailVerifying || wait"
                :hoverable="false"
                @click="handleVerifyEmail"
                type="primary"
              >
                {{ emailBtnMsg }}
              </a-link>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item class="mb-0!">
          <a-button type="primary" html-type="submit">保存配置</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { confApi, confUpdateApi, verifyEmailApi } from '@vca/apis/pedestal'
import { useVerifyCode } from 'vc-material'
const MODULE_TYPE = 1
const MODULE_TYPE_EMAIL = 6
const loading = ref(false)
const formState = reactive<{
  register_type_list: number[]
  address?: string
  port?: string
  title?: string
  name?: string
  password?: string
  email?: string
}>({
  register_type_list: [],
  address: '',
  port: '',
  title: '',
  name: '',
  password: '',
  email: ''
})

const formRef = ref<FormInstance>()
const { time, wait } = useVerifyCode()
const emailStatus = ref(false)
const emailVerifying = ref(false)
const rules: Record<keyof typeof formState, FieldRule[]> = {
  register_type_list: [],
  address: [{ required: true, message: '请输入主机地址' }],
  port: [
    {
      required: true,
      validator: (value: any, callback: any) => {
        if (!value) {
          callback('请输入邮箱端口')
        }
        if (Number(value) > 65535) {
          callback('端口号最大为65535')
        } else {
          callback()
        }
      }
    }
  ],
  title: [{ required: true, message: '请输入邮箱标题' }],
  name: [{ required: true, message: '请输入发送方用户名' }],
  password: [{ required: true, message: '请输入发送方用户密码' }],
  email: [{ type: 'email', message: '邮箱格式错误' }]
}

const emailBtnMsg = computed(() =>
  emailVerifying.value
    ? '发送中'
    : !wait.value
    ? '发送验证码'
    : `${time.value}秒后重试`
)

const handleSubmitEmail = () => {
  loading.value = true
  confUpdateApi({
    conf_type: MODULE_TYPE_EMAIL,
    email_conf: formState
  })
    .then(() => {
      Message.success('保存成功')
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSubmitSuccess = () => {
  loading.value = true
  confUpdateApi({
    conf_type: MODULE_TYPE,
    user_register_conf: formState
  })
    .then(handleSubmitEmail)
    .finally(() => {
      loading.value = false
    })
}

const getConfigInfo = () => {
  loading.value = true
  confApi({ type: MODULE_TYPE })
    .then(res => {
      Object.assign(formState, res.user_register_conf)
    })
    .finally(() => {
      loading.value = false
    })
}

const getEmailConfigInfo = () => {
  loading.value = true
  confApi({ type: MODULE_TYPE_EMAIL })
    .then(res => {
      Object.assign(formState, res.email_conf)
    })
    .finally(() => {
      loading.value = false
    })
}

const handleVerifyEmail = async () => {
  if (!formState.email) {
    formRef.value?.setFields({
      email: {
        message: '请输入邮箱地址',
        status: 'error'
      }
    })
    return
  }
  const res = await formRef.value?.validate()
  if (res) return
  emailVerifying.value = true
  try {
    await verifyEmailApi(formState)
    emailStatus.value = true
    wait.value = true
  } catch (error) {
    emailStatus.value = false
  } finally {
    emailVerifying.value = false
  }
}

onMounted(() => {
  getConfigInfo()
  getEmailConfigInfo()
})
</script>

<style scoped>
:deep(.vc-container__content) {
  display: flex !important;
  flex-direction: column !important;
}
</style>
