<template>
  <vc-container admin page-title="告警配置" header-bordered>
    <a-spin class="w-full" :loading="loading">
      <receive-mode-panel
        ref="receiveModePanelRef"
        v-model:email="config.alarm_config.email_config"
        v-model:telegram="config.alarm_config.telegram_config"
      />
      <switch-panel v-model="config.alarm_config.notification" />
      <a-divider />
      <a-button type="primary" @click="handleSubmit"> 保存配置 </a-button>
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  type AlarmConfigFormState,
  getAlarmConfigApi,
  updateAlarmConfigApi
} from '@vca/apis/pedestal'

import ReceiveModePanel from './ReceiveModePanel.vue'
import SwitchPanel from './SwitchPanel.vue'
type ReceiveModePanelInstance = InstanceType<typeof ReceiveModePanel>
const receiveModePanelRef = ref<ReceiveModePanelInstance>()
const loading = ref(false)
const config = reactive<{ id?: string; alarm_config: AlarmConfigFormState }>({
  id: '',
  alarm_config: {
    telegram_config: { id: '' },
    email_config: { email: '' },
    notification: {}
  }
})

const getConfigs = () => {
  loading.value = true
  getAlarmConfigApi()
    .then(result => {
      Object.assign(config, result)
      const { email_config, telegram_config } = result?.alarm_config || {
        email_config: { emails: [] },
        telegram_config: { ids: [] }
      }
      config.alarm_config.email_config.email =
        email_config?.emails?.join('\n') || ''

      config.alarm_config.telegram_config.id =
        telegram_config?.ids?.join('\n') || ''
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSubmit = async () => {
  const res = await receiveModePanelRef.value?.validate()
  if (res) {
    const { email_config, telegram_config } = config?.alarm_config || {
      email_config: { email: '' },
      telegram_config: { id: '' }
    }
    config.alarm_config.email_config.emails =
      email_config?.email?.split('\n') || []

    config.alarm_config.telegram_config.ids =
      telegram_config?.id?.split('\n') || []
    loading.value = true
    updateAlarmConfigApi(config)
      .then(() => {
        Message.success('保存成功')
      })
      .finally(() => {
        loading.value = false
      })
  }
}
onMounted(() => {
  getConfigs()
})
</script>

<style scoped lang="less">
:deep(.vc-card) {
  .arco-card-header {
    @apply bg-fill-2 py-4!;
  }
}
</style>
