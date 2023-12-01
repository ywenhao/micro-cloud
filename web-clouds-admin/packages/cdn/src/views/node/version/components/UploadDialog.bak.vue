<template>
  <vc-dialog
    title="上传版本"
    v-model="visible"
    :loading="loading || uploading"
    :closable="!loading && !uploading"
    @before-ok="handleConfirm"
    :confirm-button-disabled="!modelValue"
    modal-class="form-dialog"
    :cancel-button-props="{
      loading: loading || uploading
    }"
  >
    <a-form ref="formRef" :rules="rules" :model="state" layout="vertical">
      <a-form-item field="file_key" label="上传附件">
        <a-upload
          :show-cancel-button="false"
          v-model:file-list="fileList"
          accept="application/x-gzip"
          :on-before-upload="handleBeforeUpload"
          :custom-request="customRequest"
        >
          <template #upload-button>
            <a-button type="primary">
              <template #icon>
                <vc-svg-icon name="upload" prefix="cdn" :size="16" />
              </template>
              上传文件
            </a-button>
          </template>
          <template #success-icon>
            <icon-check-circle-fill />
          </template>
        </a-upload>
      </a-form-item>
      <a-alert v-if="state.version" class="mb-6" :show-icon="false">
        版本号：{{ state.version }}
      </a-alert>
      <a-form-item field="desc" label="备注">
        <a-textarea
          v-model="state.desc"
          :max-length="200"
          show-word-limit
          :auto-size="{ minRows: 5, maxRows: 6 }"
          placeholder="请输入备注信息"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  Message,
  type RequestOption
} from '@arco-design/web-vue'
import { IconCheckCircleFill } from '@arco-design/web-vue/es/icon'
import { addVersionsApi, postCdnVersionsFileApi } from '@vca/apis/cdn'
import { type Canceler } from 'axios'

interface IEmits {
  (event: 'reload'): void
}

const emit = defineEmits<IEmits>()
const formRef = ref<FormInstance>()
const visible = defineModel<boolean>({ required: true })
const loading = ref(false)
const fileList = ref([])
const uploading = ref(false)
const handleBeforeUpload = () => {
  fileList.value = []
  return true
}

const rules: Rules = {
  file_key: [{ required: true, message: '请上传附件' }]
}

const state = reactive({
  file_key: '',
  version: '',
  desc: ''
})

const cancel = ref<Canceler>()
const customRequest = (option: RequestOption) => {
  uploading.value = true
  const { onProgress, onError, onSuccess, fileItem } = option
  const formData = new FormData()
  formData.append('file', fileItem.file!)
  postCdnVersionsFileApi(
    formData as any,
    (event: any) => {
      let percent = 0
      if (event.total > 0) {
        percent = event.loaded / event.total
      }
      onProgress(percent, event)
    },
    cancel
  )
    .then((res: any) => {
      if (String(res.code).endsWith('6200')) {
        state.file_key = res.data.file_key
        state.version = res.data.version
        uploading.value = false
        onSuccess()
      } else {
        Message.error(res.message)
        uploading.value = false
        onError()
      }
    })
    .catch(() => {
      onError()
      uploading.value = false
    })
    .finally(() => {
      uploading.value = false
    })

  return {
    abort() {
      cancel.value && cancel.value()
    }
  }
}

const handleConfirm = async () => {
  const errors = await formRef.value?.validate()
  if (errors) {
    return false
  }
  try {
    await addVersionsApi(state)
    Message.success('添加成功')
    emit('reload')
    return true
  } catch (_) {
    return false
  }
}

watchEffect(() => {
  if (!visible.value) {
    // content.value = ''
  } else {
    // remoteMethod()
  }
})
</script>
