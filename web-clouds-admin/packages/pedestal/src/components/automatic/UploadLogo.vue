<template>
  <a-upload
    action="/"
    class="upload-logo"
    :accept="imageAccept"
    :show-file-list="false"
    :disabled="loading"
    :custom-request="handleCustomRequest"
  >
    <template #upload-button>
      <div :class="`arco-upload-list-item`">
        <div
          class="arco-upload-list-picture custom-upload-avatar"
          v-if="modelValue"
        >
          <vc-image :src="modelValue" />
          <a-image-preview :src="modelValue" v-model:visible="previewVisible" />
          <div
            class="arco-upload-list-picture-mask flex items-center justify-center gap-x-3"
          >
            <icon-zoom-in @click.stop.prevent="previewVisible = true" />
            <icon-delete @click.stop.prevent="handleClear" />
          </div>
        </div>
        <div class="arco-upload-picture-card" v-else>
          <a-spin class="inline!" :loading="loading">
            <div class="arco-upload-picture-card-text">
              <icon-plus />
              <div class="mt-2">上传图片</div>
            </div>
          </a-spin>
        </div>
      </div>
    </template>
  </a-upload>
</template>

<script setup lang="ts">
import type { RequestOption } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { IconDelete, IconPlus, IconZoomIn } from '@arco-design/web-vue/es/icon'
import { ResultEnum, uploadFileApi } from '@vca/apis/pedestal'
import type { AxiosProgressEvent } from 'axios'
import { imageAccept } from 'vc-material'

interface IProps {
  modelValue: string
  isUpload?: boolean
  max?: number
  size?: string
}
interface IEmits {
  (event: 'update:model-value', value: string): void
  (event: 'update:isUpload', value: boolean): void
}

const props = withDefaults(defineProps<IProps>(), {
  max: 1024 ** 2 * 2,
  size: '120px'
})
const emit = defineEmits<IEmits>()

const previewVisible = ref(false)
const loading = ref(false)

const handleCustomRequest = (options: RequestOption) => {
  const { onProgress, fileItem } = options

  const { file } = fileItem
  loading.value = true
  emit('update:isUpload', loading.value)
  if (file!.size > props.max) {
    Message.error('请选择2MB以内文件')
    loading.value = false
    emit('update:isUpload', loading.value)
    return
  }
  try {
    uploadFileApi(
      { file: file! },
      {
        onUploadProgress: (axiosEvent: AxiosProgressEvent) => {
          let percent = 0
          const { event } = axiosEvent
          if ((event?.total || 0) > 0) {
            // 0 ~ 1
            percent = event.loaded / event!.total!
          }
          onProgress(percent, event)
        }
      }
    ).then(({ data }) => {
      if (data.code !== ResultEnum.SUCCESS) {
        const message = data?.message ?? '上传失败'
        Message.error(message)
        // uploadRef.value?.clearFiles()
        throw new Error(message)
      } else {
        const filepath = data?.data.filepath ?? ''
        emit('update:model-value', filepath)
        // modelValue.value = filepath
        // Message.success('上传成功')
      }
      loading.value = false
      emit('update:isUpload', loading.value)
    })

    return undefined
  } catch (error) {
    loading.value = false
    const message = (error as string) || '上传失败'
    emit('update:isUpload', loading.value)
    Message.error(message)
    // uploadRef.value?.clearFiles()
    return undefined
  }
}
const handleClear = () => {
  emit('update:model-value', '')
}
</script>

<style scoped lang="less">
.upload-logo,
.arco-upload-picture-card {
  width: v-bind(size);
  height: v-bind(size);
  border-radius: 6px;
  .arco-upload-list-item,
  .arco-upload-list-picture {
    margin: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
