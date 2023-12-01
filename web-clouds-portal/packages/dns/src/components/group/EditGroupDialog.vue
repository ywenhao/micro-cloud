<template>
  <vc-dialog
    :title="title"
    :loading="loading"
    v-model="visible"
    width="588px"
    modal-class="form-dialog"
    @close="handleClose"
    :on-before-ok="handleSubmit"
    @open="handleOpen"
  >
    <a-form ref="formRef" :rules="rules" :model="formData" layout="vertical">
      <a-form-item asterisk-position="end" label="分组名称" field="name">
        <a-input
          v-model="formData.name"
          :max-length="20"
          placeholder="请输入对象组名称"
        ></a-input>
      </a-form-item>

      <a-form-item hide-label asterisk-position="end" field="domain_ids">
        <vcp-transfer
          v-if="visible"
          :title="['待选择域名', '已选择域名']"
          v-model="formData.domain_ids"
          :request="domainListRequest"
        >
        </vcp-transfer>
      </a-form-item>

      <a-form-item asterisk-position="end" label="备注" field="remark">
        <a-input
          v-model="formData.remark"
          class="w-full"
          :max-length="20"
          placeholder="请输入备注"
        ></a-input>
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
  domainGroupAddApi,
  domainGroupEditApi,
  type DomainGroupModel,
  domainListApi
} from '@vcp/apis/dns'

const emit = defineEmits<{
  submit: []
  'update:modelValue': [value: boolean]
}>()

const props = defineProps<{
  modelValue: boolean
  record?: DomainGroupModel
}>()

const visible = useVModel(props, 'modelValue')

const title = computed(() => (props.record ? '编辑分组' : '新建分组'))
const loading = ref(false)
const formRef = ref<FormInstance>()

interface IFormData {
  name: string
  domain_ids: string[]
  remark: string
}
const formData = reactive<IFormData>({
  name: '',
  domain_ids: [],
  remark: ''
})

const rules: Record<string, FieldRule[]> = {
  name: [
    {
      required: true,
      message: '请输入分组名称'
    },
    {
      // 不能有空格
      match: /^[^\s]*$/,
      message: '可以由英文、中文、符号组成，不能包含空格'
    }
  ]
}

// 是否编辑模式
const isEdit = computed(() => !!props.record)

const handleOpen = () => {
  if (isEdit.value) {
    formData.name = props.record?.name as string
    formData.remark = props.record?.remark as string
  }
}

function handleClose() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

async function domainListRequest() {
  const res = await domainListApi({ limit: 0 })
  const list = res.list || []
  formData.domain_ids = list
    .filter(v => v.group_id === props.record?.id)
    .map(v => v.id!)
  return (
    // 数据过滤,保留自身和未分组的域名
    list
      .filter(
        item => item.group_id === '0' || item.group_id === props.record?.id
      )
      .map(item => ({
        value: item.id!,
        label: item.name!,
        disabled: false
      }))
  )
}

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    if (isEdit.value) {
      await domainGroupEditApi({
        ...formData,
        id: props.record?.id!
      })
    } else {
      await domainGroupAddApi(formData)
    }
    const message = isEdit.value ? '编辑成功' : '新建成功'
    Message.success(message)
    emit('submit')
  } finally {
    loading.value = false
  }
}
</script>
