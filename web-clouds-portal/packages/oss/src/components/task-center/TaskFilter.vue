<template>
  <div class="mt-2 flex items-center justify-between">
    <div class="flex gap-x-2">
      <a-button
        type="primary"
        @click="emit('all-stop')"
        :disabled="allStopDisabled"
        >全部停止</a-button
      >
      <a-button
        type="outline"
        :disabled="allRetryDisabled"
        @click="emit('all-retry')"
        >全部重试</a-button
      >
      <a-radio-group v-model="status" type="button" class="p-0!">
        <a-radio value="">全部</a-radio>
        <a-radio value="ready">待处理</a-radio>
        <a-radio value="doing">处理中</a-radio>
        <a-radio value="cancel">已停止</a-radio>
        <a-radio value="success">成功</a-radio>
        <a-radio value="error">失败</a-radio>
      </a-radio-group>
    </div>
    <a-button
      :disabled="cleanDisabled"
      type="outline"
      class="w-8 h-8 p-0!"
      @click="emit('clean')"
    >
      <vc-svg-icon
        name="icon_clean"
        prefix="oss"
        :class="cleanDisabled && 'opacity-50'"
      ></vc-svg-icon>
    </a-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  allStopDisabled: boolean
  allRetryDisabled: boolean
  cleanDisabled: boolean
}>()

const status = defineModel<string>('status', { required: true })

const emit = defineEmits<{
  (event: 'all-retry'): void
  (event: 'clean'): void
  (event: 'all-stop'): void
}>()
</script>
