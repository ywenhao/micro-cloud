<template>
  <a-modal
    v-model:visible="modelValue"
    :cancel-button-props="{ loading }"
    modal-class="vc-dialog form-dialog"
    title-align="start"
    :esc-to-close="false"
    :mask-closable="false"
    okText="确定"
    cancelText="取消"
    :width="480"
    :title="modalTitle"
    @before-open="handleBeforeOpen"
    @before-ok="handleConfirm"
    @before-close="handleBeforeClose"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="pb-6!"
    >
      <a-form-item
        asterisk-position="end"
        validate-trigger="input"
        field="name"
        label="区域名称"
      >
        <a-input
          show-word-limit
          :max-length="30"
          v-model="formState.name"
          placeholder="请输入"
        ></a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="input"
        field="dns_domain_id"
        label="域名"
        ref="domainRef"
      >
        <template v-if="!domainRef?.isError" #help>
          <div class="flex select-none items-center">
            请先去到
            <span @click="handleJumpDns" class="text-primary cursor-pointer"
              >"云解析 DNS"</span
            >
            产品，完成域名添加和解析管理
          </div>
        </template>
        <a-select
          :loading="domainLoading"
          v-model="formState.dns_domain_id"
          placeholder="请选择解析域名"
          :options="domains"
        ></a-select>
      </a-form-item>

      <a-form-item field="is_default" hide-label>
        <a-checkbox v-model="formState.is_default" class="select-none">
          <span :class="{ 'text-primary-6!': formState.is_default }">
            设置为默认区域
          </span>
        </a-checkbox>
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
  addCdnResolvRegionsApi,
  updateCdnResolvRegionsByIdApi
} from '@vca/apis/cdn'
import { getDnsSystemDomainsListApi } from '@vca/apis/dns'
import { getMicroAppData } from '@vca/shared'
import { useSelectRemote } from 'vc-material'
import { computed } from 'vue'

const formRef = ref<FormInstance>()
const modelValue = defineModel({ default: false })
const loading = defineModel<boolean>('loading', { default: false })
const record = defineModel<{
  id: string
  dns_domain_id: string
  name: string
  is_default: boolean
}>('record')
const modalTitle = computed(() => `${record.value?.id ? '编辑' : '添加'}区域`)

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const formState = ref<{
  id: string
  dns_domain_id: string
  name: string
  is_default: boolean
}>({
  id: '',
  dns_domain_id: '',
  name: '',
  is_default: false
})

const domainRef = ref<FormItemInstance>()
const {
  remoteMethod: getDomains,
  loading: domainLoading,
  opts: domains
} = useSelectRemote(getDnsSystemDomainsListApi, {
  immediate: false,
  labelKey: 'name',
  valueKey: 'id',
  defaultState: {
    usage_type: 1,
    sub_product_type: 1
  }
})

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    dns_domain_id: [{ required: true, message: '请选择域名' }],
    name: [{ required: true, message: '请输入区域名称' }]
  }
  return res
})

const handleJumpDns = () => {
  const { href } = getMicroAppData().pedestalRouter.resolve({
    name: 'Products',
    params: { app: 'dns' }
  })

  window.open(window.location.origin + href)
}

const handleCancel = () => {
  modelValue.value = false
}

const handleBeforeOpen = () => {
  if (record.value?.id) {
    const { id, dns_domain_id, name, is_default } = record.value
    formState.value.id = id
    formState.value.dns_domain_id = dns_domain_id
    formState.value.name = name
    formState.value.is_default = is_default
  }
  getDomains()
}

const handleBeforeClose = (done: any) => {
  formRef.value?.resetFields()
  formState.value.id = ''
  nextTick(done)
}

/** 编辑提交事件 */
const handleEditorSubmit = async () => {
  try {
    if (record?.value?.id) {
      await updateCdnResolvRegionsByIdApi(formState.value)
    } else {
      await addCdnResolvRegionsApi(formState.value)
    }
    emit('reload')
    Message.success(record?.value?.id ? '修改成功' : '添加成功')
    return true
  } catch (_) {
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
