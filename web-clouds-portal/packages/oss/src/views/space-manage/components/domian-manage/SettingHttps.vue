<template>
  <a-modal
    :width="480"
    modal-class="vc-modal message-box"
    title-align="start"
    cancel-text="取消"
    :hideCancel="false"
    :simple="false"
    :cancelButtonProps="{ type: 'outline' }"
    ok-text="确定"
    @before-open="handleDrawerOpen"
    :ok-loading="loading"
    v-model:visible="visible"
    title="配置HTTPS"
    @before-close="handleBeforeClose"
    @before-ok="handleBeforeOk"
    :ok-button-props="{ disabled: disabledBtn }"
  >
    <a-alert class="mb-5">
      <template #icon> <icon-info-circle-fill /> </template>
      更新域名 HTTPS 配置后，约需 10 分钟生效
    </a-alert>
    <a-form ref="formRef" :model="form" layout="vertical">
      <a-form-item class="http-switch-item mb-5!">
        <span>HTTPS开关</span>
        <a-switch
          v-model="form.http"
          @change="handleChange"
          class="vc-switch ml-2!"
        />
      </a-form-item>
      <a-form-item v-if="form.http" class="mb-0!" label="证书">
        <a-select
          v-model="form.ssl_id"
          :options="optionsList"
          :field-names="fieldNames"
          placeholder="请选择证书"
        >
        </a-select>
        <template #extra>
          点击
          <a-link
            :hoverable="false"
            type="primary"
            @click="handleSslManage"
            class="text-xs!"
          >
            SSL 证书管理
          </a-link>
          查看托管证书详情或申请<a-link
            :hoverable="false"
            @click="handleSslManage"
            type="primary"
            class="text-xs! ml-0!"
          >
            上传新 SSL 证书
          </a-link>
        </template>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { IconInfoCircleFill } from '@arco-design/web-vue/es/icon'
import { settingHttpsApi, spaceSslListApi } from '@vcp/apis/oss'
import type { MicroAppData } from '@vcp/shared'

const record = defineModel<any>('record')

const props = withDefaults(defineProps<{ user_id: string }>(), {
  user_id: ''
})

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const visible = defineModel<boolean>()
const formRef = ref<FormInstance>()
const loading = ref<boolean>(false)
const form = ref({
  http: false,
  ssl_id: undefined
})

const fieldNames = { value: 'id', label: 'domain' }

const disabledBtn = computed(() => form.value.http && !form.value.ssl_id)

const optionsList = ref<any>([])

const handleChange = () => {
  form.value.ssl_id = undefined
}

const handleSslManage = () => {
  const getData = () => (window.microApp?.getData() || {}) as MicroAppData
  const { href } = getData().pedestalRouter.resolve({
    name: 'MicroView',
    params: { app: 'ssl' }
  })
  window.open(window.location.origin + href, '_blank')
}

const handleBeforeClose = () => {
  visible.value = false
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    const { http, ssl_id } = form.value
    loading.value = true
    settingHttpsApi({
      id: record.value?.id,
      ssl_id: http ? (ssl_id as unknown as string) : String(0)
    })
      .then(() => {
        Message.success('操作成功')
        emit('reload')
        resolve(true)
      })
      .catch(() => reject())
      .finally(() => {
        loading.value = false
      })
  })
}

/**获取证书列表 */
const getSslList = () => {
  spaceSslListApi({
    user_id: props.user_id,
    domain_id: record.value?.id
  }).then(res => {
    optionsList.value = res.list
  })
}

const handleBeforeOk = (done: (closed: boolean) => void) => {
  formRef.value
    ?.validate()
    .then(res => {
      if (!res) {
        return handleEditorSubmit()
      }
      done(false)
    })
    .then(() => done(true))
    .catch(() => done(false))
}

const handleDrawerOpen = () => {
  getSslList()
  form.value.http = record.value?.ssl_status !== 1
  form.value.ssl_id =
    record.value?.ssl_id === '0' ? undefined : record.value?.ssl_id
}
</script>

<style scoped lang="less">
:deep(.http-switch-item) {
  .arco-form-item-label-col {
    @apply mb-0!;
  }
}
</style>
