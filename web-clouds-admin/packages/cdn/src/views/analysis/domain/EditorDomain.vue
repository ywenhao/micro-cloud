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
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        asterisk-position="end"
        validate-trigger="input"
        field="domain_id"
        label="解析域名"
        ref="domainRef"
      >
        <template v-if="!domainRef?.isError" #help>
          <div class="flex select-none items-center">
            请先去到
            <span @click="handleJumpDns" class="text-primary cursor-pointer">
              "云解析 DNS"
            </span>
            产品，完成域名添加和解析管理
          </div>
        </template>
        <a-select
          :loading="domainLoading"
          v-model="formState.domain_id"
          placeholder="请选择解析域名"
          :options="domains"
        ></a-select>
      </a-form-item>

      <a-form-item field="remark" label="备注" class="mt-6">
        <a-textarea
          :auto-size="{ minRows: 3, maxRows: 3 }"
          v-model="formState.remark"
          placeholder="请输入"
          :options="[]"
          :max-length="200"
          show-word-limit
        ></a-textarea>
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
  addCdnResolvSiteResolvesApi,
  updateCdnResolvSiteResolvesDetailByIdApi
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
  domain_id: string
  remark: string
}>('record')

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const modalTitle = computed(
  () => `${record.value?.id ? '编辑' : '添加'}解析域名`
)

const formState = ref<{
  id: string
  domain_id: string
  remark: string
}>({
  id: '',
  domain_id: '',
  remark: ''
})
const {
  remoteMethod: getDomains,
  loading: domainLoading,
  opts: domains
} = useSelectRemote(getDnsSystemDomainsListApi, {
  immediate: false,
  labelKey: 'name',
  valueKey: 'id',
  defaultState: {
    usage_type: 2,
    sub_product_type: 1
  }
})
const domainRef = ref<FormItemInstance>()

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    domain_id: [{ required: true, message: '请选择解析域名' }],
    remark: []
  }
  return res
})
const handleJumpDns = () => {
  // const data = { command: 'TO', value: 'dns' }
  // window.microApp.dispatch(data)
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
    const { id, domain_id, remark } = record.value
    formState.value.id = id
    formState.value.domain_id = domain_id
    formState.value.remark = remark
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
      await updateCdnResolvSiteResolvesDetailByIdApi(formState.value)
    } else {
      await addCdnResolvSiteResolvesApi(formState.value)
    }
    Message.success(record?.value?.id ? '修改成功' : '添加成功')
    emit('reload')
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
