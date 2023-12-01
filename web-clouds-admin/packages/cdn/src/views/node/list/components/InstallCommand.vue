<template>
  <vc-dialog
    :on-before-ok="async () => {}"
    title="获取安装脚本"
    :loading="loading"
    v-model="visible"
    :footer="false"
    :confirm-button-disabled="!modelValue"
    modal-class="form-dialog"
    :ok-btn-disabled="!formState.version_id"
  >
    <a-form :model="formState" ref="formRef" :rules="rules" layout="vertical">
      <a-form-item label="区域" field="region_id" asterisk-position="end">
        <a-select
          v-model="formState.region_id"
          placeholder="请选择"
          class="w-full"
          :options="regions"
          :triggerProps="{ autoFitPopupMinWidth: true }"
        >
        </a-select>
      </a-form-item>

      <a-form-item label="版本" field="version_id" asterisk-position="end">
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

      <a-form-item hide-label>
        <a-card
          class="install-command-card"
          title="在节点上执行该脚本，用于安装CDN节点程序；"
        >
          <template #extra>
            <a-tag v-if="installCommand" @click="handleCopy(installCommand)"
              >复制脚本</a-tag
            >
          </template>
          <a-spin class="w-full h-full" :loading="loading">
            <div
              class="min-h-104px break-all"
              :class="{
                'flex flex-col items-center justify-center':
                  (regeneration && !installCommand) ||
                  !formState.region_id ||
                  !formState.version_id ||
                  !installCommand
              }"
            >
              <template v-if="installCommand">{{ installCommand }}</template>
              <a-button
                v-else
                type="outline"
                @click="handleSubmit"
                :disabled="!formState.region_id || !formState.version_id"
              >
                {{ regeneration && !installCommand ? '重新' : '' }}生成脚本
              </a-button>
              <span
                v-if="regeneration && !installCommand"
                class="text-ct-3 mt-3 text-xs"
              >
                切换区域或版本，需要重新生成脚本。
              </span>
            </div>
          </a-spin>
        </a-card>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  Message,
  type SelectOption
} from '@arco-design/web-vue'
import {
  getCdnnodeNodesInstallCommandApi,
  getVersionsListApi
} from '@vca/apis/cdn'
import { useClipboard } from 'vc-material'

const visible = defineModel<boolean>({ required: true, default: false })
const regions = defineModel<SelectOption[]>('regions', { required: true })

const installCommand = ref('')
const { copy } = useClipboard()
const loading = ref(false)
const versionLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive({
  version_id: '',
  region_id: ''
})
const rules: Rules = {
  version_id: [{ required: true, message: '请选择版本' }],
  region_id: [{ required: true, message: '请选择区域' }]
}

const regeneration = ref(false)
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
  loading.value = true
  getCdnnodeNodesInstallCommandApi(formState)
    .then(res => {
      installCommand.value = res?.command || ''
      regeneration.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

function handleCopy(text: string) {
  copy(text)
  Message.success('复制成功')
}

watchEffect(() => {
  if (!visible.value) {
    formRef.value?.resetFields()
    regeneration.value = false
  } else {
    getVersions()
  }
})

watch(
  () => formState,
  () => {
    installCommand.value = ''
  },
  { deep: true }
)
</script>

<style lang="less">
.install-command-card {
  @apply border-color-2! w-full;
  .arco-card-header {
    @apply h-8! flex items-center bg-fill-3 px-3!;
    .arco-card-header-title {
      @apply text-xs! font-normal;
    }
    .arco-card-header-extra {
      .arco-tag {
        @apply h-22px! text-xs bg-fill-5 text-white cursor-pointer;
      }
    }
  }
}
</style>
