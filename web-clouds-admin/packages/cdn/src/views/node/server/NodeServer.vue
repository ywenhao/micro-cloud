<template>
  <vca-card :bordered="false" title="服务配置">
    <div class="server-card">
      <vc-svg-icon prefix="cdn" name="secure_sever" :size="32" />
      <div class="ml-4">
        <header class="text-ct-1 text-base font-medium">安全服务</header>
        <p class="text-ct-3 mt-2 mb-4">
          关闭后停用安全相关服务，包括“WAF防护”，“防盗链”功能，请谨慎操作。
        </p>
        <a-switch
          :loading="loading"
          :before-change="(v: SwitchValue) =>  handelChangeState(v as number, 'secure')"
          :checked-value="1"
          :unchecked-value="2"
          v-model="state.security_service"
        />
      </div>
    </div>

    <div class="server-card">
      <vc-svg-icon prefix="cdn" name="speed_limit_server" :size="32" />
      <div class="ml-4">
        <header class="text-ct-1 text-base font-medium">限速服务</header>
        <p class="text-ct-3 mt-2 mb-4">关闭后停用限速服务，请谨慎操作。</p>
        <a-switch
          :loading="loading"
          :checked-value="1"
          :unchecked-value="2"
          v-model="state.rate_limit_service"
          :before-change="(v: SwitchValue) =>  handelChangeState(v as number, 'speed_limit')"
        />
      </div>
    </div>
  </vca-card>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getCdnnodeSystemServiceSwitchApi,
  updateCdnnodeSystemServiceSwitchApi
} from '@vca/apis/cdn'
import { VcModal } from 'vc-material'

const loading = ref(false)
const state = reactive({
  security_service: 2,
  rate_limit_service: 2
})
const handelChangeState = async (v: number, item: 'secure' | 'speed_limit') => {
  return new Promise<boolean>((resolve, reject) => {
    const data = { ...state }
    if (item === 'secure') {
      data.security_service = v
    }
    if (item === 'speed_limit') {
      data.rate_limit_service = v
    }
    const request = () =>
      updateCdnnodeSystemServiceSwitchApi(data as any)
        .then(() => {
          Message.success(v === 2 ? '关闭成功' : '开启成功')
          resolve(true)
        })
        .catch(() => reject(false))
    if (v == 2) {
      console.log(v, item)
      const message =
        item === 'secure'
          ? '关闭后。将停用安全相关服务，包括“WAF防护”，“防盗链”功能。'
          : '关闭后，将停用限速服务。'

      VcModal.error(
        {
          title: '是否关闭服务？',
          content: message,
          onCancel() {
            reject()
          }
        },
        request
      )
    } else {
      request()
    }
  })
}

const getSystemService = () => {
  loading.value = true
  getCdnnodeSystemServiceSwitchApi()
    .then(res => {
      state.rate_limit_service = Number(res.rate_limit_service || 2)
      state.security_service = Number(res.security_service || 2)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(getSystemService)
</script>

<style lang="less" scoped>
.server-card {
  @apply border-px border-solid border-color-1 bg-fill-1 flex items-start p-4;
  & + .server-card {
    @apply mt-4;
  }
}
</style>
