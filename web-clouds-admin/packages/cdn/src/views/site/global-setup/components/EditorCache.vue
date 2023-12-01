<template>
  <vc-dialog
    v-model="modelValue"
    modal-class="form-dialog"
    :title="title"
    :width="520"
    @open="handleModalBeforeOpen"
    :on-before-ok="handleConfirm"
  >
    <a-form
      class="absolute-msg"
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        class="mb-6!"
        field="name"
        label="规则名称"
      >
        <a-input
          v-model="formState.name"
          placeholder="请输入规则名称"
          :max-length="30"
          show-word-limit
        ></a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        class="mb-6!"
        field="file_ext"
        label="文件类型"
        ref="fileExtFormItemRef"
        :help="
          fileExtFormItemRef?.isError
            ? undefined
            : '内容可多个值，用英文逗号隔开，如JPG、JPEG'
        "
      >
        <a-textarea
          v-model="formState.file_ext"
          placeholder="请输入文件类型"
          class="resize-none!"
          :auto-size="{ minRows: 4 }"
        ></a-textarea>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        :class="ttlFormItemRef?.isError ? 'mb-64px!' : 'mb-6!'"
        field="ttl"
        label="缓存时间"
        ref="ttlFormItemRef"
      >
        <div class="flex flex-col w-full">
          <a-input-group class="w-full">
            <a-input-number
              v-model="formState.ttl"
              placeholder="请输入缓存时间"
              :min="0"
              :max="formState.ttl_unit === 1 ? 9999 : 365"
              hide-button
              show-word-limit
            >
            </a-input-number>
            <a-select
              class="max-w-78px! min-w-78px!"
              v-model="formState.ttl_unit"
              :options="[
                { label: '小时', value: 1 },
                { label: '天', value: 2 }
              ]"
              @change="handleChangeCubageUnit"
            ></a-select>
          </a-input-group>
        </div>
        <template #help v-if="!ttlFormItemRef?.isError">
          单位天： 缓存时间范围0-365天<br />单位小时： 缓存时间范围0-9999小时
        </template>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  addCdnGlobalCacheRuleApi,
  getCdnGlobalCacheRuleByIdApi,
  updateCdnGlobalCacheRuleByIdApi
} from '@vca/apis/cdn'
import { type GlobalCacheModel } from '@vca/apis/cdn'
import { computed } from 'vue'

import { TIME_UNITS } from '../state'
import type { CacheRule } from '../types'

const formRef = ref<FormInstance>()
const fileExtFormItemRef = ref<FormItemInstance>()
const ttlFormItemRef = ref<FormItemInstance>()

const modelValue = defineModel()
const loading = defineModel('loading', { default: false })
const record = defineModel<GlobalCacheModel>('record', { default: undefined })
const emit = defineEmits<{
  (event: 'refresh'): void
}>()

const title = computed(() => (record?.value ? '编辑规则' : '添加规则'))

const formState = ref<any>({
  name: '',
  file_ext: '',
  ttl: undefined,
  ttl_unit: 1
})

const titleReg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
const checkName = (value: any, callback: ValidateCallback) => {
  if (!value) {
    callback('请输入规则名称')
  } else if (!titleReg.test(value)) {
    callback('支持大小写字母、数字、汉字')
  } else {
    return true
  }
}

const fileReg = /^([\w]+,?)+(?<!,)$/
const checkFile = (value: any, callback: ValidateCallback) => {
  if (!value) {
    callback('请输入文件类型')
  } else if (!fileReg.test(value)) {
    callback('文件类型格式错误，不能输入中文和特殊符号')
  } else {
    return true
  }
}

/**当选择框发生变化的时候触发校验 */
const handleChangeCubageUnit = () => {
  formRef.value?.validateField('ttl')
  formState.value.ttl = 0
}

const rules: Rules = {
  name: [{ required: true, validator: checkName }],
  file_ext: [
    { required: true, validator: checkFile },
    {
      // 重复检测
      validator(value, callback) {
        const arr = value.split(',')
        if (arr.length < 2) {
          return true
        }
        const last = arr.pop()
        if (arr.includes(last)) {
          return callback(`${last}已重复`)
        }
        return true
      }
    }
  ],
  ttl: [{ required: true, message: '请输入缓存时间' }]
}

const handleModalBeforeOpen = () => {
  if (record.value?.id) {
    getRuleData()
    const { ttl, ...params } = record.value
    console.log('params: ', params)
    Object.assign(formState.value, params)
    formState.value.ttl = Number(ttl) as number
  }
}
watchEffect(() => {
  if (!modelValue.value) {
    formRef.value?.resetFields()
  }
})

/** 编辑提交事件 */
const handleEditorSubmit = async () => {
  const { name, file_ext, ttl, ttl_unit, id } = formState.value
  const params: CacheRule = {
    rule_id: record.value?.id,
    rule: {
      id,
      name,
      file_ext,
      ttl: (ttl as number) * TIME_UNITS.values[(ttl_unit - 1) as number],
      ttl_unit
    }
  }
  loading.value = true
  const action = record.value?.id
    ? updateCdnGlobalCacheRuleByIdApi
    : addCdnGlobalCacheRuleApi

  await action(params as any)
  Message.success(record.value?.id ? '修改成功' : '添加成功')
  emit('refresh')
}

const handleConfirm = async () => {
  const validate = await formRef.value?.validate()
  if (validate) return false
  return handleEditorSubmit()
}

//查询节点基础配置
const getRuleData = () => {
  loading.value = true
  getCdnGlobalCacheRuleByIdApi({ rule_id: record.value?.id as string })
    .then(res => {
      const { ttl, ...params } = res!.rule!
      Object.assign(formState.value, params)
      if (params.ttl_unit === 2) {
        formState.value.ttl = Number(ttl) / 3600 / 24
      } else {
        formState.value.ttl = Number(ttl) / 3600
      }
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
