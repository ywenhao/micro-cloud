<template>
  <vc-container header-bordered page-title="功能配置" admin>
    <div class="main-title">添加域名-批量添加记录</div>
    <div class="flex items-center mt-32px">
      <div class="mr-2">添加域名时批量添加记录</div>
      <a-switch
        :checked-value="1"
        :unchecked-value="2"
        v-model="formState.domain_add_show_rrs_switch"
      />
    </div>
    <a-form
      layout="vertical"
      class="mt-16px"
      ref="formRef"
      :model="formState"
      v-if="formState.domain_add_show_rrs_switch === 1"
    >
      <div class="form-box">
        <log-input-table :form-state="formState" isDisabledValue />
      </div>
    </a-form>
    <div class="footer mt-16px">
      <a-button :loading="loading" type="primary" @click="handleSave"
        >保存配置</a-button
      >
    </div>
  </vc-container>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import {
  getDnsConfigListApi,
  type RrsItem,
  updateDnsConfigApi
} from '@vca/apis/dns'
import { cloneDeep } from 'lodash-es'

import LogInputTable from './components/LogInputTable.vue'

const formState = reactive({
  domain_add_show_rrs_switch: 1,
  rrs: [] as RrsItem[]
})

const formRef = ref<FormInstance>()
const loading = ref(false)
const rrsCache = ref<RrsItem[]>([])

async function getConfig() {
  loading.value = true
  try {
    const res = await getDnsConfigListApi()
    formState.domain_add_show_rrs_switch = res.domain_add_show_rrs_switch!
    formState.rrs = res.default_rrs as RrsItem[]
    rrsCache.value = cloneDeep(res.default_rrs) as RrsItem[]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getConfig()
})

async function handleSave() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    await updateDnsConfigApi({
      domain_add_show_rrs_switch: formState.domain_add_show_rrs_switch,
      default_rrs:
        formState.domain_add_show_rrs_switch === 1
          ? formState.rrs.map(v => ({
              ...v,
              name: v.name?.trim() || '@'
            }))
          : rrsCache.value
    })
    Message.success('保存成功')
    getConfig()
  } finally {
    loading.value = false
  }
}
</script>
