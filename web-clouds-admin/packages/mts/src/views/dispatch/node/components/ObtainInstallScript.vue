<template>
  <vc-dialog
    v-model="visible"
    title="获取安装脚本"
    modal-class="form-dialog"
    :footer="false"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="formRules"
      layout="vertical"
    >
      <a-form-item label="版本" asterisk-position="end" field="version_id">
        <a-select
          @change="clearScript"
          placeholder="请选择版本"
          v-model="formState.version_id"
          :loading="versionLoading"
          :options="versionOpts"
        />
      </a-form-item>
      <a-form-item label="区域" asterisk-position="end" field="region_id">
        <a-select
          @change="clearScript"
          :loading="regionLoading"
          v-model="formState.region_id"
          :options="regionOpts"
          placeholder="请选择区域"
        ></a-select>
      </a-form-item>
      <a-form-item label="IP地址" asterisk-position="end" field="address">
        <a-input
          @change="clearScript"
          v-model="formState.address"
          placeholder="请输入IP地址"
        ></a-input>
      </a-form-item>
      <a-form-item
        label="最大并发任务数"
        asterisk-position="end"
        field="run_number"
      >
        <a-input-number
          @change="clearScript"
          v-model="formState.run_number"
          :min="1"
          :max="1000"
          :precision="0"
        />
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

<script lang="ts" setup>
import { type FormInstance } from '@arco-design/web-vue'
import { getMtsVersionApi, postMtsCmdApi } from '@vca/apis/mts'
import { regionListApi } from '@vca/apis/oss'
import { isNil } from 'lodash-es'
import { ipv4Reg, useSelectRemote } from 'vc-material'

import InstallScriptBox from './InstallScriptBox.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
const visible = useVModel(props, 'modelValue', emit)

const formRef = ref<FormInstance>()

const formRules: Rules = {
  version_id: [{ required: true, message: '请选择版本' }],
  region_id: [{ required: true, message: '请选择区域' }],
  address: [
    { required: true, message: '请输入IP地址' },
    { match: ipv4Reg, message: '请输入正确的IPv4地址' }
  ],
  run_number: [{ required: true, message: '请输入最大并发任务数' }]
}

const loading = ref(false)

const formState = reactive({
  version_id: '',
  region_id: '',
  address: '',
  run_number: 3
})

const script = ref('')
const genScriptOnceEnd = ref(true)

const clearScript = () => {
  if (script.value) script.value = ''
}

const scriptBtnDisabled = computed(
  () =>
    !formState.version_id ||
    !formState.region_id ||
    !formState.address ||
    isNil(formState.run_number)
)

const {
  loading: versionLoading,
  opts: versionOpts,
  remoteMethod: versionRemote
} = useSelectRemote(getMtsVersionApi, {
  labelKey: 'code',
  valueKey: 'id',
  immediate: false
})

const {
  loading: regionLoading,
  opts: regionOpts,
  remoteMethod: regionRemote
} = useSelectRemote(regionListApi, {
  labelKey: 'name',
  valueKey: 'id',
  immediate: false
})

watch(formState, () => {
  script.value = ''
})

function handleClose() {
  formRef.value?.resetFields()
}

const handleOpen = () => {
  versionRemote().then(() => {
    if (versionOpts.value.length) {
      formState.version_id = versionOpts.value[0].value as string
    }
  })
  regionRemote()
}

async function generateScript() {
  const err = await formRef.value?.validate()
  if (err) return
  loading.value = true
  try {
    const res = await postMtsCmdApi(formState)
    script.value = res.cmd!
    genScriptOnceEnd.value = false
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (visible.value) {
    handleOpen()
  } else {
    handleClose()
  }
})
</script>
