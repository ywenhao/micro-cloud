<template>
  <a-drawer
    v-model:visible="modelValue"
    title="公告详情"
    class="is-admin"
    :width="600"
    :footer="false"
  >
    <a-spin :loading="loading" class="w-full">
      <h1 class="mb-4 break-all mt-0">{{ record?.title }}</h1>
      <div class="divide flex items-center text-[var(--color-text-3)] mb-6">
        <span>{{ record?.create_account || '-' }}</span>
        <a-divider :margin="8" direction="vertical" />
        <span>
          <span v-uts="record?.created_at"></span>
          创建
        </span>
        <a-divider :margin="8" direction="vertical" />
        <span>{{ record?.alert_type === 1 ? '仅弹窗一次' : '每次弹窗' }}</span>
        <a-divider :margin="8" direction="vertical" />
        <span class="flex items-center">
          <vc-svg-icon name="eye" class="mr-1"></vc-svg-icon>
          {{ record?.status === 1 ? '已启用' : '已禁用' }}
        </span>
        <a-divider :margin="8" direction="vertical" />
        <span class="flex items-center">
          <vc-svg-icon name="eye" class="mr-1"></vc-svg-icon>
          {{ record?.read_count }}
        </span>
      </div>
      <div class="whitespace-pre-wrap break-all">
        {{ record?.content || '-' }}
      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { VcSvgIcon } from 'vc-material'

const modelValue = defineModel()
const record = defineModel('record', { default: undefined })
const loading = defineModel<boolean>('loading', { default: false })
</script>
