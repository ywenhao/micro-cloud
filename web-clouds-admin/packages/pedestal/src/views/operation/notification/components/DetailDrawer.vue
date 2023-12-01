<template>
  <a-drawer
    v-model:visible="modelValue"
    title="消息详情"
    :footer="false"
    class="is-admin"
    :width="600"
    @open="handleDrawerOpen"
    @before-close="handleBeforeClose"
  >
    <a-spin :loading="loading" class="min-h-xl w-full">
      <h1 class="break-all mt-0 mb-4">{{ state?.title || '-' }}</h1>
      <div class="flex items-center text-[var(--color-text-3)] mb-8">
        <span>{{ record?.create_account || '-' }}</span>
        <a-divider :margin="8" direction="vertical" />
        <span>
          <span v-uts="record?.release_time"></span>
          发布
        </span>
        <a-divider :margin="8" direction="vertical" />
        <span>{{ record?.type_name }}</span>
        <a-divider :margin="8" direction="vertical" />
        <span class="flex items-center">
          <vc-svg-icon name="eye"></vc-svg-icon>
          {{ record?.read_count }}
        </span>
      </div>
      <!-- <div v-html="state?.content || '-'"></div> -->
      <vc-rich-text-editor
        :toolbar-visible="false"
        :model-value="state?.content"
        preview
        readonly
        height="300px"
      ></vc-rich-text-editor>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { messageInfoApi, type MessageModel } from '@vca/apis/pedestal'

const loading = ref(true)
const modelValue = defineModel()
const state = ref<MessageModel>()
const record = defineModel<MessageModel>('record', { default: undefined })
const handleDrawerOpen = () => {
  loading.value = true
  messageInfoApi({ message_id: record.value.id! })
    .then(res => {
      state.value = res as MessageModel
    })
    .finally(() => {
      loading.value = false
    })
}

const handleBeforeClose = () => {
  state.value = undefined
  loading.value = true
}
</script>
