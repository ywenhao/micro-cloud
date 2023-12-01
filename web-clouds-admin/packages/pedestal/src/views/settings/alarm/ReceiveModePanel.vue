<script setup lang="ts">
import type { FormInstance } from '@arco-design/web-vue'
import type { AlarmConfigEmail, AlarmConfigTG } from '@vca/apis/pedestal'
const telegramConfig = defineModel<AlarmConfigTG>('telegram', {
  required: true
})
const emailConfig = defineModel<AlarmConfigEmail>('email', { required: true })
const telegramRef = ref<FormInstance>()
const emailRef = ref<FormInstance>()
const rules: Rules = {
  frequency: [
    {
      required: true,
      type: 'number',
      min: 1,
      max: 43200,
      message: '请正确输入告警频率(1-43200)'
    }
  ]
}
defineExpose({
  clearValidate() {
    telegramRef.value?.clearValidate()
    emailRef.value?.clearValidate()
  },
  async validate() {
    telegramRef.value?.validate()
    const res = [
      await telegramRef.value?.validate(),
      await emailRef.value?.validate()
    ].every(item => !item)
    if (!res) {
      telegramRef?.value?.$el?.scrollIntoView({
        behavior: 'smooth'
      })
    }
    return res
  }
})
</script>
<template>
  <vc-card
    title="告警通知接收方式"
    description="配置Telegram或邮箱接收告警消息。"
  >
    <a-form
      ref="telegramRef"
      class="max-w-378px"
      :rules="rules"
      :model="telegramConfig"
      layout="vertical"
    >
      <a-form-item label="Telegram" help="一行一个，最多可设置5个">
        <a-textarea
          v-model="telegramConfig.id"
          placeholder="请输入接收告警的Telegram ID"
        />
      </a-form-item>

      <a-form-item
        field="frequency"
        validate-trigger="input"
        hide-asterisk
        label="告警频率"
      >
        <a-input-number
          model-event="input"
          :default-value="30"
          :model-value="Number(telegramConfig.frequency)"
          @update:model-value="v => (telegramConfig.frequency = String(v))"
          :min="1"
          :max="43200"
          :step="1"
        >
          <template #suffix>
            <a-tag color="gray" class="suffix-tag">分/次</a-tag>
          </template>
        </a-input-number>
      </a-form-item>
    </a-form>
    <a-form
      ref="emailRef"
      class="max-w-378px"
      :rules="rules"
      :model="emailConfig"
      layout="vertical"
    >
      <a-form-item label="邮箱" help="一行一个，最多可设置5个">
        <a-textarea
          v-model="emailConfig.email"
          placeholder="请输入接收告警的邮箱地址"
        />
      </a-form-item>

      <a-form-item
        field="frequency"
        validate-trigger="input"
        hide-asterisk
        label="告警频率"
      >
        <a-input-number
          :default-value="1440"
          model-event="input"
          :model-value="Number(emailConfig.frequency)"
          @update:model-value="v => (emailConfig.frequency = String(v))"
          :min="1"
          :max="43200"
          :step="1"
        >
          <template #suffix>
            <a-tag color="gray" class="suffix-tag">分/次</a-tag>
          </template>
        </a-input-number>
      </a-form-item>
    </a-form>
  </vc-card>
</template>

<style lang="less" scoped>
:deep(.arco-input-number) {
  padding-right: 0;
  height: 34px;
  .arco-input-suffix {
    .arco-select {
      max-width: 68px;
      background-color: var(--color-fill-1);
      border: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      .arco-select-view-suffix {
        padding-left: 0;
      }
    }
    .arco-input-number-step {
      position: inherit;
      height: 100%;
      border-radius: 0;
      .arco-input-number-step-button {
        border-right: 1px solid var(--color-border-2);
      }
    }
    flex-direction: row-reverse;
  }
  .suffix-tag {
    padding: 5px 12px;
    min-width: 38px;
    height: 32px;
    border-radius: 0;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}
</style>
