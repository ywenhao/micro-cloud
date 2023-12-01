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
    <a-form :model="formState" layout="vertical">
      <a-form-item asterisk-position="end" label="证书内容" field="certificate">
        <template #label>
          <div class="flex flex-row justify-between items-center">
            <span class="flex-1">证书内容</span>
            <div
              class="flex flex-row gap-x-1 cursor-pointer"
              @click="copy(formState.certificate)"
            >
              <vc-svg-icon
                name="copy"
                prefix="cdn"
                class="mt-1 text-[#2253E6]"
              ></vc-svg-icon>
              <span class="text-[#2253E6]">复制</span>
            </div>
          </div>
        </template>
        <a-textarea
          v-model="formState.certificate"
          :placeholder="`证书格式：
-----BEGIN CERTIFICATE------作为开头
------END CERTIFICATE------作为结尾
中间的内容每行64字符，最后一行长度可以不足64字符
          `"
          class="area-input"
        />
      </a-form-item>
      <a-form-item asterisk-position="end" label="证书密钥" field="private_key">
        <template #label>
          <div class="flex flex-row justify-between items-center">
            <span class="flex-1">证书密钥</span>
            <div
              class="flex flex-row gap-x-1 cursor-pointer"
              @click="copy(formState.private_key)"
            >
              <vc-svg-icon
                name="copy"
                prefix="cdn"
                class="mt-1 text-[#2253E6]"
              ></vc-svg-icon>
              <span class="text-[#2253E6]">复制</span>
            </div>
          </div>
        </template>
        <a-textarea
          v-model="formState.private_key"
          :placeholder="`密钥格式：
- - - - - BEGIN RSA PRIVATE 密钥 - - - - - 或 - - - - - BEGIN EC PRIVATE 密钥 - - - - - 作为开头
- - - - - END RSA PRIVATE 密钥 - - - - - 或- - - - - END EC PRIVATE 密钥 - - - - - 作为结尾
中间的内容每行64字符，最后一行长度可以不足64字符`"
          class="area-input"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script lang="ts" setup>
import { getSitesCertificatesByIdApi } from '@vca/apis/cdn'
import { useClipboard } from 'vc-material/hooks/index'

interface IProps {
  visible: boolean
  id: string
  siteId: string
}
const props = withDefaults(defineProps<IProps>(), {
  visible: false
})
const { copy } = useClipboard()

const formState = reactive({
  certificate: '',
  private_key: ''
})

const getCertificate = () => {
  const data = {
    id: props.id,
    site_id: props.siteId
  }
  getSitesCertificatesByIdApi(data).then(res => {
    const { certificate, private_key } = res
    formState.certificate = certificate ?? ''
    formState.private_key = private_key ?? ''
  })
}
const handleOpen = () => {
  getCertificate()
}
const handleCancel = () => {
  return true
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
:deep(.arco-form-item-label) {
  flex: 1;
}
</style>
