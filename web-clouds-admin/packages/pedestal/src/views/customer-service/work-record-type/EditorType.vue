<template>
  <a-modal
    modal-class="vc-dialog form-dialog"
    title-align="start"
    v-model:visible="modelValue"
    :title="title"
    :width="520"
    @before-open="handleModalBeforeOpen"
    :on-before-ok="handleConfirm"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消"
    :esc-to-close="false"
    :mask-closable="false"
    :cancel-button-props="{ loading }"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        field="product_id"
        label="所属产品"
      >
        <a-select placeholder="请选择产品" v-model="formState.product_id">
          <a-option
            v-for="item in products"
            :key="item.product_id"
            :value="item.product_id"
          >
            {{ item.product_name }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="input"
        field="name"
        label="类型名称"
      >
        <a-input
          v-model="formState.name"
          placeholder="请输入名称"
          :max-length="20"
          show-word-limit
        ></a-input>
      </a-form-item>

      <a-form-item
        v-if="record?.id"
        asterisk-position="end"
        validate-trigger="input"
        field="sort"
        label="排序"
      >
        <a-input-number
          hide-button
          :min="1"
          v-model="formState.sort"
          placeholder="请输入排序"
          show-word-limit
          :max="99999"
        ></a-input-number>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        validate-trigger="change"
        class="mb-0!"
        field="status"
        hide-label
        label="状态"
      >
        <div class="flex items-center gap-x-2">
          <label>状态</label>
          <a-switch
            :unchecked-value="2"
            :checked-value="1"
            v-model="formState.status"
          ></a-switch>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  addWorkerOrderTypeApi,
  type AdminModel,
  updateWorkerOrderTypeApi
} from '@vca/apis/pedestal'
import { computed } from 'vue'

const formRef = ref<FormInstance>()

const modelValue = defineModel()
const record = defineModel<AdminModel>('record', { default: undefined })
const products = defineModel<{ product_id: string; product_name: string }[]>(
  'products',
  { default: () => [] }
)
const loading = defineModel<boolean>('loading', { default: false })
const emit = defineEmits<{
  (event: 'reload'): void
}>()
const title = computed(() => (record?.value ? '编辑类型' : '新建类型'))

const formState = ref({
  id: '',
  name: '',
  product_id: '',
  status: 1,
  sort: 1
})

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    name: [{ required: true, message: '请输入类型名称' }],
    product_id: [{ required: true, message: '请选择所属产品' }],
    status: [{ required: true, message: '请选择状态' }],
    sort: [{ required: true, message: '请输入排序' }]
  }
  return res
})

const handleCancel = () => {
  modelValue.value = false
}

const handleModalBeforeOpen = () => {
  formState.value = {
    ...formState.value,
    ...(record.value || { id: undefined })
  }
}
watchEffect(() => {
  if (!modelValue.value) {
    formRef.value?.resetFields()
  }
})

/** 编辑提交事件 */
const handleEditorSubmit = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const params = formState.value
    const action = params?.id ? updateWorkerOrderTypeApi : addWorkerOrderTypeApi
    action({ ...params, sort: params?.id ? params?.sort : 0 })
      .then(() => {
        Message.success(params?.id ? '修改成功' : '添加成功')
        emit('reload')
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}

const handleConfirm = async () => {
  const errors = await formRef.value?.validate()
  if (errors) {
    return false
  }
  return handleEditorSubmit()
}
</script>
