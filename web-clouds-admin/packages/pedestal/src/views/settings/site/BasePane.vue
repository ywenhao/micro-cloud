<template>
  <a-spin :loading="loading" class="flex! flex-col w-full flex-1">
    <a-form
      class="flex-1"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @submit-success="handleSubmitSuccess"
    >
      <!-- <a-form-item
        class="mb-8!"
        asterisk-position="end"
        field="manager_name"
        label="管理端标题"
        help="展示位置：管理端登录页面、管理端浏览器标题及左上角管理端标题"
      >
        <a-input
          v-model="formState.manager_name"
          class="max-w-[400px]"
          :max-length="15"
          placeholder="请输入标题"
        ></a-input>
      </a-form-item>
      <a-form-item
        class="mb-8!"
        asterisk-position="end"
        field="manager_logo"
        validate-trigger="input"
        label="管理端Logo"
        help="Logo图片支持上传png、jpg、jpeg、svg文件，上传图片大小不能超过2MB，图片大小建议为50px*50px"
      >
        <upload-logo v-model="formState.manager_logo" size="80px"></upload-logo>
      </a-form-item> -->
      <a-form-item
        class="mb-8!"
        asterisk-position="end"
        field="client_name"
        label="平台名称"
        ref="clientLogoRef"
      >
        <template v-if="!clientLogoRef?.isError" #help>
          展示位置：<br />
          1、用户端官网、用户端登录页面、用户端浏览器标题及左上角用户端标题；<br />
          2、管理端登录页面、管理端浏览器标题及左上角管理端标题；<br />
        </template>
        <a-input
          :max-length="15"
          show-word-limit
          v-model="formState.client_name"
          class="max-w-[400px]"
          placeholder="请输入标题"
        ></a-input>
      </a-form-item>
      <a-form-item
        class="mb-8!"
        asterisk-position="end"
        field="client_logo"
        validate-trigger="input"
        label="平台Logo"
        help="Logo图片支持上传png、jpg、jpeg、svg文件，上传图片大小不能超过2MB，图片大小建议为50px*50px"
      >
        <upload-logo v-model="formState.client_logo" size="80px"></upload-logo>
      </a-form-item>

      <a-form-item
        class="mb-8!"
        asterisk-position="end"
        field="record_number"
        label="用户端备案信息"
        help="ICP备案号"
      >
        <a-input
          :max-length="50"
          show-word-limit
          v-model="formState.record_number"
          class="max-w-[400px]"
          placeholder="请输入ICP备案号"
        ></a-input>
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
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import { confApi, confUpdateApi } from '@vca/apis/pedestal'
const appStore = useAppStore()

const MODULE_TYPE = 2
const loading = ref(false)

const clientLogoRef = ref<FormItemInstance>()

const formState = reactive({
  client_logo: '',
  record_number: '',
  client_name: ''
})

const rules: Record<string, FieldRule | FieldRule[]> = {
  client_name: [{ required: true, message: '请输入平台名称' }],
  client_logo: [],
  record_number: []
}
const handleSubmitSuccess = () => {
  loading.value = true
  confUpdateApi({ conf_type: MODULE_TYPE, base_conf: formState })
    .then(() => {
      Message.success('保存成功')
      getConfigInfo()
      appStore.getConfigInfo()
    })
    .finally(() => {
      loading.value = false
    })
}

const getConfigInfo = () => {
  loading.value = true
  confApi({ type: MODULE_TYPE })
    .then(res => {
      Object.assign(formState, res.base_conf)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getConfigInfo()
})
</script>
