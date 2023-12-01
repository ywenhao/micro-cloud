<template>
  <a-spin :loading="loading" class="w-full">
    <div class="flex flex-col gap-y-4">
      <div class="bg-fill-1 p-4 flex mb-4">
        <vc-svg-icon prefix="cdn" name="protect" :size="32"></vc-svg-icon>
        <div class="flex items-center flex-1 pl-4">
          <div class="flex flex-col pl-3 flex-1">
            <span class="text-ct-1 font-medium text-base">防盗链保护</span>
            <div class="pr-78px text-ct-3 text-xs">
              防止网站资源被非法盗用，Referer防盗链是一种基于HTTP请求头中的Referer字段来实现访问控制的防盗链功能，可以实现对用户身份的识别和过滤，防止网站资源被非法盗用。可以设置Referer黑名单或者白名单，黑、白名单互斥，同一时间只支持其中一种方式生效。
            </div>
          </div>
          <a-switch
            v-model="formState.enable_anti_stealing_link"
            :checked-value="1"
            :unchecked-value="2"
          ></a-switch>
        </div>
      </div>
      <vc-card v-if="formState.enable_anti_stealing_link === 1">
        <a-form
          ref="formRef"
          :model="formState"
          layout="vertical"
          class="safetyChain-form"
        >
          <a-form-item label="空Referer">
            <a-radio-group
              v-model="formState.empty_referer_strategy"
              :options="[
                { label: '合法', value: 1 },
                { label: '不合法', value: 2 }
              ]"
            ></a-radio-group>
          </a-form-item>
          <a-form-item label="类型">
            <a-radio-group
              v-model="formState.domain_mode"
              :options="[
                { label: 'referer黑名单', value: 1 },
                { label: 'referer白名单', value: 2 }
              ]"
            ></a-radio-group>
          </a-form-item>
          <a-form-item field="domain_list" label="规则" :rules="domainRules">
            <a-textarea
              v-model="formState.domain_list"
              :auto-size="{ minRows: 3 }"
              placeholder="可输入多个域名，一行一个，支持泛域名"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </vc-card>
      <a-button
        type="primary"
        class="w-[88px]"
        :loading="loading"
        @click="saveConfig"
        >保存配置</a-button
      >
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  getCdnSiteAntiTheftChainByIdApi,
  updateCdnSiteAntiTheftChainByIdApi
} from '@vcp/apis/cdn'
import { domainReg } from 'vc-material'

const route = useRoute()
const siteId = route.params.id as string
const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive({
  enable_anti_stealing_link: 2,
  empty_referer_strategy: 2,
  domain_mode: 2,
  domain_list: ''
})

const getConfig = () => {
  loading.value = true
  getCdnSiteAntiTheftChainByIdApi({ site_id: siteId })
    .then(res => {
      const {
        enable_anti_stealing_link,
        empty_referer_strategy,
        domain_mode,
        domain_list
      } = res.anti_theft_chain ?? {}
      formState.enable_anti_stealing_link =
        Number(enable_anti_stealing_link) ?? 2
      formState.empty_referer_strategy = Number(empty_referer_strategy) ?? 2
      formState.domain_mode = Number(domain_mode) ?? 2
      formState.domain_list = (domain_list ?? []).join('\n')
    })
    .finally(() => {
      loading.value = false
    })
}

const saveConfig = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return
  loading.value = true
  const anti_theft_chain = {
    site_id: siteId,
    enable_anti_stealing_link: formState.enable_anti_stealing_link,
    empty_referer_strategy: formState.empty_referer_strategy,
    domain_mode: formState.domain_mode,
    domain_list: formState.domain_list.split('\n').filter(Boolean)
  }
  // @ts-ignore
  updateCdnSiteAntiTheftChainByIdApi({ anti_theft_chain, site_id: siteId })
    .then(() => {
      Message.success('保存成功')
      getConfig()
    })
    .finally(() => {
      loading.value = false
    })
}

const domainRules = computed<FieldRule>(() => {
  return formState.enable_anti_stealing_link === 1
    ? {
        required: true,
        validator: (value: any, callback: (error?: string) => void) => {
          if (!value) {
            callback('请输入域名')
            return
          }
          const domainList = value.split('\n').filter(Boolean) as string[]
          domainList.map(item => {
            if (!domainReg.test(item)) {
              callback('域名格式不正确')
            }
          })
        }
      }
    : {}
})
onMounted(() => {
  getConfig()
})
</script>

<style lang="less" scoped>
.safetyChain-form {
  width: 569px;
}
</style>
