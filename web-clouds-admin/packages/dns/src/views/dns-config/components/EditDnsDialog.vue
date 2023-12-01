<template>
  <vc-dialog
    v-model="visible"
    :loading="loading"
    :title="dialogTitle"
    @close="handleClose"
    modal-class="form-dialog"
    :on-before-ok="handleSubmit"
  >
    <!-- :ok-btn-disabled="!formState.name || !formState.sub_product_type" -->
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      layout="vertical"
    >
      <a-form-item
        label="DNS服务器地址"
        field="addr"
        required
        asterisk-position="end"
      >
        <a-input
          v-model="formState.addr"
          placeholder="请输入DNS服务器地址，如：ns1.example.com"
        ></a-input>
      </a-form-item>
      <a-form-item asterisk-position="end" label="IP地址" field="ip" required>
        <a-input v-model="formState.ip" placeholder="请输入IP地址"></a-input>
      </a-form-item>
      <a-form-item asterisk-position="end" label="备注" field="remark">
        <a-input
          v-model="formState.remark"
          :max-length="20"
          placeholder="请输入备注"
        ></a-input>
      </a-form-item>
      <a-form-item hide-label field="assign_status">
        自动分配
        <a-switch
          class="ml-8px!"
          :checked-value="1"
          :unchecked-value="2"
          v-model="formState.assign_status"
        ></a-switch>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import { type NsModel, updateDnsNsApi } from '@vca/apis/dns'

import useForm from './useDnsForm'

interface IProps {
  modelValue: boolean
  record?: NsModel
}

interface IEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit'): void
}

const emit = defineEmits<IEmits>()
const props = defineProps<IProps>()
const visible = useVModel(props, 'modelValue')
const loading = ref(false)

const dialogTitle = computed(() => {
  return props.record ? '编辑DNS服务器' : '添加DNS服务器'
})

const { formRef, formState, formRules } = useForm()

/**
 * 保存方法
 */
const handleSubmit = async () => {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    await updateDnsNsApi({
      id: props.record?.id as string,
      ...formState
    })

    emit('submit')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.record) {
    formState.addr = props.record.addr!
    formState.ip = props.record.ip!
    formState.remark = props.record.remark!
    formState.assign_status = props.record.assign_status!
  }
})

/**
 * @description dialog 关闭前事件
 */
const handleClose = () => {
  formRef.value?.resetFields()
}
</script>

./useDnsForm
