<template>
  <a-drawer
    v-model:visible="modelValue"
    :title="title"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    ok-text="确定"
    class="is-admin"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item
        field="name"
        label="区域名称(区域=集群）"
        asterisk-position="end"
        validate-trigger="input"
        required
        class="mb-8!"
      >
        <a-input
          v-model.trim="formState.name"
          :max-length="20"
          show-word-limit
          placeholder="请输入名称"
        />
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        field="ip"
        label="区域IP"
        validate-trigger="input"
        required
        class="mb-8!"
      >
        <a-input v-model.trim="formState.ip" placeholder="请输入IP" />
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        field="domain_id"
        label="区域外链域名"
        validate-trigger="change"
        required
        class="mb-8!"
      >
        <a-select
          v-model="formState.domain_id"
          :options="(optionsList as SelectData[])"
          placeholder="请选择外链域名"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="备注">
        <a-input
          v-model.trim="formState.remark"
          placeholder="请输入内容"
          :max-length="20"
          show-word-limit
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { addRegionApi, updateRegionApi } from '@vca/apis/oss'
import { pick } from 'lodash-es'

import { REGION_LIST_DATA, type SelectData } from '@/components/SelectData'
import { GET_LINK_DOMAIN_LIST, OUT_LINK_DOMAIN } from '@/components/SelectData'

const modelValue = defineModel<boolean>()
const formState = ref<any>({
  id: undefined,
  name: '',
  remark: '',
  ip: '',
  domain_id: ''
})
const record = defineModel<any>('record')

const optionsList = computed(() => {
  if (formState.value?.id) {
    OUT_LINK_DOMAIN.value.unshift({
      label: record.value?.domain_name,
      value: record.value?.domain_id
    })
  }

  return OUT_LINK_DOMAIN.value
})

const formRef = ref<FormInstance>()
const loading = defineModel<boolean>('loading', { default: false })
const title = computed(() => (record?.value ? '编辑区域' : '新建区域'))
const emit = defineEmits<{
  (event: 'reload'): void
}>()

const handleBeforeClose = (): boolean => {
  formRef.value?.resetFields()
  formState!.value!.id = undefined
  formState!.value!.remark = ''
  return true
}
const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    name: [
      {
        required: true,
        validator(value, callback) {
          const domainReg = /^[a-zA-Z-_\u4e00-\u9fa5]+$/

          if (!value) {
            return callback('请输入区域名称')
          }
          if (!domainReg.test(value)) {
            return callback('格式错误，仅支持中文，英文，-，_')
          }

          const repeatIndex = REGION_LIST_DATA.value.findIndex(
            ({ value }) => value === record.value?.id
          )

          const regionData = record.value?.id
            ? REGION_LIST_DATA.value.slice(repeatIndex, 1)
            : REGION_LIST_DATA.value
          const repeatName = regionData.some(({ label }) => label === value)
          if (repeatName) {
            return callback('名称重复')
          }
          return callback()
        }
      }
    ],
    domain_id: [{ required: true, message: '请选择区域外链域名' }],
    ip: [
      {
        required: true,
        validator(value, callback) {
          const domainReg =
            /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/

          if (!value) {
            return callback('请输入IP')
          }
          if (!domainReg.test(value)) {
            return callback('IP地址格式有误，请调整')
          }
          const repeatIndex = REGION_LIST_DATA.value.findIndex(
            ({ value }) => value === record.value?.id
          )

          const regionData = record.value?.id
            ? REGION_LIST_DATA.value.slice(repeatIndex, 1)
            : REGION_LIST_DATA.value
          const repeatIp = regionData.some(({ ip }) => ip === value)
          if (repeatIp) {
            return callback('IP重复')
          }
          return callback()
        }
      }
    ]
  }
  return res
})

const handleBeforeOk = (done: (closed: boolean) => void) => {
  formRef.value
    ?.validate()
    .then(res => {
      if (!res) {
        return handleEditorSubmit()
      }
      done(false)
    })
    .then(() => done(true))
    .catch(() => done(false))
}

const handleEditorSubmit = () => {
  loading.value = true
  const data = pick(
    {
      ...formState.value
    },
    ['id', 'name', 'ip', 'domain_id', 'remark']
  )
  const action = data?.id ? updateRegionApi : addRegionApi
  return new Promise<boolean>((resolve, reject) => {
    action(data)
      .then(() => {
        Message.success(data?.id ? '修改成功' : '新建成功')
        emit('reload')
        resolve(true)
      })
      .catch(() => reject())
      .finally(() => {
        loading.value = false
      })
  })
}

const handleDrawerOpen = () => {
  if (record.value?.id) {
    formState.value = { ...record.value }
  }
  GET_LINK_DOMAIN_LIST()
}
</script>
