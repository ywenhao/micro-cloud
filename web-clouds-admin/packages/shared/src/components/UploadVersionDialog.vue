<template>
  <vc-dialog
    :loading="loading"
    v-model="visible"
    :title="title"
    :ok-btn-disabled="uploading || !formState.file_key"
    :on-before-ok="handleOk"
    modal-class="form-dialog"
    @close="handleClose"
  >
    <!-- :cancel-btn-disabled="uploading" -->
    <!-- :closable="!uploading" -->
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        label="版本文件"
        help="仅支持格式：.tar.gz的文件"
        asterisk-position="end"
        required
        class="mb-24px!"
      >
        <a-upload
          action="/"
          v-if="visible"
          v-model:file-list="fileList"
          :show-remove-button="false"
          :show-cancel-button="false"
          accept="application/x-gzip"
          :on-before-upload="handleBeforeUpload"
          :custom-request="handleCustomRequest"
        >
          <template #upload-button>
            <a-button type="primary" :disabled="uploading">
              <upload-icon class="mr-2" />
              点击上传
            </a-button>
          </template>
        </a-upload>
      </a-form-item>
      <a-form-item hide-label v-if="version">
        <div class="version">版本号：{{ version }}</div>
      </a-form-item>
      <a-form-item label="版本说明" field="remark">
        <a-textarea
          class="version-input"
          :max-length="200"
          showWordLimit
          v-model="formState.remark"
          placeholder="请输入版本说明"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script lang="ts" setup>
import 'vc-material/theme-chalk/dialog.css'

import type { FormInstance } from '@arco-design/web-vue'
import {
  type FieldRule,
  type FileItem,
  Message,
  type RequestOption
} from '@arco-design/web-vue'
import { postUploadFileChunkCompleteApi } from '@vca/apis/mts'
import type { UploadFinishParams } from '@vca/shared/src/lib/slice-upload-utils'
import { useVModel } from '@vueuse/core'
import { VcDialog } from 'vc-material'
import { reactive, ref, watch } from 'vue'

import { getSource, useUpload } from './hooks'
import UploadIcon from './icon/UploadIcon.vue'

const uploadUtils = useUpload()

const props = withDefaults(
  defineProps<{
    title?: string
    modelValue: boolean
    addRequest: (params: { file_key: string; remark: string }) => Promise<any>
  }>(),
  {
    title: '上传版本'
  }
)

const emit = defineEmits<{
  (event: 'submit'): void
  (event: 'update:modelValue', value: boolean): void
}>()

const visible = useVModel(props, 'modelValue', emit)
const loading = ref(false)
const uploading = ref(false)
const fileList = ref<FileItem[]>([])

// 设置上传文件
watch(
  fileList,
  val => (uploadUtils.uploadFile = val.length ? val[0].file : undefined)
)

const formState = reactive({
  file_key: '',
  remark: ''
})
const version = ref('')

const rules: Record<string, FieldRule[]> = {
  // file_key: [{ required: true,  }]
}
const formRef = ref<FormInstance>()

const handleBeforeUpload = () => {
  fileList.value = []
  return true
}

const handleCustomRequest = (options: RequestOption) => {
  const { onError, onSuccess, onProgress } = options
  uploading.value = true
  uploadUtils.setOnError(() => {
    onError()
    uploading.value = false
  })

  uploadUtils.setOnProgress((percent: number) => {
    onProgress(percent / 100)
  })

  uploadUtils.setOnFinish(async (params: UploadFinishParams) => {
    const chunk_id = params.preHash
    const chunk_total = String(params.chunkTotal)
    const source = getSource()
    try {
      const res = await postUploadFileChunkCompleteApi({
        chunk_id,
        chunk_total,
        source,
        // @ts-ignore 接口文档错误
        file_name: params.filename
      })
      // @ts-ignore 接口文档错误
      formState.file_key = res.file_key!
      // @ts-ignore 接口文档错误
      version.value = res.version
      // Message.success('上传文件成功')
      onSuccess()
    } catch (err) {
      setTimeout(() => onError())
      uploadUtils.cancel()
    } finally {
      uploading.value = false
    }
  })

  uploadUtils.start()
  return {
    abort: () => uploadUtils.cancel()
  }
}

const handleClose = async () => {
  formRef.value?.resetFields()
  uploadUtils.cancel()
  fileList.value = []
  uploading.value = false
  version.value = ''
}

const handleOk = async () => {
  if (!formState.file_key) {
    Message.error('请上传文件')
    return false
  }
  loading.value = true
  try {
    await props.addRequest(formState)
    Message.success('上传成功')
    emit('submit')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.version {
  padding: 6px 16px;
  width: 100%;
  font-size: 14px;
  background-color: #e8f3ff;
  border-radius: 6px;
  font-weight: 400;
  line-height: 22px;
}
.version-input {
  :deep(.arco-textarea) {
    width: 100%;
    height: 72px;
    min-height: 72px;
    max-height: 130px;
  }
}
</style>
