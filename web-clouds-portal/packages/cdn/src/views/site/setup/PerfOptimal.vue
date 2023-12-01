<template>
  <a-spin :loading="loading" class="w-full">
    <vc-card
      title="页面优化"
      description="去除HTML页面冗余内容如注释以及重复的空白符，若源站文件自身有md5值校验机制，请勿开启此功能。"
    >
      <a-checkbox
        v-model="formState.speed_optimization.enable_css_auto_minify"
        @change="(v)=>handleCheck(v as boolean,'css')"
      >
        <template #checkbox="{ checked }">
          <div class="custom-checkbox-card" :class="{ 'is-checked': checked }">
            CSS优化
          </div>
        </template>
      </a-checkbox>
      <a-checkbox
        v-model="formState.speed_optimization.enable_js_auto_minify"
        @change="(v)=>handleCheck(v as boolean,'js')"
      >
        <template #checkbox="{ checked }">
          <div class="custom-checkbox-card" :class="{ 'is-checked': checked }">
            JavaScript优化
          </div>
        </template>
      </a-checkbox>
      <a-checkbox
        v-model="formState.speed_optimization.enable_html_auto_minify"
        @change="(v)=>handleCheck(v as boolean,'html')"
      >
        <template #checkbox="{ checked }">
          <div class="custom-checkbox-card" :class="{ 'is-checked': checked }">
            HTML优化
          </div>
        </template>
      </a-checkbox>
    </vc-card>
    <vc-card
      class="optimization-card mb-4"
      title="Gzip压缩"
      description="对静态文件进行Gzip压缩，可以降低传输数据大小，若源站文件自身有md5值校验机制，请勿开启此功能。"
    >
      <a-switch
        v-model="formState.speed_optimization.enable_gzip"
        :checked-value="1"
        :unchecked-value="2"
        default-checked
      ></a-switch>
    </vc-card>

    <a-button type="primary" :loading="loading" @click="saveConfig"
      >保存配置</a-button
    >
  </a-spin>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getCdnSiteSpeedOptimizeByIdApi,
  updateCdnSiteSpeedOptimizeByIdApi
} from '@vcp/apis/cdn'

const route = useRoute()
const siteId = route.params.id as string
const loading = ref(false)
const formState = reactive({
  speed_optimization: {
    site_id: '',
    enable_css_auto_minify: false,
    enable_html_auto_minify: false,
    enable_js_auto_minify: false,
    enable_gzip: 2
  }
})

const handleCheck = (v: boolean, key: 'css' | 'js' | 'html') => {
  formState.speed_optimization[`enable_${key}_auto_minify`] = v
}

const getConfig = () => {
  loading.value = true
  getCdnSiteSpeedOptimizeByIdApi({ site_id: siteId })
    .then(res => {
      const {
        enable_css_auto_minify,
        enable_js_auto_minify,
        enable_html_auto_minify,
        site_id,
        enable_gzip
      } = res.speed_optimization ?? {}
      formState.speed_optimization.enable_css_auto_minify =
        Number(enable_css_auto_minify) === 1 ? true : false
      formState.speed_optimization.enable_js_auto_minify =
        Number(enable_js_auto_minify) === 1 ? true : false
      formState.speed_optimization.enable_html_auto_minify =
        Number(enable_html_auto_minify) === 1 ? true : false
      formState.speed_optimization.site_id = site_id ?? ''
      formState.speed_optimization.enable_gzip = Number(enable_gzip) ?? 1
    })
    .finally(() => {
      loading.value = false
    })
}

const saveConfig = () => {
  loading.value = true
  const speed_optimization = {
    enable_css_auto_minify: formState.speed_optimization.enable_css_auto_minify
      ? 1
      : 2,
    enable_js_auto_minify: formState.speed_optimization.enable_js_auto_minify
      ? 1
      : 2,
    enable_html_auto_minify: formState.speed_optimization
      .enable_html_auto_minify
      ? 1
      : 2,
    site_id: siteId,
    enable_gzip: formState.speed_optimization.enable_gzip
  }
  const data = {
    speed_optimization,
    site_id: siteId
  }
  updateCdnSiteSpeedOptimizeByIdApi(data)
    .then(() => {
      Message.success('保存成功')
      getConfig()
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getConfig()
})
</script>

<style lang="less" scoped>
.optimization-card {
  border-radius: 6px;
  overflow: hidden;
  :deep(.arco-card-header) {
    height: auto !important;
    padding-top: 16px !important;
    border: none;
  }
  :deep(.arco-card-body) {
    padding-top: 6px !important;
  }
}

.custom-checkbox-card {
  border-radius: 6px;
  border: 1px solid var(--color-border-2);
  @apply h-7 w-128px flex items-center justify-center text-sm font-normal;
  transition: all 0.2s;
  &.is-checked {
    color: rgb(var(--primary-6));
    border-color: rgb(var(--primary-6));
    background-color: rgb(var(--primary-1));
  }
}
</style>
