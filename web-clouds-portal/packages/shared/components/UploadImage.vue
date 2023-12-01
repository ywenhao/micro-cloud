<template>
  <a-upload
    ref="uploadRef"
    :disabled="disabled"
    action="#"
    multiple
    :accept="imageAccept"
    :limit="limit"
    :file-list="fileList"
    :on-before-upload="handleBeforeUpload"
    @exceed-limit="handleExceed"
    :custom-request="httpRequest"
    list-type="picture-card"
    :on-before-remove="handleRemove"
    image-preview
  >
    <template #upload-button>
      <div class="default-plus">
        <vc-svg-icon class="w-14px h-14px" name="plus" />
        <div line-height-20px mt8px text-14px>点击上传</div>
      </div>
    </template>
    <template #preview-icon>
      <vc-svg-icon class="w-20px h-20px" name="preview" />
    </template>
    <template #remove-icon>
      <vc-svg-icon class="w-20px h-20px" name="delete" />
    </template>
  </a-upload>
</template>

<script setup lang="ts">
import {
  type FileItem,
  Message,
  type RequestOption,
  type UploadInstance
} from '@arco-design/web-vue'
import { imageAccept } from 'vc-material'
import { computed, ref } from 'vue'

import { mergeBaseURL } from '..'

const props = withDefaults(
  defineProps<{
    customRequest: (params: FormData, config: any) => Promise<string>
    disabled?: boolean
    limit?: number
    fileSize?: number
    modelValue: string[]
  }>(),
  {
    fileSize: 10 * 1024 * 1024
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

type UploadStatus = 'init' | 'uploading' | 'done' | 'error'

const uploadRef = ref<UploadInstance>()
const status = ref<UploadStatus>('init')

const fileList = computed(
  () =>
    props.modelValue.map(url => ({
      name: url.split('/').pop()!,
      url: mergeBaseURL(url)
    })) as FileItem[]
)

const httpRequest = (option: RequestOption) => {
  const { onError, onSuccess, fileItem, onProgress } = option
  const file = fileItem.file!
  const data = new FormData()
  data.append('file', file)
  status.value = 'uploading'

  const abort = new AbortController()

  props
    .customRequest(data, {
      signal: abort.signal,
      onUploadProgress: (e: ProgressEvent) => {
        const p = e.loaded / e.total
        onProgress(p)
      }
    })
    .then(filepath => {
      emit('update:modelValue', [...props.modelValue, filepath!])
      onSuccess(filepath!)
      status.value = 'done'
    })
    .catch(e => {
      onError(e)
      status.value = 'error'
    })
  return {
    abort: () => {
      abort.abort()
    }
  }
}

const handleBeforeUpload = (file: File) => {
  status.value = 'init'
  if (file.size > props.fileSize!) {
    Message.error(`请选择${props.fileSize / 1024 / 1024}M以内文件`)
    return false
  }
  return true
}

const handleExceed = () => {
  status.value = 'init'
  Message.error(`最多只能上传 ${props.limit} 张图片`)
}

const handleRemove = async (uploadFile: FileItem) => {
  const list = props.modelValue.filter(
    url => url.split('/').pop() !== uploadFile.url!.split('/').pop()
  )

  emit('update:modelValue', list)
  return true
}

defineExpose({ status })
</script>

<style lang="less" scoped>
:deep(.arco-upload) {
  width: 94px;
  height: 94px;
  background: var(--color-fill-2);
  border: 1px dashed var(--color-border-2);
  border-radius: 6px;
  & > span {
    display: block;
    width: 100%;
    height: 100%;
  }
}
:deep(.arco-upload-list) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  .arco-upload-list-picture {
    margin: 0;
    width: 94px;
    height: 94px;
    background-color: var(--color-fill-2);
    img {
      object-fit: cover;
      border-radius: 6px;
    }
    .arco-upload-list-picture-operation {
      justify-content: center;
      align-items: center;
      height: 100%;
      line-height: initial;
      column-gap: 18px;
      .arco-upload-icon-upload {
        color: #fff;
      }
    }
  }
}
.default-plus {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-2);
  flex-direction: column;
}
</style>
