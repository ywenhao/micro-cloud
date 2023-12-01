<template>
  <vc-dialog
    v-model="visible"
    title="修改DNS地址"
    :loading="loading"
    :on-before-ok="handleSubmit"
    modal-class="form-dialog"
    @open="handleOpen"
    @close="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      layout="vertical"
    >
      <a-form-item asterisk-position="end" label="地址1" field="ns_id_list[0]">
        <a-select
          :loading="nssLoading"
          :triggerProps="{ autoFitPopupMinWidth: true }"
          :model-value="!nssLoading ? formState.ns_id_list[0] : ''"
          @update:model-value="e => (formState.ns_id_list[0] = e as string)"
          placeholder="请选择地址"
        >
          <a-option
            :label="item.label"
            :value="item.value"
            :disabled="item.value === formState.ns_id_list[1]"
            v-for="item in nssOpts"
            :key="item.value"
          />
        </a-select>
      </a-form-item>
      <a-form-item asterisk-position="end" label="地址2" field="ns_id_list[1]">
        <a-select
          :loading="nssLoading"
          :model-value="!nssLoading ? formState.ns_id_list[1] : ''"
          @update:model-value="e => (formState.ns_id_list[1] = e as string)"
          :triggerProps="{ autoFitPopupMinWidth: true }"
          placeholder="请选择地址"
        >
          <a-option
            :label="item.label"
            :value="item.value"
            v-for="item in nssOpts"
            :key="item.value"
            :disabled="item.value === formState.ns_id_list[0]"
          />
        </a-select>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  domainEditApi,
  type DomainModel,
  getDnsNssListApi
} from '@vca/apis/dns'
import { useSelectRemote } from 'vc-material'

interface IProps {
  modelValue: boolean
  record?: DomainModel
}

interface IEmits {
  (event: 'update:visible', value: boolean): void
  (event: 'submit'): void
}

const emit = defineEmits<IEmits>()
const props = defineProps<IProps>()

const loading = ref(false)
const visible = useVModel(props, 'modelValue')

const formRef = ref<FormInstance>()

type FormState = {
  ns_id_list: string[]
}

const formState = reactive<FormState>({
  ns_id_list: []
})

const formRules = reactive<Record<string, FieldRule[]>>({
  'ns_id_list[0]': [{ required: true, message: '请选择地址1' }],
  'ns_id_list[1]': [{ required: true, message: '请选择地址2' }]
})

const {
  loading: nssLoading,
  opts: nssOpts,
  remoteMethod
} = useSelectRemote(getDnsNssListApi, {
  labelKey: 'addr',
  valueKey: 'id',
  immediate: false
})
/**
 * 保存方法
 */
const handleSubmit = async () => {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    await domainEditApi({
      ...formState,
      id: props.record?.id!
    })
    Message.success('修改成功')
    emit('submit')
  } finally {
    loading.value = false
  }
}

/**
 * @description dialog 打开事件
 */
const handleOpen = () => {
  if (props.record) {
    formState.ns_id_list = (props.record.assign_ns_list || []).map(v => v.id!)
  }
  remoteMethod()
}

const handleClose = () => {
  formRef.value?.resetFields()
}
</script>
