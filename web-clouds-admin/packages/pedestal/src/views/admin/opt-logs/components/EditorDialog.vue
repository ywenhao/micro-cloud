<template>
  <a-modal
    modal-class="vc-dialog form-dialog"
    title-align="start"
    v-model:visible="modelValue"
    :title="title"
    :width="520"
    @before-open="handleModalBeforeOpen"
    :on-before-ok="handleConfirm"
    @cancel="handleCancel"
    ok-text="确定"
    cancelText="取消"
    :esc-to-close="false"
    :mask-closable="false"
    :ok-button-props="{ loading }"
    :cancel-button-props="{ loading }"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        field="username"
        label="账号"
      >
        <a-input
          :disabled="isEdit"
          v-model="formState.username"
          placeholder="请输入账号"
          :max-length="18"
          show-word-limit
        ></a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        field="role"
        label="角色"
      >
        <a-select v-model="formState.role">
          <a-option :value="2">管理员</a-option>
          <a-option :value="3">运营</a-option>
          <a-option :value="4">客服</a-option>
        </a-select>
      </a-form-item>

      <a-form-item
        v-if="!isEdit"
        asterisk-position="end"
        validate-trigger="input"
        field="password"
        label="密码"
      >
        <a-input-password
          :key="String(modelValue)"
          v-model="formState.password"
          placeholder="请输入密码"
          :max-length="64"
        ></a-input-password>
      </a-form-item>

      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        field="remark"
        label="备注"
      >
        <a-input
          v-model="formState.remark"
          placeholder="请输入备注"
          show-word-limit
          :max-length="20"
        ></a-input>
      </a-form-item>

      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        class="mb-0!"
        field="status"
        hide-label
        label="状态"
      >
        <div class="flex items-center gap-x-2">
          <label>状态</label>
          <vc-required-symbol />
          <a-switch
            :unchecked-value="2"
            :checked-value="1"
            :disabled="isSelfUser(formState?.id)"
            v-model="formState.status"
          ></a-switch>
        </div>
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
import {
  adminAddApi,
  type AdminModel,
  adminUpdateApi
} from '@vca/apis/pedestal'
import { pick } from 'lodash-es'
import { passwordValidate } from 'vc-material'
import { computed } from 'vue'

const formRef = ref<FormInstance>()

const appStore = useAppStore()

const modelValue = defineModel()
const record = defineModel<AdminModel>('record', { default: undefined })
const loading = defineModel<boolean>('loading', { default: false })
const emit = defineEmits<{
  (event: 'reload'): void
  (event: 'refresh'): void
}>()
const isEdit = computed(() => !!record.value?.id)
const isSelfUser = (id: string) => {
  return isEdit.value && appStore.userInfo?.id === id
}
const title = computed(() => (record?.value ? '编辑账户' : '添加账户'))
type PickAdmin = 'id' | 'password' | 'username' | 'remark' | 'role' | 'status'

const formState = ref<Pick<Required<AdminModel>, PickAdmin>>({
  id: '',
  // 用户名 4-18位，包括英文字母、数字、下划线、@符号
  username: '',
  // 角色 2.普通管理员 3.运营 4.客服 暂不支持创建超级管理员
  role: 2,
  // 备注信息，非必填，200字内；
  remark: '',
  password: DEFAULT_PASSWORD,
  status: 1
})

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    username: [
      {
        required: true,
        validator(value, callback) {
          const reg = /^[A-Za-z0-9_]{4,18}$/
          if (!value) {
            callback('请输入账号')
          } else if (!reg.test(value)) {
            callback('请输入4-18个字符，可包含英文字母、数字、下划线')
          } else {
            callback()
          }
        }
      }
    ],
    role: [{ required: true, message: '请选择角色' }],
    password: [{ required: true, validator: passwordValidate }],
    remark: [],
    status: [{ required: true, message: '请选择状态' }]
  }
  return res
})

const handleCancel = () => {
  modelValue.value = false
}

const handleModalBeforeOpen = () => {
  formState.value = {
    ...formState.value,
    ...(record.value || { id: undefined })
  }
}
watchEffect(() => {
  if (!modelValue.value) {
    formRef.value?.resetFields()
  }
})

/** 编辑提交事件 */
const handleEditorSubmit = async () => {
  const pickFields = formState.value?.id
    ? ['id', 'status', 'remark', 'role']
    : ['id', 'username', 'status', 'remark', 'password', 'role']
  const params: AdminModel = formState.value?.id
    ? pick(formState.value, pickFields)
    : pick(formState.value, pickFields)

  const action = params?.id ? adminUpdateApi : adminAddApi
  try {
    await action(params as any)
    Message.success(params?.id ? '修改成功' : '添加成功')
    isEdit.value ? emit('reload') : emit('refresh')
    return true
  } catch (e) {
    return false
  }
}

const handleConfirm = async () => {
  const validate = await formRef.value?.validate()
  if (validate) return false
  return handleEditorSubmit()
}
</script>
