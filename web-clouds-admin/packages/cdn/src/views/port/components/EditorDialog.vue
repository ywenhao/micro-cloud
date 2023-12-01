<template>
  <vc-dialog
    :title="dialogTitle"
    :loading="loading"
    v-model="visible"
    @before-open="handleBeforeOpen"
    @before-close="handleBeforeClose"
    :on-before-ok="handleSubmit"
    :confirm-button-disabled="!modelValue"
    modal-class="form-dialog"
  >
    <a-form ref="formRef" :rules="rules" :model="formState" layout="vertical">
      <div v-if="formState.id">
        <span class="mr-3">协议类型:</span>
        {{ formState.scheme === 1 ? 'HTTP' : 'HTTPS' }}
      </div>
      <a-form-item field="scheme" v-else label="协议类型">
        <a-radio-group
          v-model="formState.scheme"
          :options="[
            { label: 'HTTP', value: 1 },
            { label: 'HTTPS', value: 2 }
          ]"
        />
      </a-form-item>
      <a-form-item field="port" label="端口范围">
        <a-input v-if="record?.id" v-model="formState.port"></a-input>
        <a-textarea
          v-else
          v-model="formState.port"
          :auto-size="{ minRows: 6, maxRows: 6 }"
        />

        <template #help>
          说明：<br />
          1.取值范围1024-65535<br />
          2.HTTP协议默认使用80端口，HTTPS默认使用443端口，HTTP协议和HTTPS端口范围的配置不允许交叉。
        </template>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { addCdnPortsApi, updateCdnPortsListByIdApi } from '@vca/apis/cdn'

interface IFormState {
  id: string
  port: string
  scheme: number
  port_range: string[]
}
const formState = reactive<IFormState>({
  id: '',
  port: '',
  scheme: 1,
  port_range: []
})
const formRef = ref<FormInstance>()
const visible = defineModel<boolean>({ required: true })
const record = defineModel<any>('record', { required: true })

const loading = ref(false)
const dialogTitle = computed(() => (record.value?.id ? '编辑端口' : '添加端口'))

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const isInRange = (port: string) => {
  return !['8000', '9000'].includes(port)
}

var regPos = /^\d+$/ // 非负整数
const checkPort = (value: any, callback: any) => {
  const valueList = value.split('\n')
  for (let j = 0; j < valueList.length; j++) {
    var isPass = false
    const range = valueList[j]
    for (let i = 0; i < range.length; i++) {
      const item = range.split('-')
      if (
        +item[0] >= 1024 &&
        +item[1] <= 65535 &&
        +item[0] <= +item[1] &&
        regPos.test(item[0]) &&
        regPos.test(item[1])
      ) {
        isPass = true
        break
      }
    }
    if (!isPass) return callback('端口格式有误，请调整')
  }
  callback()
}
const rules: Rules = {
  port: [
    { required: true, message: '请输入端口范围' },
    { validator: checkPort },
    {
      validator(value: string, callback: ValidateCallback) {
        const valueList = value.split('\n')
        for (let j = 0; j < valueList.length; j++) {
          var isPass = false
          const range = valueList[j]
          for (let i = 0; i < range.length; i++) {
            const item = range.split('-')
            if (isInRange(item[0]) && isInRange(item[1])) {
              isPass = true
              break
            }
          }
          if (!isPass) return callback('端口已超出允许配置范围，请调整')
        }
      }
    }
  ]
}

async function handleSubmit() {
  const vali = await formRef.value?.validate()
  if (!vali) {
    try {
      loading.value = true
      const isEdit = record?.value?.id
      const action = record?.value?.id
        ? updateCdnPortsListByIdApi
        : addCdnPortsApi
      const params: any = {}
      if (record?.value?.id) {
        params.id = formState.id
        params.port_range = formState.port.toString()
      } else {
        params.scheme = formState.scheme
        params.port_range = [...new Set(formState.port.split('\n'))]
      }
      // params.port_range = params.port_range.split('\n')
      await action({ ...params })
      Message.success(isEdit ? '修改成功' : '添加成功')
      emit('reload')
      return true
    } finally {
      loading.value = false
    }
  }
  return false
}

const handleBeforeOpen = () => {
  if (record.value?.id) {
    const { id, port_range } = record.value
    formState.id = id
    formState.port = port_range
  }
}
const handleBeforeClose = () => {
  record.value = undefined
  formState.id = ''
  formState.port = ''
  formState.scheme = 1
  formState.port_range = []
  formRef.value?.resetFields()
  visible.value = false
}
</script>
