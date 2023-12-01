<template>
  <a-drawer
    :width="600"
    title="上传自有证书"
    :mask-closable="false"
    :visible="visible"
    unmountOnClose
    destroy-on-close
    class="vc-drawer"
    @beforeOpen="handleOpen"
    @beforeCancel="handleCancel"
  >
    <div
      class="flex flex-row gap-x-2 w-full text-sm px-4 py-[6px] rounded-[6px] bg-waring-1 mb-6"
    >
      <vc-svg-icon prefix="ssl" name="warning" :size="20"></vc-svg-icon>
      <span class="text-ct-1">
        请上传有效期不小于 30 天的证书，目前只支持 PEM 格式。
      </span>
    </div>
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item asterisk-position="end" label="证书备注名" field="desc">
        <a-input
          v-model.trim="formState.desc"
          :max-length="20"
          show-word-limit
          placeholder="请输入证书备注名"
        ></a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        label="证书内容（PEM格式）"
        field="certificate"
      >
        <a-textarea
          v-model="formState.certificate"
          placeholder="证书格式以“----BEGIN CERTIFICATE-----”开头，以“-----END CERTIFICATE-----”结尾。"
          class="area-input"
        />
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        label="证书内容（PEM格式）"
        field="private_key"
      >
        <a-textarea
          v-model="formState.private_key"
          placeholder='私钥格式以“----BEGIN(RSA|EC) PRIVATE KEY--"开头，以--END(RSA|EC) PRIVATE KEY----”结尾。'
          class="area-input"
        />
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
import { type FormInstance, Message } from '@arco-design/web-vue'
import { uploadLicenseApi } from '@vca/apis/src/ssl'

import { userDataKey } from '@/config/provideKeys'

interface IProps {
  visible: boolean
}
interface IEmits {
  (event: 'update:visible', value: boolean): void
  (event: 'update'): void
}
withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<IEmits>()
const loading = ref<boolean>(false)
const formRef = ref<FormInstance>()
const userDate = inject(userDataKey)

const formState = reactive({
  certificate: '',
  private_key: '',
  desc: ''
})
const rules = {
  certificate: [{ required: true, message: '请输入证书内容' }],
  private_key: [{ required: true, message: '请输入证书私钥' }],
  desc: [{ required: true, message: '请输入证书备注名' }]
}

const handleOpen = () => {}
const handleCancel = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)

  return true
}
const handleUpload = () => {
  const data = {
    ...formState,
    user_id: userDate?.adminInfo?.id ?? ''
  }
  formRef.value?.validate(valid => {
    if (!valid) {
      loading.value = true
      uploadLicenseApi(data)
        .then(() => {
          formRef.value?.resetFields()
          handleCancel()
          Message.success('上传成功')
          emit('update')
        })
        .finally(() => {
          loading.value = false
        })
    }
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
}
</style>
