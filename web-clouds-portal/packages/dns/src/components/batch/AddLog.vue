<template>
  <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
    <div class="mb-16px">
      <a-radio-group type="button" v-model="todoType">
        <a-radio :value="1">操作方式1</a-radio>
        <a-radio :value="2">操作方式2</a-radio>
      </a-radio-group>
    </div>
    <template v-if="todoType === 1">
      <div class="form-box">
        <a-form-item
          label="域名"
          field="domains"
          class="form-main-title"
          :label-col-style="{ marginBottom: '16px' }"
        >
          <domain-input class="w-497px!" v-model="formState.domains" />
        </a-form-item>
        <!-- <div class="flex items-center">
          <div class="run-label">同步添加解析记录：</div>
          <a-radio-group v-model="hasTable">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </div> -->
      </div>
      <div class="form-box">
        <log-input-table :form-state="formState" label="记录" />
      </div>
    </template>
    <a-form-item
      v-else
      prop="rrs"
      hide-label
      hide-asterisk
      content-class="flex-col items-start!"
      :rules="[{ required: true, message: '请添加记录' }]"
    >
      <log-todo-form2 :formState="formState2" />
    </a-form-item>
  </a-form>

  <div class="footer">
    <a-button
      type="primary"
      :loading="loading"
      @click="handleSubmit"
      :disabled="!domainTotal"
      :class="todoType === 2 && 'mt-16px'"
      >添加</a-button
    >
  </div>
  <add-log-error-dialog v-model="errorDialogVisible" :state="errorState" />
  <add-log-error-dialog2 v-model="errorDialog2Visible" :state="error2State" />
</template>

<script setup lang="tsx">
import { type FormInstance, Message } from '@arco-design/web-vue'
import {
  addBatchRecord2Api,
  addBatchRecordApi,
  type RrsItem
} from '@vcp/apis/dns'
import { getTrimValue } from 'vc-material'

import { useDomainAddRules } from '@/rules/domainAdd'

import DomainInput from '../DomainInput.vue'
import AddLogErrorDialog from '../error-dialog/AddLogErrorDialog.vue'
import AddLogErrorDialog2 from '../error-dialog/AddLogErrorDialog2.vue'
import LogInputTable from '../LogInputTable.vue'
import LogTodoForm2 from '../LogTodoForm2.vue'

const formState = reactive<{
  domains: string
  rrs: RrsItem[]
}>({
  domains: '',
  rrs: [
    { name: 'www', ttl: 600, type: 'A', value: '' },
    { name: '@', ttl: 600, type: 'A', value: '' }
  ]
})

const formState2 = reactive({
  rrs: ''
})

const todoType = ref(1)
const loading = ref(false)
const formRef = ref<FormInstance>()

const { rules } = useDomainAddRules(formState, formRef)
const domains = computed(() => getTrimValue(formState.domains))
const domainTotal = computed(() =>
  todoType.value === 1
    ? domains.value.length
    : getTrimValue(formState2.rrs).length
)

const errorDialogVisible = ref(false)
const errorDialog2Visible = ref(false)

const errorState = reactive({
  success_count: '0',
  fail_domains: [] as string[],
  domain_count: '0'
})

const error2State = reactive({
  success_count: '0',
  rr_count: '0',
  fail_domains: [] as string[]
})

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    let res: any
    let rrs
    if (todoType.value === 1) {
      rrs = formState.rrs
        .map(v => ({ ...v, name: v.name || '@' }))
        .filter(v => v.value)

      res = await addBatchRecordApi({
        domains: domains.value,
        rrs
      })
    } else {
      rrs = getTrimValue(formState2.rrs)
      res = await addBatchRecord2Api({ rrs })
    }

    let isError: boolean = false
    if (todoType.value === 1) {
      const successRrCount = +(res.success_count ?? '0')
      const domainTotalCount = +(res.domain_count ?? '0')
      const rrsTotalCount = rrs?.length ?? 0
      isError = domainTotalCount * rrsTotalCount !== successRrCount
    } else {
      const successRrCount = +(res.success_count ?? '0')
      const rrsTotalCount = +(res.rr_count ?? '0')
      isError = successRrCount !== rrsTotalCount
    }

    if (!res.fail_domains?.length && !isError) {
      Message.success({
        content: () => (
          <div class="text-left">
            <div class="pb-1">添加成功</div>
            <div>共添加{res.success_count}条记录</div>
          </div>
        )
      })
    } else {
      if (todoType.value === 1) {
        errorState.success_count = res.success_count ?? '0'
        errorState.fail_domains = res.fail_domains ?? []
        errorState.domain_count = res.domain_count ?? '0'
        errorDialogVisible.value = true
      } else {
        error2State.success_count = res.success_count ?? '0'
        error2State.rr_count = res.rr_count ?? '0'
        error2State.fail_domains = res.fail_domains ?? []
        errorDialog2Visible.value = true
      }
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
