<template>
  <vc-container admin page-title="安全配置" header-bordered>
    <a-spin :loading="loading" class="flex! w-full flex-1">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        class="flex flex-col min-h-full"
        layout="vertical"
        @submit-success="handleSubmitSuccess"
      >
        <a-form-item
          class="mb-8!"
          asterisk-position="end"
          required
          label="图形验证码"
        >
          <div class="flex flex-col gap-y-4">
            <div class="arco-form-item-message arco-form-item-message-help">
              登录、注册、忘记密码接口请求图形验证码
            </div>
            <a-checkbox-group v-model="formState.register_type_list" :min="1">
              <a-checkbox :disabled="disabledCheckBox(1)" :value="1">
                用户名注册
              </a-checkbox>
              <a-checkbox :disabled="disabledCheckBox(2)" :value="2">
                邮箱注册
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </a-form-item>
        <a-form-item
          class="mb-8!"
          asterisk-position="end"
          required
          label="图形验证码"
        >
          <div class="flex flex-col gap-y-4">
            <div class="arco-form-item-message arco-form-item-message-help">
              登录、注册、忘记密码接口请求图形验证码
            </div>
            <div class="flex flex-col gap-y-2">
              <label>用户端</label>
              <a-radio-group
                v-model="formState.user"
                :options="options"
              ></a-radio-group>
            </div>
            <div class="flex flex-col gap-y-2">
              <label>管理端</label>
              <a-radio-group
                v-model="formState.manage"
                :options="options"
              ></a-radio-group>
            </div>
          </div>
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
import { confApi, confUpdateApi } from '@vca/apis/pedestal'

const MODULE_TYPE = 1
const MODULE_TYPE_EMAIL = 9
const loading = ref(false)
const formState = reactive<{
  register_type_list: number[]
  user: number
  manage: number
}>({
  register_type_list: [],
  user: 2,
  manage: 2
})
const options = [
  { label: '关闭', value: 2 },
  { label: '开启', value: 1 }
]

const formRef = ref<FormInstance>()
const rules: Record<keyof typeof formState, FieldRule[]> = {
  register_type_list: [],
  user: [],
  manage: []
}

const handleSubmitSuccess = () => {
  loading.value = true
  confUpdateApi({
    conf_type: MODULE_TYPE_EMAIL,
    behavioral_captcha_conf: formState as any
  })
    .then(() => {
      Message.success('保存成功')
    })
    .finally(() => {
      loading.value = false
    })
}
const disabledCheckBox = computed(() => (value: number) => {
  if (
    formState.register_type_list.length < 2 &&
    formState.register_type_list.includes(value)
  ) {
    return true
  }
  return false
})

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
      Object.assign(formState, res.behavioral_captcha_conf)
    })
    .finally(() => {
      loading.value = false
    })
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
