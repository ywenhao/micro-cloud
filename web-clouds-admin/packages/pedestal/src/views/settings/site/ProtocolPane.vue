<template>
  <a-spin :loading="loading" class="flex! w-full flex-1">
    <a-form
      :model="formState"
      layout="vertical"
      :rules="rules"
      @submit-success="handleSubmitSuccess"
    >
      <a-form-item
        class="mt-4!"
        asterisk-position="end"
        field="content"
        label="用户端底部展示，及注册时用户勾选的协议"
      >
        <vc-rich-text-editor
          ref="richEditorRef"
          bordered
          :max-length="10000"
          class="w-full min-h-80! padding"
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
import { Message } from '@arco-design/web-vue'
import { confApi, confUpdateApi } from '@vca/apis/pedestal'
const MODULE_TYPE = 5
const loading = ref(false)
const richEditorRef = ref()
const formState = reactive({
  content: ''
})
const rules: Rules = {
  content: [
    {
      required: true,
      validator(_, callback) {
        const text = richEditorRef.value?.instance?.getText()
        callback(!text?.trim() ? '请输入协议内容' : '')
      },
      message: '请输入协议内容'
    }
  ]
}
const handleSubmitSuccess = () => {
  loading.value = true
  confUpdateApi({ conf_type: MODULE_TYPE, protocol_conf: formState })
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
      Object.assign(formState, res.protocol_conf)
    })
    .finally(() => {
      loading.value = false
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
