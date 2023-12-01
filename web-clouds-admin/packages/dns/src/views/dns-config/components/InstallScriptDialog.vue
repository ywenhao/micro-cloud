<template>
  <vc-dialog
    v-model="visible"
    title="获取安装脚本"
    modal-class="form-dialog"
    :on-before-ok="async () => true"
    :footer="false"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      layout="vertical"
    >
      <a-form-item label="版本" field="node_version_id" asterisk-position="end">
        <a-select
          v-model="formState.node_version_id"
          placeholder="请选择版本"
          @change="clearScript"
          :loading="versionLoading"
          :options="versionOptions"
        ></a-select>
      </a-form-item>
      <a-form-item asterisk-position="end" label="DNS服务器地址" field="addr">
        <a-input
          @change="clearScript"
          v-model="formState.addr"
          placeholder="请输入DNS服务器地址，如：ns1.example.com"
        ></a-input>
      </a-form-item>
      <a-form-item asterisk-position="end" label="IP地址" field="ip" required>
        <a-input v-model="formState.ip" placeholder="请输入IP地址"></a-input>
      </a-form-item>

      <a-form-item hide-label field="assign_status">
        自动分配
        <a-switch
          class="ml-8px!"
          @change="clearScript"
          :checked-value="1"
          :unchecked-value="2"
          v-model="formState.assign_status"
        ></a-switch>
      </a-form-item>
      <a-form-item hide-label>
        <a-spin :loading="loading" class="w-full">
          <install-script-box
            :script="script"
            :end="genScriptOnceEnd"
            :script-btn-disabled="scriptBtnDisabled"
            @on-generate="generateScript"
          />
        </a-spin>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import {
  getDnsNodeVersionsListApi,
  getDnsNsCommandApi,
  type NsModel
} from '@vca/apis/dns'
import { domainReg, useSelectRemote } from 'vc-material'

import InstallScriptBox from './InstallScriptBox.vue'

interface IProps {
  modelValue: boolean
  record?: NsModel
}

interface IEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'submit'): void
}

defineEmits<IEmits>()
const props = defineProps<IProps>()
const visible = useVModel(props, 'modelValue')

const formRef = ref<FormInstance>()
const genScriptOnceEnd = ref(true)

const formRules: Rules = {
  node_version_id: [{ required: true, message: '请选择版本' }],
  addr: [
    { required: true, message: '请输入DNS服务器地址' },
    { match: domainReg, message: '请输入正确的DNS服务器地址' }
  ],
  ip: [{ required: true, message: '请输入IP地址' }]
}

const formState = reactive({
  node_version_id: '',
  addr: '',
  ip: '',
  assign_status: 1
})

const script = ref('')

const {
  loading: versionLoading,
  opts: versionOptions,
  remoteMethod: versionRemote
} = useSelectRemote(getDnsNodeVersionsListApi, {
  labelKey: 'version_name',
  valueKey: 'id',
  immediate: false
})

watchEffect(() => {
  if (visible.value) {
    versionRemote().then(() => {
      if (versionOptions.value.length) {
        formState.node_version_id = versionOptions.value[0].value as string
      }
    })
  } else {
    handleClose()
  }
})

const clearScript = () => {
  if (script.value) script.value = ''
}

const scriptBtnDisabled = computed(
  () => !formState.node_version_id || !formState.addr || !formState.ip
)

const loading = ref(false)
async function generateScript() {
  const err = await formRef.value?.validate()
  if (err) return
  loading.value = true
  try {
    const res = await getDnsNsCommandApi(formState)
    script.value = res.command!
    genScriptOnceEnd.value = false
  } finally {
    loading.value = false
  }
}

/**
 * @description dialog 关闭前事件
 */
const handleClose = () => {
  formRef.value?.resetFields()
}
</script>
