<template>
  <a-drawer
    :width="600"
    :title="record?.id ? '创建规则' : '编辑规则'"
    :mask-closable="false"
    :visible="modelValue"
    unmountOnClose
    destroy-on-close
    class="vc-drawer"
    @beforeOpen="handleOpen"
    @before-ok="handleBeforOk"
    @beforeCancel="handleCancel"
  >
    <a-form ref="formRef" :rules="rules" :model="formState" layout="vertical">
      <a-form-item field="name" label="规则名称">
        <a-input
          v-model="formState.name"
          placeholder="请输入规则名称"
          :max-length="30"
          show-word-limit
        />
      </a-form-item>
      <a-form-item
        field="url"
        label="URL"
        help="无需输入协议，将与站点协议保持一致"
      >
        <a-input
          v-model="formState.url"
          placeholder="输入与站点相关的URL地址"
        />
      </a-form-item>
      <a-form-item field="rule" required label="设置">
        <setup-page-rules ref="setupPageRulesRef" :config="formState.rule" />
      </a-form-item>
      <a-form-item field="priority" label="优先级">
        <a-radio-group
          v-model="formState.priority"
          :options="[
            { label: '优先级最高', value: '1' },
            { label: '优先级最低', value: '0' }
          ]"
        ></a-radio-group>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
import { type FormInstance, Message } from '@arco-design/web-vue'
import {
  addCdnSitePageRuleByIdApi,
  updateCdnSitePageRuleByIdApi
} from '@vcp/apis/cdn'
import { cloneDeep, has } from 'lodash-es'

import SetupPageRules from '@/components/SetupPageRules'
const modelValue = defineModel()
const record = defineModel<any>('record')
const emit = defineEmits(['success'])
const formRef = ref<FormInstance>()
const setupPageRulesRef = ref()
const route = useRoute()
const rules = computed<Rules>(() => {
  return {
    name: [
      { required: true, message: '请输入规则名称' },
      { validator: validateTitle }
    ],
    url: [
      { required: true, message: '请输入URL' },
      {
        validator(value, callback) {
          const errMsg = regExpValidateHandler(
            value,
            regexpMap.noProtocolAndPortUrl,
            'error'
          )
          const obj = new URL(`http://${value}`)
          if (errMsg || obj.hostname !== route.params?.domain) {
            callback(`请输入与站点相关的URL地址，无需输入协议`)
            return
          }
          callback()
        }
      }
    ],
    priority: [{ required: true, message: '请选择优先级' }]
  }
})

const defaultValue = {
  rule_id: '',
  status: 1,
  priority: '1',
  url: '',
  rule: {
    '': ''
  },
  name: '',
  site_id: ''
}
const formState = ref<any>(cloneDeep(defaultValue))

const handleOpen = () => {
  if (record.value) {
    for (const key in record.value) {
      if (has(formState.value, key)) {
        formState.value[key] = record.value[key]
      }
    }
  } else {
    formState.value = cloneDeep(defaultValue)
  }
}
const handleCancel = () => {
  formRef.value?.resetFields()
  record.value = undefined
  modelValue.value = false
  return true
}

const handleBeforOk = async () => {
  const validates = await Promise.all([
    formRef.value?.validate(),
    setupPageRulesRef.value?.validate()
  ])
  // 只要存在异常 阻止提交
  if (validates.some(item => item)) return Promise.reject(false)
  const data = cloneDeep({
    page_rule: {
      ...formState.value,
      rule: setupPageRulesRef.value?.generateRule(),
      site_id: route.params?.id,
      rule_id: formState.value?.rule_id || undefined
    },
    rule_id: formState.value?.rule_id || undefined,
    site_id: route.params?.id
  })
  const action = record.value?.rule_id
    ? updateCdnSitePageRuleByIdApi
    : addCdnSitePageRuleByIdApi

  try {
    await action(data as any)
    Message.success(record.value?.rule_id ? '编辑成功' : '创建成功')
    handleCancel()
    emit('success')
    return true
  } catch (_) {
    return Promise.reject(false)
  }
}
</script>
