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
    <a-form-item
      content-class="flex-col"
      class="mt-24px"
      hide-asterisk
      field="conditions"
    >
      <template #label>
        <div class="flex justify-between w-full">
          <div>
            <a-radio v-model="delType" :value="1"
              >删除满足下方条件的记录</a-radio
            >
          </div>
          <a-link
            :hoverable="false"
            class="add-btn"
            :disabled="delType !== 1"
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
          <a-input
            :disabled="delType !== 1"
            v-model="item.value"
            placeholder="请输入"
          >
            <template #prepend>
              <a-select :disabled="delType !== 1" v-model="item.key">
                <a-option label="主机记录等于" value="name" />
                <a-option label="记录值等于" value="value" />
              </a-select>
            </template>
          </a-input>
          <div class="ml-4px">
            <a-button
              :disabled="
                delType !== 1 || (moreInputs.length === 1 && index === 0)
              "
              type="outline"
              class="close-btn"
              @click="moreInputs.splice(index, 1)"
            >
              <template #icon>
                <icon-close size="16" />
              </template>
            </a-button>
          </div>
        </div>
      </div>
      <a-select
        :disabled="delType !== 1"
        class="or-select"
        v-model="formState.operator"
      >
        <a-option value="OR" label="满足任意一个条件" />
        <a-option value="AND" label="满足以上所有条件" />
      </a-select>
    </a-form-item>

    <a-form-item
      hide-label
      class="mb-16px!"
      :wrapper-col-style="{ minHeight: '20px' }"
      content-class=" leading-20px min-h-20px!"
    >
      <a-radio v-model="delType" :value="2"
        >删除域名内（含子域名）的所有解析记录</a-radio
      >
    </a-form-item>
    <div class="footer">
      <a-button
        type="primary"
        :disabled="!formState.domains"
        :loading="loading"
        @click="handleSubmit"
        status="danger"
        >删除</a-button
      >
    </div>
    <edit-log-error-dialog v-model="errorDialogVisible" :state="errorState" />
  </a-form>
</template>

<script setup lang="tsx">
import type { FormInstance } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { deleteBatchRecordApi } from '@vcp/apis/dns'
import { getTrimValue } from 'vc-material'

import { useRules } from '@/rules/batchEditLog'

import DomainInput from '../DomainInput.vue'
import EditLogErrorDialog from '../error-dialog/EditLogErrorDialog.vue'

type EditType = 'name' | 'value'
type MoreItem = { key: EditType; value: string }

const formRef = ref<FormInstance>()

const delType = ref(1)
const initMoreItem = (): MoreItem => ({ key: 'name', value: '' })
const moreInputs = ref([initMoreItem()])
const formState = reactive({
  domains: '',
  group_id: '',
  operator: 'AND' as 'AND' | 'OR',
  expr: { key: 'name', value: '' },
  conditions: computed(() => (delType.value === 1 ? moreInputs.value : void 0))
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
  const operator =
    delType.value === 1 ? (formState.operator === 'AND' ? 1 : 2) : void 0
  try {
    const res = await deleteBatchRecordApi({
      operator,
      conditions,
      domains: domains.value
    })
    if (!res.fail_domains?.length) {
      Message.success({
        content: () => (
          <div class="text-left">
            <div class="pb-1">删除成功</div>
            <div>共删除{res.success_count}条记录</div>
          </div>
        )
      })
    } else {
      errorState.domain_count = res.domain_count ?? '0'
      errorState.success_count = res.success_count ?? '0'
      errorState.fail_domains = res.fail_domains ?? []
      errorDialogVisible.value = true
    }
  } finally {
    loading.value = false
  }
}

watch(delType, val => {
  val === 2 && formRef.value?.clearValidate('conditions')
})
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

:deep(.or-select) {
  margin-top: 8px;
  //   &.arco-select-view:not(.arco-select-view-disabled) {
  //     border-color: var(--color-border-2);
  //     &:hover {
  //       border-color: rgba(var(--primary-6));
  //     }
  //   }
}
</style>
