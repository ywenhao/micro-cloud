<template>
  <a-drawer
    :width="600"
    v-model:visible="modelValue"
    unmountOnClose
    destroy-on-close
    :footer="false"
    class="vc-drawer"
    @beforeOpen="handleOpen"
    @beforeCancel="handleCancel"
  >
    <template #title>申请证书详情</template>
    <a-spin :loading="loading" class="w-full h-full">
      <a-form
        ref="formRef"
        :model="formState"
        auto-label-width
        label-align="left"
        class="detail-form"
      >
        <a-form-item label="申请ID">
          {{ formState.id || '-' }}
        </a-form-item>
        <a-form-item label="证书备注名">
          {{ formState.desc || '-' }}
        </a-form-item>
        <a-form-item label="绑定域名">
          <div class="flex flex-col items-center gap-y-1 w-full">
            <div
              v-for="(item, index) in dealDomain(formState)"
              :key="`${item}_${index}`"
              class="w-full break-words"
            >
              {{ item }}
            </div>
            <!-- <a-tooltip
              background-color="white"
              content-class="tool-content"
              position="bottom"
              content="需要在DNS控制台添加域名
并登录域名控制台修改域名的NS服务器地址"
            >
            
              <template #content>
                <div
                  v-for="(item, index) in dealDomain(formState)"
                  :key="`${item}_${index}`"
                >
                  {{ item }}
                </div>
              </template>
            </a-tooltip> -->
          </div>
        </a-form-item>
        <a-form-item label="证书品牌">
          {{ dealDisplay(brandOptions, formState?.brand) }}
        </a-form-item>
        <a-form-item label="加密算法">
          {{ dealDisplay(algorithmOptions, formState?.algorithm) }}
        </a-form-item>
        <a-form-item label="有效期"> 3个月 </a-form-item>
        <a-form-item label="域名验证方式" class="domain-verify-item">
          <div v-if="formState.is_verify === 2" class="flex flex-col w-full">
            <div class="mt-[14px] ml-4">
              {{ dealDisplay(verifyOptions, formState?.is_verify) }}
            </div>
            <verify-table :record="formState"></verify-table>
          </div>
          <span v-else class="pl-4">
            {{ dealDisplay(verifyOptions, formState?.is_verify) }}</span
          >
        </a-form-item>
        <a-form-item label="状态">
          <a-tag
            :color="dealStatusColor(formState.status!, true)"
            class="flex flex-row gap-x-1 items-center"
          >
            {{ dealDisplay(statusApplyOptions, formState?.status) }}
            <a-tooltip
              background-color="white"
              position="bottom"
              :content="formState.reason"
              content-class="tool-content"
            >
              <icon-exclamation-circle
                v-if="formState.status === 4"
                size="16"
                style="color: rgb(var(--danger-6)); cursor: pointer"
              />
            </a-tooltip>
          </a-tag>
        </a-form-item>
        <a-form-item label="申请时间">
          <span v-uts="formState?.created_at"></span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { FormInstance } from '@arco-design/web-vue'
import { IconExclamationCircle } from '@arco-design/web-vue/es/icon'
import { detailsApi } from '@vcp/apis/src/ssl'

import { VerifyTable } from '@/components/business/'
import {
  algorithmOptions,
  brandOptions,
  statusApplyOptions,
  verifyOptions
} from '@/config'
import type { ApplyListItem } from '@/types/applyList'
import { dealDisplay, dealDomain, dealStatusColor } from '@/utils/handleColumn'
const modelValue = defineModel<boolean>()
const applyId = defineModel<string>('applyId', { default: '' })
const formRef = ref<FormInstance>()
const formState = ref<ApplyListItem>({})
const loading = ref<boolean>(false)
const handleOpen = () => {
  loading.value = true
  if (applyId.value) {
    detailsApi({ id: applyId.value })
      .then(res => {
        formState.value = res
      })
      .finally(() => {
        loading.value = false
      })
  }
}
const handleCancel = (): boolean => {
  return true
}
</script>
