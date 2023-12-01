<template>
  <vc-dialog
    title="版本升级"
    :loading="loading"
    v-model="visible"
    :on-before-ok="handleSubmit"
    :confirm-button-disabled="!modelValue"
    modal-class="form-dialog"
    :ok-btn-disabled="!formState.version_id"
  >
    <a-form :model="formState" layout="vertical">
      <a-form-item label="选择版本" hide-asterisk>
        <a-select
          v-model="formState.version_id"
          placeholder="请选择"
          :loading="versionLoading"
          class="w-full"
          :options="versions"
          :triggerProps="{ autoFitPopupMinWidth: true }"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import { Message, type SelectOption } from '@arco-design/web-vue'
import { getVersionsListApi, postCdnnodeNodesUpgradeApi } from '@vca/apis/cdn'

interface IEmits {
  (event: 'reload'): void
}

const recordId = defineModel<string>('recordId', { required: true })
const emit = defineEmits<IEmits>()
const visible = defineModel<boolean>({ required: true })

const loading = ref(false)
const versionLoading = ref(false)
const formState = reactive({
  node_id: computed(() => recordId.value),
  version_id: ''
})

const versions = ref<SelectOption[]>([])
const getVersions = () => {
  versionLoading.value = true
  getVersionsListApi({ limit: '99999', offset: '0' })
    .then(res => {
      versions.value = (res?.list || []).map(item => ({
        value: String(item.id),
        label: String(item.version)
      }))
    })
    .finally(() => {
      versionLoading.value = false
    })
}

async function handleSubmit() {
  try {
    loading.value = true
    await postCdnnodeNodesUpgradeApi(formState)
    Message.success('版本升级请求发送成功')
    emit('reload')
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (!visible.value) {
    formState.version_id = ''
  } else {
    getVersions()
  }
})
</script>
