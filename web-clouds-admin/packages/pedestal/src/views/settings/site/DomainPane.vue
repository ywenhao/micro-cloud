<template>
  <a-spin :loading="loading" class="flex! flex-col w-full flex-1">
    <a-list class="border-color-1">
      <a-list-item class="bg-fill-2 border-color-1!">
        <div class="text-base text-ct-1 font-medium">域名信息</div>
        <span class="text-sm text-ct-3">
          以下域名根据程序部署时填写的主域名自动生成，如需修改，请在API服务所在的机器修改Nginx配置和API服务配置。
        </span>
      </a-list-item>
      <a-list-item class="border-color-1!">
        <div>官网域名</div>
        <span class="text-sm text-ct-3">
          {{ formState.master_domain }}
        </span>
      </a-list-item>
      <a-list-item class="border-color-1!">
        <div>控制台域名</div>
        <span class="text-sm text-ct-3">
          {{ formState.portal_domain }}
        </span>
      </a-list-item>
      <a-list-item class="border-color-1!">
        <div>登录域名</div>
        <span class="text-sm text-ct-3">
          {{ formState.sso_domain }}
        </span>
      </a-list-item>
      <a-list-item class="border-color-1!">
        <div>API接口域名</div>
        <span class="text-sm text-ct-3">
          {{ formState.api_domain }}
        </span>
      </a-list-item>
      <a-list-item class="border-color-1!">
        <div>开放接口域名</div>
        <span class="text-sm text-ct-3">
          {{ formState.openapi_domain }}
        </span>
      </a-list-item>
      <a-list-item class="border-color-1!">
        <div>资源域名</div>
        <div class="text-sm text-ct-3">
          用于存储云平台配置的icon、文档中心图片资源文件的域名。
        </div>
        <span class="text-sm text-ct-3">
          {{ formState.static_domain }}
        </span>
      </a-list-item>
    </a-list>
  </a-spin>
</template>

<script setup lang="ts">
import { confApi } from '@vca/apis/pedestal'
const MODULE_TYPE = 7
const loading = ref(false)
const formState = reactive({
  master_domain: '',
  portal_domain: '',
  admin_domain: '',
  api_domain: '',
  openapi_domain: '',
  static_domain: '',
  sso_domain: ''
})

const getConfigInfo = () => {
  loading.value = true
  confApi({ type: MODULE_TYPE })
    .then(res => {
      Object.assign(formState, res.domain_conf)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getConfigInfo()
})
</script>
