<template>
  <vc-dialog
    @open="handleOpen"
    :loading="loading"
    v-model="visible"
    title="版本升级"
    :on-before-ok="handleOk"
    modal-class="form-dialog"
    :ok-btn-disabled="!formState.version_id"
    @close="handleClose"
  >
    <a-alert :show-icon="false" class="mb-6"
      >当前版本：{{ emptyText(currentVersion) }}</a-alert
    >
    <a-form :model="formState" ref="formRef" layout="vertical">
      <a-form-item
        field="version_id"
        label="选择版本"
        asterisk-position="end"
        :rules="[{ required: true, message: '请选择版本' }]"
      >
        <a-select
          :loading="versionLoading"
          v-model="formState.version_id"
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
<script lang="ts" setup>
import { type FormInstance, Message } from '@arco-design/web-vue'
import type { NodeItemModel, VersionModel } from '@vca/apis/mts'
import { getMtsVersionApi, postMtsNodeUpgradeApi } from '@vca/apis/mts'
import { emptyText, useSelectRemote } from 'vc-material'

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

const formState = reactive({
  version_id: ''
})

const formRef = ref<FormInstance>()

const loading = ref(false)
const currentVersion = ref('')
const versionData = ref<VersionModel[]>([])

const getVersionApi = (params: any) =>
  getMtsVersionApi(params).then(res => {
    versionData.value = res?.list || []
    return res
  })

const {
  loading: versionLoading,
  opts: versionOptions,
  remoteMethod
} = useSelectRemote(getVersionApi, {
  labelKey: 'code',
  valueKey: 'id',
  immediate: false
})

const remark = computed(
  () => versionData.value.find(v => v.id === formState.version_id)?.remark
)

const handleOk = async () => {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  try {
    await postMtsNodeUpgradeApi({
      id: props.record?.id!,
      version_id: formState.version_id
    })
    Message.success('升级成功')
    emit('submit')
  } finally {
    loading.value = false
  }
}

function handleClose() {
  formRef.value?.resetFields()
}

const handleOpen = () => {
  remoteMethod()
  console.log(props.record)
  currentVersion.value = props.record?.version!
}
</script>
