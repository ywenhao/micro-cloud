<template>
  <vc-dialog
    @open="handleOpen"
    :loading="loading"
    v-model="visible"
    title="编辑节点"
    :on-before-ok="handleOk"
    modal-class="form-dialog"
    @close="handleClose"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="名称" field="name" asterisk-position="end">
        <a-input v-model="formState.name"></a-input>
      </a-form-item>
      <a-form-item
        label="最大并发任务数"
        asterisk-position="end"
        field="run_number"
      >
        <a-input-number
          v-model="formState.run_number"
          :min="1"
          :max="1000"
          :step="1"
          :precision="0"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="IP" asterisk-position="end" field="address">
        <a-input v-model="formState.address"></a-input>
      </a-form-item>
      <a-form-item label="备注">
        <a-input v-model="formState.remark" placeholder="请输入备注"></a-input>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script lang="ts" setup>
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { type NodeItemModel, updateMtsNodeApi } from '@vca/apis/src/mts'
import { ipv4Reg, nameReg } from 'vc-material'
interface IProps {
  modelValue: boolean
  record?: NodeItemModel
}
interface IEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit'): void
}
const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<IEmits>()
const visible = useVModel(props, 'modelValue', emit)

const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive({
  id: '',
  name: '',
  address: '',
  remark: '',
  run_number: 0,
  update_type: 1
})
const rules: Record<string, FieldRule[]> = {
  name: [
    { required: true, message: '请输入名称' },
    {
      minLength: 4,
      match: nameReg,
      message: '仅支持中文、英文、数字、_、-和.六种格式，长度4-32个字符'
    }
  ],
  run_number: [{ required: true, message: '请输入内容' }],
  address: [
    { required: true, message: '请输入IP地址' },
    { match: ipv4Reg, message: '请输入正确的IPv4地址' }
  ]
}
const handleOpen = () => {
  for (let key in formState) {
    if (Object.hasOwnProperty.call(props.record, key)) {
      //@ts-ignore
      formState[key] = props.record[key]
    }
  }
}

function handleClose() {
  formRef.value?.resetFields()
}

const handleOk = async () => {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    await updateMtsNodeApi(formState)
    Message.success('编辑成功')
    emit('submit')
  } finally {
    loading.value = false
  }
}
</script>
