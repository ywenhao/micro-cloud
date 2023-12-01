<template>
  <a-spin :loading="loading" class="flex! w-full flex-1">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @submit-success="handleSubmitSuccess"
    >
      <a-alert class="mt-4 mb-6">
        <template #icon> <icon-info-circle-fill /> </template>
        官网关于我们模块展示
      </a-alert>
      <a-form-item
        class="mb-8!"
        asterisk-position="end"
        field="describe"
        label="标题描述"
      >
        <a-input
          :max-length="200"
          show-word-limit
          v-model="formState.describe"
          class="max-w-[400px]"
          placeholder="请输入描述"
        ></a-input>
      </a-form-item>
      <a-form-item
        class="mb-4!"
        asterisk-position="end"
        field="content"
        label="关于我们内容"
      >
        <vc-rich-text-editor
          :uploadFn="handleUploadFn"
          ref="richEditorRef"
          bordered
          :max-length="10000"
          class="w-full min-h-80!"
          v-model="formState.content"
        ></vc-rich-text-editor>
      </a-form-item>
      <a-form-item class="mb-0!">
        <a-button type="primary" html-type="submit">保存配置</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { IconInfoCircleFill } from '@arco-design/web-vue/es/icon'
import {
  confApi,
  confUpdateApi,
  ResultEnum,
  uploadFileApi
} from '@vca/apis/pedestal'
const MODULE_TYPE = 8
const loading = ref(false)
const formRef = ref<FormInstance>()
const richEditorRef = ref()
const formState = reactive({
  describe: '',
  content: ''
})
const rules: Record<string, FieldRule | FieldRule[]> = {
  describe: [{ required: true, message: '请输入标题描述' }],
  content: [
    {
      required: true,
      validator(_, callback) {
        const text = richEditorRef.value?.instance?.getText()
        callback(!text?.trim() ? '请输入关于我们内容' : '')
      },
      message: '请输入关于我们内容'
    }
  ]
}
const handleSubmitSuccess = () => {
  const text = richEditorRef.value?.instance?.getText()
  if (!text?.trim()) {
    formRef.value?.setFields({
      content: {
        message: '请输入关于我们内容',
        status: 'error'
      }
    })
    return
  }
  loading.value = true
  confUpdateApi({ conf_type: MODULE_TYPE, about_us_conf: formState })
    .then(() => {
      Message.success('保存成功')
    })
    .finally(() => {
      loading.value = false
    })
}

const getConfigInfo = () => {
  loading.value = true
  confApi({ type: MODULE_TYPE })
    .then(res => {
      Object.assign(formState, res.about_us_conf)
    })
    .finally(() => {
      loading.value = false
    })
}

const handleUploadFn = (data: any, insertImage: (path: string) => void) => {
  uploadFileApi(data).then(({ data }) => {
    if (data.code !== ResultEnum.SUCCESS) {
      const message = data?.message ?? '上传失败'
      Message.error(message)
      throw new Error(message)
    } else {
      const filepath = data?.data.filepath ?? ''
      insertImage(filepath)
    }
  })
}
onMounted(() => {
  getConfigInfo()
})
</script>

<style scoped>
:deep(.vc-container__content) {
  display: flex !important;
  flex-direction: column !important;
}
</style>
