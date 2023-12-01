<template>
  <a-form
    ref="formRef"
    class="w-497px!"
    layout="vertical"
    :model="formState"
    :rules="rules"
  >
    <a-form-item hide-label>
      <domain-input class="w-497px!" v-model="formState.domains" />
    </a-form-item>
    <a-form-item class="mt-24px" hide-asterisk field="conditions">
      <template #label>
        <div class="flex justify-between w-full">
          <div>以上域名的解析记录中</div>
          <a-link
            :hoverable="false"
            class="add-btn"
            @click="() => moreInputs.push(initMoreItem())"
          >
            <icon-plus size="16" />
            <div class="ml-4px">添加</div>
          </a-link>
        </div>
      </template>
      <div class="flex flex-col w-full">
        <div
          v-for="(item, index) in moreInputs"
          :key="index"
          class="flex m-input"
        >
          <a-input v-model="item.value" placeholder="请输入">
            <template #prepend>
              <a-select v-model="item.key">
                <a-option label="主机记录等于" value="name" />
                <a-option label="记录值等于" value="value" />
              </a-select>
            </template>
          </a-input>
          <div class="ml-4px">
            <a-button
              :disabled="moreInputs.length === 1 && index === 0"
              type="outline"
              class="w-32px! h-32px!"
              @click="moreInputs.splice(index, 1)"
            >
              <template #icon>
                <icon-close size="16" />
              </template>
            </a-button>
          </div>
        </div>
        <a-select class="mt-8px" v-model="formState.operator">
          <a-option value="OR" label="满足任意一个条件" />
          <a-option value="AND" label="满足以上所有条件" />
        </a-select>
      </div>
    </a-form-item>
    <a-form-item
      class="mb-16px!"
      hide-asterisk
      label="对符合条件的记录执行"
      field="expr"
    >
      <a-input v-model="formState.expr.value" placeholder="请输入">
        <template #prepend>
          <a-select v-model="formState.expr.key">
            <a-option label="主机记录改为" value="name" />
            <a-option label="记录值改为" value="value" />
          </a-select>
        </template>
      </a-input>
    </a-form-item>
    <div class="footer">
      <a-button
        type="primary"
        :disabled="!formState.domains"
        :loading="loading"
        @click="handleSubmit"
        >修改</a-button
      >
    </div>
    <edit-log-error-dialog v-model="errorDialogVisible" :state="errorState" />
  </a-form>
</template>

<script setup lang="tsx">
import type { FormInstance } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { updateBatchRecordApi } from '@vcp/apis/dns'
import { getTrimValue } from 'vc-material'

import { useRules } from '@/rules/batchEditLog'

import DomainInput from '../DomainInput.vue'
import EditLogErrorDialog from '../error-dialog/EditLogErrorDialog.vue'

type EditType = 'name' | 'value'
type MoreItem = { key: EditType; value: string }

const formRef = ref<FormInstance>()

const initMoreItem = (): MoreItem => ({ key: 'name', value: '' })
const moreInputs = ref([initMoreItem()])
const formState = reactive({
  domains: '',
  group_id: '',
  batch_type: 1,
  operator: 'AND' as 'AND' | 'OR',
  expr: { key: 'name', value: '' },
  conditions: computed(() => moreInputs.value)
})

const domains = computed(() => getTrimValue(formState.domains))

const rules = useRules()

const loading = ref(false)

const errorState = reactive({
  success_count: '0',
  domain_count: '0',
  fail_domains: [] as string[]
})

const errorDialogVisible = ref(false)

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  const conditions = formState.conditions?.filter(v => v.value)

  try {
    const res = await updateBatchRecordApi({
      conditions,
      domains: domains.value,
      operator: formState.operator === 'AND' ? 1 : 2,
      expr: formState.expr
    })
    if (!res.fail_domains?.length) {
      Message.success({
        content: () => (
          <div class="text-left">
            <div class="pb-1">修改成功</div>
            <div>共修改{res.success_count}条记录</div>
          </div>
        )
      })
    } else {
      errorState.success_count = res.success_count ?? '0'
      errorState.domain_count = res.domain_count ?? '0'
      errorState.fail_domains = res.fail_domains ?? []
      errorDialogVisible.value = true
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => formState.batch_type,
  () => {
    formRef.value?.clearValidate()
  }
)
</script>

<style lang="less" scoped>
.m-input {
  & + .m-input {
    margin-top: 8px;
  }
}
.add-btn {
  display: flex;
  align-items: center;
  &:hover {
    color: rgb(var(--primary-5));
  }
}
:deep(.arco-form-item-label) {
  width: 100%;
}
</style>
