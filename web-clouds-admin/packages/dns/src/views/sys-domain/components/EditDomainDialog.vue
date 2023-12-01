<template>
  <vc-dialog
    v-model="visible"
    :title="title"
    :loading="loading"
    :on-before-ok="handleSubmit"
    modal-class="form-dialog"
    @open="handleOpen"
    :ok-btn-disabled="!formState.name || !formState.sub_product_type"
    @close="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      layout="vertical"
    >
      <a-form-item
        asterisk-position="end"
        label="支持添加主域名"
        field="name"
        :disabled="isEdit"
      >
        <a-input v-model="formState.name" placeholder="请输入域名"></a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        label="所属子产品"
        field="sub_product_type"
        :disabled="isEdit"
      >
        <a-select
          v-model="formState.sub_product_type"
          placeholder="请选择子产品"
          :options="productOpts"
          @change="formState.usage_type = undefined"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        :disabled="isEdit"
        asterisk-position="end"
        label="用途"
        field="usage_type"
      >
        <a-select v-model="formState.usage_type" placeholder="请选择用途">
          <a-option label="区域调度" :value="1" />
          <a-option
            label="系统域名解析"
            :value="2"
            v-if="formState.sub_product_type === 1"
          />
          <a-option
            label="用户空间"
            :value="3"
            v-if="formState.sub_product_type === 2"
          />
        </a-select>
      </a-form-item>
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
  addDnsSystemDomainApi,
  getDnsNssListApi,
  type SysDomainModel,
  updateDnsSystemDomainApi
} from '@vca/apis/dns'
import { getMicroAppData } from '@vca/shared'
import { domainReg, domainSplitReg, useSelectRemote } from 'vc-material'

interface IProps {
  modelValue: boolean
  record?: SysDomainModel
}

interface IEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit'): void
}

const emit = defineEmits<IEmits>()
const props = defineProps<IProps>()

const microAppData = computed(() => getMicroAppData())
const productList = computed(() => microAppData.value.productList)
const productOpts = computed(() =>
  ['cdn', 'oss'].map((key, index) => {
    const item = productList.value.find(item => item.symbol === key)
    if (!item) return []
    return {
      label: item.name,
      value: index + 1
    }
  })
)

const loading = ref(false)
const visible = useVModel(props, 'modelValue')
const isEdit = computed(() => !!props.record)
const title = computed(() => (!isEdit.value ? '添加域名' : '修改域名'))

const formRef = ref<FormInstance>()

type FormState = {
  name: string
  sub_product_type?: number
  usage_type?: number
  ns_id_list: string[]
}

const formState = reactive<FormState>({
  name: '',
  sub_product_type: undefined,
  usage_type: undefined,
  ns_id_list: []
})

const formRules = reactive<Record<string, FieldRule[]>>({
  name: [
    { required: true, message: '请输入域名' },
    {
      validator(value: string, callback) {
        if (value.length > 253) {
          return callback('域名总长度不能超过253个字符')
        }

        if (value.includes('.')) {
          const split = value.split('.').filter(item => item) as string[]

          for (const item of split) {
            if (!domainSplitReg.test(item)) {
              return callback(
                '每一级域名为字母、数字、“-”、“_”的组合且长度不能超过63字符'
              )
            }
          }
        }

        if (!domainReg.test(value)) {
          return callback('域名格式错误')
        }
        return true
      }
    }
  ],
  sub_product_type: [{ required: true, message: '请选择子产品' }],
  usage_type: [{ required: true, message: '请选择用途' }],
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
    isEdit.value
      ? await updateDnsSystemDomainApi({
          ...formState,
          id: props.record?.id!
        })
      : await addDnsSystemDomainApi(formState as Required<FormState>)
    Message.success(!props.record ? '添加成功' : '修改成功')
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
    formState.name = props.record.name!
    formState.sub_product_type = props.record.sub_product_type!
    formState.usage_type = props.record.usage_type!
    formState.ns_id_list = (props.record.assign_ns_list || []).map(v => v.id!)
  }
  remoteMethod()
}

const handleClose = () => {
  formRef.value?.resetFields()
}
</script>
