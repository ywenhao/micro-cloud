<template>
  <vc-dialog
    v-model="visible"
    :loading="loading"
    title="版本升级"
    @close="handleClose"
    modal-class="form-dialog"
    :on-before-ok="handleSubmit"
    :ok-btn-disabled="!formState.node_version_id"
  >
    <a-alert :show-icon="false" class="mb-6"
      >当前版本：{{ emptyText(currentVersion) }}</a-alert
    >
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item
        label="选择版本"
        field="node_version_id"
        asterisk-position="end"
        :rules="[{ required: true, message: '请选择版本' }]"
      >
        <a-select
          :loading="versionLoading"
          v-model="formState.node_version_id"
          placeholder="请选择版本"
          :options="versionOptions"
        />
      </a-form-item>
    </a-form>
    <a-alert class="mb-24px" :show-icon="false" type="normal">
      <div>版本说明：</div>
      <div v-if="remark" class="mt-2 color-ct-2 leading-20px">{{ remark }}</div>
      <div v-else class="mt-2 color-ct-4 leading-20px">暂无说明</div>
    </a-alert>
  </vc-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import type { NodeVersionModel } from '@vca/apis/dns'
import {
  getDnsNodeVersionsListApi,
  type NsModel,
  postDnsNsUpgradeApi
} from '@vca/apis/dns'
import { emptyText, useSelectRemote } from 'vc-material'

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

const formRef = ref<FormInstance>()

const formState = reactive({
  node_version_id: ''
})

const currentVersion = ref('')
const versionData = ref<NodeVersionModel[]>([])

const getVersionApi = (params: any) =>
  getDnsNodeVersionsListApi(params).then(res => {
    versionData.value = res?.list || []
    return res
  })

const {
  loading: versionLoading,
  opts: versionOptions,
  remoteMethod
} = useSelectRemote(getVersionApi, {
  labelKey: 'version_name',
  valueKey: 'id',
  immediate: false
})

const remark = computed(
  () => versionData.value.find(v => v.id === formState.node_version_id)?.remark
)

const handleSubmit = async () => {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    await postDnsNsUpgradeApi({
      id: props.record?.id!,
      ...formState
    })
    emit('submit')
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

const handleOpen = () => {
  remoteMethod()
  currentVersion.value = props.record?.current_version!
}

watchEffect(() => {
  if (visible.value) {
    handleOpen()
  }
})
</script>
