<template>
  <a-drawer
    :esc-to-close="false"
    :mask-closable="false"
    :title="title"
    :width="600"
    class="is-admin"
    :loading="loading"
    v-model:visible="visible"
    ok-text="确定"
    @close="handleClose"
    :cancel-button-props="{ type: 'outline' }"
    :on-before-ok="handleSubmit"
  >
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
      <a-form-item
        field="type"
        label="记录类型"
        help="指解析记录的用途，例如：网站、邮箱"
      >
        <a-select v-model="formState.type" @change="formState.name = ''">
          <a-option
            v-for="item in logOpts"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </a-select>
      </a-form-item>
      <a-form-item
        field="name"
        ref="nameRef"
        asterisk-position="end"
        :class="nameRef?.isError && 'mb-32px!'"
        :help="nameRef?.isError ? undefined : '指域名前缀，例如：www'"
      >
        <template #label>
          <host-tips>主机记录</host-tips>
        </template>

        <a-input v-model="formState.name" placeholder="请填写域名前缀">
          <template #append>
            <a-spin :loading="domainLoading">
              <domain-ell :content="`.${domain}`" />
            </a-spin>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item asterisk-position="end" field="value" label="记录值">
        <a-input
          v-model="formState.value"
          :placeholder="getValuePlaceHolder(formState.type!)"
        />
      </a-form-item>
      <a-form-item
        v-if="formState.type === 'MX'"
        label="MX优先级"
        field="priority"
      >
        <a-input-number
          v-model="formState.priority"
          :precision="0"
          :min="1"
          :max="50"
          placeholder="请输入MX优先级"
        />
      </a-form-item>
      <a-form-item
        label="TTL"
        field="ttl"
        asterisk-position="end"
        help="指解析结果在Local DNS中的缓存时间"
      >
        <a-select v-model="formState.ttl">
          <a-option
            v-for="item in ttlOpts"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </a-select>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { type FormItemInstance, Message } from '@arco-design/web-vue'
import { type FormInstance } from '@arco-design/web-vue'
import type { ResolveModel } from '@vca/apis/dns'
import {
  addDnsSystemRrApi,
  addRecordApi,
  updateDnsSystemRrApi,
  updateRecordApi
} from '@vca/apis/dns'
import { getValuePlaceHolder, logOpts, ttlOpts } from 'vc-material'

import HostTips from '@/components/HostTips.vue'

import { useLogDialogRules } from '../rules/addLogDialogRules'
import DomainEll from './DomainEll.vue'

interface IProps {
  domainLoading: boolean
  domain: string
  modelValue: boolean
  record?: ResolveModel
  isSys: boolean
}

interface IEmits {
  (event: 'closed'): void
  (event: 'submit'): void
  (event: 'update:modelValue', value: boolean): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()
const visible = useVModel(props, 'modelValue')

const loading = ref(false)
const formRef = ref<FormInstance>()
const title = computed(() => (!props.record ? '添加记录' : '修改记录'))
const formState = reactive({
  type: 'A',
  name: '',
  value: '',
  priority: 10,
  ttl: 600
})

const nameRef = ref<FormItemInstance>()

const rules = useLogDialogRules(formState)

function handleClose() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

const domain_id = ref<string>('')
domain_id.value = useRoute().params.id as string

const addApi = props.isSys ? addDnsSystemRrApi : addRecordApi
const updateApi = props.isSys ? updateDnsSystemRrApi : updateRecordApi

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true

  try {
    if (!props.record) {
      await addApi({
        ...formState,
        priority: formState.type === 'MX' ? formState.priority : undefined,
        name: formState.name || '@',
        domain_id: domain_id.value
      })
      Message.success('添加成功')
    } else {
      await updateApi({
        id: props.record!.id!,
        ...formState,
        priority: formState.type === 'MX' ? formState.priority : undefined,
        name: formState.name || '@'
      })
      Message.success('修改成功')
    }
    emit('submit')
  } finally {
    loading.value = false
  }
}

watch(
  () => visible.value,
  v => {
    if (v) {
      if (props.record?.id) {
        const { type, value, name, ttl, priority } = props.record
        formState.type = type!
        formState.name = name!
        formState.value = value!
        formState.priority = priority!
        formState.ttl = ttl!
      }
    }
  }
)
</script>

<style lang="less" scoped>
.arco-form {
  :deep(.arco-form-item) {
    margin-bottom: 32px;
    &.arco-form-item-error {
      margin-bottom: 12px;
    }
  }
}
</style>
