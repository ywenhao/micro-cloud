<template>
  <a-spin :loading="loading" class="w-full">
    <a-form ref="formRef" :model="formState" class="w-full">
      <vc-card
        :bordered="false"
        title="源错误页"
        description="当“源产品器错误页面”设置为“开”时，CDN将直接代理来自源产品器的502和504错误页面。"
      >
        <div class="flex items-center gap-x-1">
          <!-- <a-switch
            v-model="formState.error_page.err_from_origin"
            :checked-value="1"
            :unchecked-value="2"
          ></a-switch> 
          启用源错误页面 -->

          <a-radio-group
            v-model="formState.error_page.err_from_origin"
            default-value="1"
            :options="[
              { label: '开启源错误页面', value: 1 },
              { label: '关闭源错误页面', value: 2 }
            ]"
          >
          </a-radio-group>
        </div>
      </vc-card>
      <a-divider class="m-4!" />
      <vc-card
        :bordered="false"
        title="500类错误页"
        description="自定义发生500类错误时您的访问者将看到的错误页面"
      >
        <template #extra>
          <a-button
            type="outline"
            @click="handlePreView(radioState.page_500, 'page_500')"
            >预览效果</a-button
          >
        </template>
        <div class="flex flex-col items-start">
          <a-radio-group
            v-model="radioState.page_500"
            default-value="1"
            :options="[
              { label: '默认页面', value: 1 },
              { label: '自定义错误页', value: 2 }
            ]"
          >
          </a-radio-group>
          <a-form-item
            v-if="radioState.page_500 === 2"
            field="error_page.err_code_500"
            hide-label
            validate-trigger="input"
            :rules="pageValidate(radioState.page_500, 'page_500')"
          >
            <a-textarea
              v-model="formState.error_page.err_code_500"
              class="mt-4"
              :max-length="20000"
              :auto-size="{ minRows: 6, maxRows: 6 }"
              placeholder="内容填写显示页面的html代码"
            />
            <template #extra>
              自定义 500
              类错误页面需要::HTTP_ERROR_500S_BOX::令牌，并嵌入HTML代码，代码大小不超过2MB，此令牌可确保诊断信息显示在您的自定义错误页面中，这样可以快速识别问题。
            </template>
          </a-form-item>
        </div>
      </vc-card>
      <a-divider class="m-4!" />
      <vc-card
        :bordered="false"
        class="mb-4"
        title="WAF阻止"
        description="自定义当访问者触发Web应用程序防火墙规则时向他们显示的错误页面。"
      >
        <template #extra>
          <a-button
            type="outline"
            @click="handlePreView(radioState.page_waf, 'page_waf')"
            >预览效果</a-button
          >
        </template>
        <div class="flex flex-col items-start">
          <a-radio-group
            v-model="radioState.page_waf"
            default-value="1"
            :options="[
              { label: '默认页面', value: 1 },
              { label: '自定义错误页', value: 2 }
            ]"
          >
          </a-radio-group>
          <a-form-item
            v-if="radioState.page_waf === 2"
            field="error_page.reject_waf"
            validate-trigger="input"
            hide-label
            :rules="pageValidate(radioState.page_waf, 'page_waf')"
          >
            <a-textarea
              v-model="formState.error_page.reject_waf"
              class="mt-4"
              :max-length="20000"
              :auto-size="{ minRows: 6, maxRows: 6 }"
              placeholder="内容填写显示页面的html代码"
            />
            <template #extra> 代码大小不超过2MB </template>
          </a-form-item>
        </div>
      </vc-card>
    </a-form>

    <a-button type="primary" :loading="loading" @click="saveConfig"
      >保存配置</a-button
    >
  </a-spin>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  getCdnGlobalBootstrapDetailApi,
  getCdnSiteErrorPageByIdApi,
  updateCdnSiteErrorPageByIdApi
} from '@vca/apis/cdn'
interface DefaultPage {
  err_code_500?: string
  reject_since_ip_location?: string
  reject_waf?: string
}
const route = useRoute()
const siteId = route.params.id as string
const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive({
  error_page: {
    site_id: '',
    err_from_origin: 2,
    err_code_500: '',
    reject_since_ip_location: '',
    reject_waf: ''
  }
})
const pageValidate = computed(() => (isDefault: number, symbol: string) => {
  const map: Record<string, FieldRule> = {
    page_500:
      isDefault === 1
        ? {}
        : {
            required: true,
            validator: (value: string, callback: (error?: string) => void) => {
              if (!value) {
                callback('请填入内容')
                return
              }
              if (!value.includes('::HTTP_ERROR_500S_BOX::')) {
                callback('缺少::HTTP_ERROR_500S_BOX::令牌')
                return
              }
            }
          },
    page_waf: isDefault === 1 ? {} : { required: true, message: '请填入内容' }
  }
  return map[symbol]
})
const radioState = reactive({
  page_500: 1,
  page_waf: 1
})
const defaultPage = ref<DefaultPage>({
  err_code_500: '',
  reject_since_ip_location: '',
  reject_waf: ''
})

const getBootstrapData = () => {
  loading.value = true
  getCdnGlobalBootstrapDetailApi()
    .then(res => {
      const { custom_page_default } = res
      defaultPage.value = custom_page_default ?? {}
    })
    .finally(() => (loading.value = false))
}
const getConfig = () => {
  loading.value = true
  getCdnSiteErrorPageByIdApi({ site_id: siteId })
    .then(res => {
      formState.error_page = { ...res.error_page, site_id: siteId } ?? {}
      initRadio()
    })
    .finally(() => {
      loading.value = false
    })
}

const initRadio = () => {
  if (
    formState.error_page.err_code_500 != undefined &&
    formState.error_page.err_code_500.length > 0
  ) {
    radioState.page_500 = 2
  }

  if (
    formState.error_page.reject_waf != undefined &&
    formState.error_page.reject_waf.length > 0
  ) {
    radioState.page_waf = 2
  }
}

// 预览效果
const handlePreView = (isDefault: number, symbol: string) => {
  const newWin: any = window.open('', '', '')
  newWin.opener = null // 防止代码对论谈页面修改
  const map: Record<string, () => void> = {
    page_500: () => {
      if (isDefault === 1) {
        newWin.document.write(defaultPage.value?.err_code_500 || '')
      } else {
        newWin.document.write(formState.error_page.err_code_500 || '')
      }
    },
    page_waf: () => {
      if (isDefault === 1) {
        newWin.document.write(defaultPage.value?.reject_waf || '')
      } else {
        newWin.document.write(formState.error_page.reject_waf || '')
      }
    }
  }
  map[symbol]()
}

const saveConfig = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return
  loading.value = true
  if (radioState.page_500 === 1) {
    formState.error_page.err_code_500 = ''
  }
  if (radioState.page_waf === 1) {
    formState.error_page.reject_waf = ''
  }
  const data = {
    site_id: siteId,
    error_page: formState.error_page
  }

  // @ts-ignore
  updateCdnSiteErrorPageByIdApi(data)
    .then(() => {
      Message.success('保存成功')
      getConfig()
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getBootstrapData()
  getConfig()
})
</script>

<style lang="less"></style>
