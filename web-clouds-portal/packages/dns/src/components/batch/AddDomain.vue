<template>
  <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
    <div class="form-box">
      <a-form-item
        label="域名"
        field="domains"
        class="form-main-title"
        :label-col-style="{ marginBottom: '8px' }"
      >
        <domain-input class="w-497px!" v-model="formState.domains" />
      </a-form-item>
      <div class="flex items-center">
        <div class="run-label">同步添加解析记录：</div>
        <a-radio-group v-model="hasTable" :disabled="rrs_switch === 2">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="form-box" v-if="hasTable">
      <log-input-table :form-state="formState" label="记录" />
    </div>
  </a-form>

  <div class="footer">
    <a-button
      :loading="loading"
      :disabled="!domainTotal"
      type="primary"
      @click="handleSubmit"
      >添加</a-button
    >
  </div>
  <add-domain-error-dialog
    v-model="errorDialogVisible"
    :state="domainErrorState"
  />
</template>

<script setup lang="tsx">
import { type FormInstance, Message } from '@arco-design/web-vue'
import {
  domainAddBatchApi,
  getDnsConfigListApi,
  type RrsItem
} from '@vcp/apis/dns'
import { getTrimValue } from 'vc-material'

import { useDomainsTotal } from '@/hooks/useDomainsTotal'
import { useDomainAddRules } from '@/rules/domainAdd'

import DomainInput from '../DomainInput.vue'
import AddDomainErrorDialog from '../error-dialog/AddDomainErrorDialog.vue'
import LogInputTable from '../LogInputTable.vue'

const formState = reactive<{
  domains: string
  rrs: RrsItem[]
}>({
  domains: '',
  rrs: []
})

const loading = ref(false)
const formRef = ref<FormInstance>()
const hasTable = ref(false)

const { rules } = useDomainAddRules(formState, formRef)
const domains = computed(() => getTrimValue(formState.domains))
const domainTotal = useDomainsTotal(() => formState.domains)

const errorDialogVisible = ref(false)
const domainErrorState = reactive({
  success_count: '',
  success_rr_count: '',
  domain_count: '',
  fail_domains: [] as string[]
})

const rrs_switch = ref(2)

async function getConfig() {
  loading.value = true
  try {
    const config = await getDnsConfigListApi()
    rrs_switch.value = config.domain_add_show_rrs_switch!
    hasTable.value = config.domain_add_show_rrs_switch === 1
    if (hasTable.value) {
      // @ts-ignore
      formState.rrs = (config.default_rrs! || []).map(v => ({
        ...v,
        value: ''
      }))
    }
  } finally {
    loading.value = false
  }
}
getConfig()

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    const rrs = hasTable.value
      ? formState.rrs
          .map(v => ({ ...v, name: v.name || '@' }))
          .filter(v => v.value)
      : void 0
    const res = await domainAddBatchApi({
      names: domains.value,
      rrs
    })
    const successRrCount = +(res.success_rr_count ?? '0')
    const domainTotalCount = +(res.domain_count ?? '0')
    const rrsTotalCount = hasTable.value ? rrs?.length ?? 0 : 0
    if (
      +res.fail_domains!.length > 0 ||
      domainTotalCount * rrsTotalCount !== successRrCount
    ) {
      domainErrorState.success_count = res.success_count ?? '0'
      domainErrorState.success_rr_count = res.success_rr_count ?? '0'
      domainErrorState.domain_count = res.domain_count ?? '0'
      domainErrorState.fail_domains = res.fail_domains ?? []

      errorDialogVisible.value = true
    } else {
      Message.success({
        content: () => (
          <div class="text-left">
            <div class="pb-1">添加成功</div>
            <div>
              共添加{res.success_count}个域名，{res.success_rr_count}条记录
            </div>
          </div>
        )
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.a-form {
  :deep(.a-form-item__label) {
    pointer-events: none;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
}

.form-box {
  padding: 16px;
  margin-bottom: 16px;
  color: var(--color-text-1);
  border: 1px solid var(--color-border-1);
  border-radius: 6px;
  .run-label {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
