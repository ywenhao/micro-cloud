<template>
  <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
    <div class="form-box">
      <a-form-item
        label="域名"
        field="domains"
        class="domains-form-item"
        content-class="flex-col items-start!"
        :label-col-style="{ marginBottom: 0 }"
      >
        <div class="tip" mt-4px mb-8px>
          <div>
            如果您的域名已被其他账号添加，可在此验证取回，支持多个域名批量操作；
          </div>
          <div>
            域名取回后，将进行 DNS 重置，并影响域名当前解析服务，请谨慎操作。
          </div>
        </div>
        <domain-input class="w-497px!" v-model="formState.domains" />
      </a-form-item>
      <div w-497px>
        <div class="sub-title" mb-8px>同时将取回域名放至该分组</div>
        <a-select
          v-model="formState.groupId"
          placeholder="请选择分组"
          class="w-full"
          :loading="groupLoading"
          :triggerProps="{ autoFitPopupMinWidth: true }"
        >
          <a-option label="暂不选择" value="" />
          <a-option
            v-for="item in groupOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value!"
          />
        </a-select>
      </div>
    </div>
    <div class="form-box">
      <a-form-item
        label="设置记录"
        class="form-main-title"
        :label-col-style="{ marginBottom: '4px' }"
        content-class="flex-col items-start! justify-start"
      >
        <div class="tip" mb-16px>
          <div>请为以上所有域名添加如下 TXT 记录值, 便于系统验证域名权限；</div>
          <div>注意这需要在域名当前其他解析商处进行设置；</div>
          <div>如果域名未在其他账号下, 则无需取回, 将直接添加成功。</div>
        </div>
        <div class="log">
          <div class="thin-text" mb-8px>主机记录</div>
          <div class="thin-text value">
            <a-spin :loading="domainTxtLoading">{{
              emptyText(logName)
            }}</a-spin>
          </div>
        </div>
        <div class="log">
          <div class="thin-text" mb-8px>记录值</div>
          <div class="thin-text value">
            <a-spin :loading="domainTxtLoading">{{
              emptyText(logValue)
            }}</a-spin>
          </div>
        </div>
      </a-form-item>
    </div>
  </a-form>

  <div class="footer">
    <a-button
      :loading="loading"
      :disabled="!domainTotal"
      type="primary"
      @click="handleBack"
      >取回</a-button
    >
  </div>
  <back-domain-error-dialog
    v-model="errorDialogVisible"
    :state="domainErrorState"
  />
</template>

<script setup lang="tsx">
import { type FormInstance, Message } from '@arco-design/web-vue'
import {
  domainGroupListApi,
  domainNsAcquireApi,
  domainTxtApi
} from '@vcp/apis/dns'
import { emptyText, getTrimValue, VcModal } from 'vc-material'

import { useDomainsTotal } from '@/hooks/useDomainsTotal'
import { useDomainAddRules } from '@/rules/domainAdd'

import DomainInput from '../DomainInput.vue'
import BackDomainErrorDialog from '../error-dialog/BackDomainErrorDialog.vue'

const formState = reactive<{
  domains: string
  groupId: string
}>({
  groupId: '',
  domains: ''
})

const domainTxtLoading = ref(false)
const logName = ref('')
const logValue = ref('')

const loading = ref(false)
const formRef = ref<FormInstance>()

const { rules } = useDomainAddRules(formState, formRef)
const domains = computed(() => getTrimValue(formState.domains))
const domainTotal = useDomainsTotal(() => formState.domains)

const errorDialogVisible = ref(false)
const domainErrorState = reactive({
  success_count: '',
  domain_count: '',
  fail_domains: [] as string[]
})

const groupLoading = ref(false)
const groupOpts = ref<LabelValue[]>([])
async function getGroupList() {
  loading.value = true
  try {
    const res = await domainGroupListApi({ limit: 0 })
    groupOpts.value =
      res.list?.map(v => ({
        label: v.name!,
        value: v.id!
      })) || []
  } finally {
    loading.value = false
  }
}
getGroupList()

async function getDomainTxtApi() {
  const res = await domainTxtApi()
  logName.value = res.name!
  logValue.value = res.value!
}
getDomainTxtApi()

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    const res = await domainNsAcquireApi({
      names: domains.value,
      group_id: formState.groupId || void 0,
      txt_value: logValue.value
    })
    const successCount = +(res.success_count ?? '0')
    const domainTotalCount = +(res.domain_count ?? '0')
    if (+res.fail_domains!.length > 0) {
      domainErrorState.success_count = String(successCount)
      domainErrorState.domain_count = String(domainTotalCount)
      domainErrorState.fail_domains = res.fail_domains ?? []

      errorDialogVisible.value = true
    } else {
      Message.success({
        content: () => (
          <div class="text-left">
            <div class="pb-1">取回成功</div>
            <div>共取回{res.success_count}个域名</div>
          </div>
        )
      })
    }
  } finally {
    loading.value = false
  }
}

function handleBack() {
  VcModal.confirm(
    {
      title: '温馨提示',
      content:
        '请确定已经为所有域名添加 TXT 记录，并且已经生效，否则将导致域名取回失败'
    },
    handleSubmit
  )
}
</script>

<style lang="less" scoped>
@w: 497px;
.a-form {
  :deep(.a-form-item__label) {
    pointer-events: none;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
}
:deep(.domains-form-item) {
  .arco-form-item-content-wrapper {
    margin-bottom: 16px;
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
.tip {
  width: @w;
  font-size: 12px;
  color: var(--color-text-3);
  font-weight: 400;
  line-height: 18px;
}
.log {
  width: @w;
  & + .log {
    margin-top: 16px;
  }
  .value {
    padding: 8px;
    background: var(--color-fill-1);
    border-radius: 6px;
  }
}
</style>
