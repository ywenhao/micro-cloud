<template>
  <a-spin :loading="loading" class="w-full">
    <vc-card :bordered="false">
      <template #title>
        <span>True-Client-IP标头</span>
        <a-popover position="right" content-class="py-3!">
          <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
          <template #content>
            <a-descriptions
              :column="1"
              size="mini"
              :data="descriptions"
              bordered
            />
          </template>
        </a-popover>
      </template>
      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-radio-group
          v-model="formState.true_client_ip_mode"
          :options="options"
        ></a-radio-group>
        <a-form-item
          class="pt-4"
          v-if="formState.true_client_ip_mode === 4"
          label="字段值"
          field="true_client_ip_value"
          validate-trigger="input"
          :rules="{
            required: formState.true_client_ip_mode === 4,
            message: '请输入内容'
          }"
          asterisk-position="end"
        >
          <a-textarea
            class="max-w-594px"
            v-model="formState.true_client_ip_value"
            show-word-limit
            :max-length="128"
            placeholder="请输入"
            :auto-size="{ minRows: 6, maxRows: 6 }"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </vc-card>
    <a-divider class="my-4!" />
    <vc-card :bordered="false" title="HTTP版本" class="mb-4">
      <a-alert type="success" show-icon>
        <span class="is-success">支持HTTP/2</span>
        <span class="text-ct-2 text-xs pl-6">
          HTTP2.0协议是HTTP1.1协议的升级版本，在Web数据交互性能上具备更多的优势，需要配置HTTPS证书
        </span>
      </a-alert>
    </vc-card>
    <a-button type="primary" :loading="loading" @click="saveConfig"
      >保存配置</a-button
    >
  </a-spin>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { IconQuestionCircleFill } from '@arco-design/web-vue/es/icon'
import {
  getCdnSiteNetworkConfigByIdApi,
  updateCdnSiteNetworkConfigByIdApi
} from '@vca/apis/cdn'

const route = useRoute()
const siteId = route.params.id as string
const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive({
  site_id: '',
  true_client_ip_mode: 1,
  true_client_ip_value: '',
  enable_http_2: 0,
  follow_origin: 0
})
/**
 * 标准模式(默认)
 * 随机模式
 * 透明代理模式
 * 禁用模式
 * 固定字段值模式
 **/
const options = [
  { label: '标准模式(默认)', value: 1, description: '添加遵守HTTP标准的标头' },
  {
    label: '随机模式',
    value: 2,
    description: '客户端和CDN代理的IP地址都是随机值'
  },
  {
    label: '透明代理模式',
    value: 3,
    description:
      '只带客户端IP或者保留原已存在的X-Forwarded-For头，\n不再添加CDN的IP地址。'
  },
  { label: '禁用模式', value: 5, description: '不携带该IP标头' },
  { label: '固定字段值模式', value: 4, description: '根据配置项填写字段值' }
]

const descriptions = options.map(({ label, description }) => ({
  label,
  value: description
}))

const getConfig = () => {
  loading.value = true

  getCdnSiteNetworkConfigByIdApi({ site_id: siteId })
    .then(res => {
      const {
        true_client_ip_mode,
        true_client_ip_value,
        enable_http_2,
        follow_origin,
        site_id
      } = res.network_config ?? {}
      formState.true_client_ip_mode = Number(true_client_ip_mode) ?? 1
      formState.enable_http_2 = Number(enable_http_2) ?? 1
      formState.follow_origin = Number(follow_origin) ?? 1
      formState.true_client_ip_value = true_client_ip_value ?? ''
      formState.site_id = site_id ?? ''
    })
    .finally(() => {
      loading.value = false
    })
}

const saveConfig = () => {
  formRef.value?.validate(valid => {
    if (!valid) {
      loading.value = true
      const network_config = {
        ...formState
      }
      const data = { network_config, site_id: siteId }
      //@ts-ignore
      updateCdnSiteNetworkConfigByIdApi(data)
        .then(() => {
          Message.success('保存成功')
          getConfig()
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
onMounted(() => {
  getConfig()
})
</script>
