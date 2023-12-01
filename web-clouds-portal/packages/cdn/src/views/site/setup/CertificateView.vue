`
<template>
  <vc-card
    title="SSL/TLS证书"
    description="SSL/TLS证书用于加密客户端与节点的通信"
    class="certificate-info"
  >
    <template #extra>
      <a-button type="primary" class="z-2" @click="openDialog">
        添加证书
      </a-button>
    </template>
    <a-descriptions v-if="formState.cert_type" :column="3">
      <a-descriptions-item label="证书状态">
        <a-badge
          :status="certStatus(formState.status).status"
          :text="certStatus(formState.status).label"
        />
      </a-descriptions-item>
      <a-descriptions-item label="域名">
        {{ formState.domain?.split(',').filter(Boolean).join('，') }}
      </a-descriptions-item>
      <a-descriptions-item label="到期日期">
        <span v-uts="formState.expire_at"></span>
      </a-descriptions-item>
      <a-descriptions-item label="证书有效期">
        {{ formState.valid_day }}天
      </a-descriptions-item>
      <a-descriptions-item label="证书来源">SSL 证书服务</a-descriptions-item>
      <a-descriptions-item label="证书品牌">{{
        formState.brand === '1' ? 'ZeroSSL' : 'Let’s Encrypt'
      }}</a-descriptions-item>
    </a-descriptions>
    <vc-svg-icon
      prefix="cdn"
      name="certificate_info"
      class="w-[259px] h-[158px] absolute right-0 top-0"
    ></vc-svg-icon>
    <add-certificate
      v-model:visible="uploadState.visible"
      @update-info="getCertificate"
    ></add-certificate>
  </vc-card>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getSitesCertificatesEdgesByIdApi,
  getSitesCertificatesOriginsListByIdApi,
  ResultEnum
} from '@vcp/apis/cdn'
import type { CertificateInfo } from '@vcp/apis/src/cdn/model'
import { useListRequest } from 'vc-material'

// import { sortableSettings } from 'vc-material'
import AddCertificate from './components/AddCertificate.vue'
// import CertificateContent from './components/CertificateContent.vue'

const route = useRoute()
const site_id = route.params.id as string
const state = reactive({
  site_id: site_id
})
const formState = ref<CertificateInfo>({
  site_id: '',
  cert_type: undefined,
  source: 0,
  domain: '',
  brand: '1',
  expire_at: '',
  valid_day: '',
  api_id: '',
  select_id: '',
  id: ''
})

const { run: getTableList } = useListRequest(
  getSitesCertificatesOriginsListByIdApi,
  state
)

const uploadState = reactive({
  visible: false
})
const getCertificate = () => {
  getSitesCertificatesEdgesByIdApi({ site_id })
    .then(res => {
      // @ts-ignore
      if (res.code == ResultEnum.SUCCESS) {
        formState.value = res.data
        // @ts-ignore
      } else if (res.code !== ResultEnum.CERTNOEXIST) {
        // @ts-ignore
        Message.error(res.message)
      }
    })
    .finally(() => {})
}
const openDialog = () => {
  uploadState.visible = true
}

const certStatus = computed(() => (v?: string) => {
  const map: Record<string, any> = {
    '0': { label: '未知', status: 'normal' },
    '1': { label: '正常', status: 'success' },
    '2': { label: '即将过期', status: 'warning' },
    '3': { label: '过期', status: 'danger' }
  }
  if (v) {
    return map[v]
  }
  return map[0]
})
onMounted(() => {
  getTableList()
  getCertificate()
})
</script>

<style scoped lang="less">
.certificate-info {
  background-color: #f3f7ff !important;
}
:deep(.arco-card-header) {
  border: none;
}
.ssl-cert,
.source-cert {
  overflow: hidden;
  border-radius: 6px;
}
.ssl-cert {
  position: relative;
  height: 148px;
  background: #f3f7ff url('@/assets/images/create-cert-bg.png') no-repeat right !important;
  background-size: 148px auto;
  :deep(.arco-card-header) {
    padding-top: 16px !important;
    height: auto !important;
    border: none;
  }
  :deep(.arco-descriptions-item-label) {
    color: var(--color-text-3);
    @apply font-normal !important;
  }
}
</style>
`
