<template>
  <a-drawer
    :width="600"
    title="添加证书"
    :mask-closable="false"
    :visible="visible"
    unmountOnClose
    destroy-on-close
    class="vc-drawer"
    @beforeOpen="handleOpen"
    @beforeCancel="handleCancel"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item asterisk-position="end" label="证书选择" field="select_id">
        <template #extra>
          <span>
            上传自定义证书，申请免费证书，请到"<a-link
              type="primary"
              class="ssl-prod"
              @click="jumpToSsl"
              >SSL 证书</a-link
            >"产品
          </span>
        </template>
        <a-select
          @change="getCertificate"
          v-model="formState.select_id"
          placeholder="请选择"
        >
          <a-option v-for="item in certList" :key="item.id" :value="item.id">
            {{ item.domain }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item asterisk-position="end" label="证书内容" field="certificate">
        <a-spin class="w-full" :loading="contentLoading">
          <a-textarea
            readonly
            v-model="formState.certificate"
            :placeholder="`证书格式：
-----BEGIN CERTIFICATE------作为开头
------END CERTIFICATE------作为结尾
中间的内容每行64字符，最后一行长度可以不足64字符
          `"
            class="area-input"
          />
        </a-spin>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        label="证书内容（PEM格式）"
        field="private_key"
      >
        <a-spin class="w-full" :loading="contentLoading">
          <a-textarea
            readonly
            v-model="formState.private_key"
            :placeholder="`密钥格式：
- - - - - BEGIN RSA PRIVATE 密钥 - - - - - 或 - - - - - BEGIN EC PRIVATE 密钥 - - - - - 作为开头
- - - - - END RSA PRIVATE 密钥 - - - - - 或- - - - - END EC PRIVATE 密钥 - - - - - 作为结尾
中间的内容每行64字符，最后一行长度可以不足64字符`"
            class="area-input"
          />
        </a-spin>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="outline" @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleUpload"
        >确认</a-button
      >
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  getSitesCertificatesEdgeApisListByIdApi,
  getSitesCertificatesEdgesApisByIdApi,
  postSitesCertificatesEdgesByIdApi
} from '@vcp/apis/cdn'
import type { CertListItem } from '@vcp/apis/src/cdn/model'
import type { MicroAppData } from '@vcp/shared'
interface IProps {
  visible: boolean
}
interface IEmits {
  (event: 'update:visible', value: boolean): void
  (event: 'update-info'): void
}
withDefaults(defineProps<IProps>(), {})
const route = useRoute()
const site_id = route.params.id as string
const formRef = ref<FormInstance>()
const emit = defineEmits<IEmits>()
const loading = ref(false)
const certList = ref<CertListItem[]>([])
const formState = reactive({
  certificate: '',
  private_key: '',
  select_id: ''
})

const rules: Record<string, FieldRule[]> = {
  select_id: [{ required: true, message: '请选择证书' }],
  certificate: [{ required: true, message: '请输入证书内容' }],
  private_key: [{ required: true, message: '请输入证书私钥' }]
}

const getCertificateList = () => {
  getSitesCertificatesEdgeApisListByIdApi({ site_id }).then(res => {
    certList.value = res.list ?? []
  })
}

const jumpToSsl = () => {
  const getData = () => (window.microApp?.getData() || {}) as MicroAppData
  const { href } = getData().pedestalRouter.resolve({
    name: 'MicroView',
    params: { app: 'ssl' }
  })
  window.open(window.location.origin + href, '_blank')
}

const handleUpload = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return
  loading.value = true
  postSitesCertificatesEdgesByIdApi({ ...formState, site_id })
    .then(() => {
      Message.success('上传成功')
      emit('update-info')
      emit('update:visible', false)
      formRef.value?.resetFields()
    })
    .finally(() => {
      loading.value = false
    })
}

const handleOpen = () => {
  getCertificateList()
}
const handleCancel = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
  return true
}

const contentLoading = ref(false)
const getCertificate = () => {
  if (!formState.select_id) {
    formState.certificate = ''
    formState.private_key = ''
    return
  }
  contentLoading.value = true
  getSitesCertificatesEdgesApisByIdApi({
    id: formState.select_id
  })
    .then(res => {
      const { certificate, private_key } = res
      formState.certificate = certificate ?? ''
      formState.private_key = private_key ?? ''
    })
    .finally(() => {
      contentLoading.value = false
    })
}
</script>
<style lang="less" scoped>
.area-input {
  height: 160px;
  :deep(.arco-textarea) {
    height: 160px;
    resize: none;
  }
  background: var(--color-fill-1, #f7f8fa);
}
.ssl-prod {
  font-size: 12px !important;
}
</style>
