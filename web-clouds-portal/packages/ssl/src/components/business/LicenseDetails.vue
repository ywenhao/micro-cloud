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
    <template #title>证书详情</template>
    <a-spin :loading="loading" class="w-full h-full">
      <a-form
        ref="formRef"
        :model="formState"
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
          </div>
        </a-form-item>
        <a-form-item label="证书品牌">
          {{
            isOwn
              ? formState.own_brand
              : dealDisplay(brandOptions, formState?.brand) ?? '-'
          }}
        </a-form-item>

        <a-form-item label="加密算法">
          {{ dealDisplay(algorithmOptions, formState?.algorithm) }}
        </a-form-item>
        <a-form-item label="序列号（SN）">
          <span class="break-all" v-table-cell="formState.sn"></span>
        </a-form-item>
        <a-form-item label="证书指纹">
          <span class="break-all" v-table-cell="formState.fingerprint"></span>
        </a-form-item>
        <a-form-item label="SHA2值">
          <span class="break-all" v-table-cell="formState.sha2"></span>
        </a-form-item>
        <a-form-item label="有效期"> {{ expiresTime }} </a-form-item>
        <a-form-item label="域名验证方式">
          <span> {{ dealDisplay(verifyOptions, formState?.is_verify) }}</span>
        </a-form-item>
        <a-form-item label="状态">
          <a-tag
            :color="dealStatusColor(formState.status!, false)"
            class="flex flex-row gap-x-1 items-center"
          >
            {{ dealDisplay(statusOwnedOptions, formState?.status) }}
          </a-tag>
        </a-form-item>
        <a-form-item label="签发时间">
          <span v-uts="formState?.issued_date"></span>
        </a-form-item>
        <a-form-item label="到期时间">
          <span v-uts="formState?.expiration_time"></span>
          <span>{{ restTime }}</span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { FormInstance } from '@arco-design/web-vue'
import { licenseDetailsApi } from '@vcp/apis/src/ssl'
import dayjs from 'dayjs'

import {
  algorithmOptions,
  brandOptions,
  statusOwnedOptions,
  verifyOptions
} from '@/config'
import type { LicenseItem } from '@/types/licenseList'
import { dealDisplay, dealDomain, dealStatusColor } from '@/utils/handleColumn'

interface IProps {
  isOwn: number
}
const props = withDefaults(defineProps<IProps>(), {})
const modelValue = defineModel<boolean>()
const applyId = defineModel<string>('applyId', { default: '' })
const formRef = ref<FormInstance>()
const formState = ref<LicenseItem>({})
const loading = ref<boolean>(false)
const handleOpen = () => {
  loading.value = true
  if (applyId.value) {
    licenseDetailsApi({ id: applyId.value })
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
// 有效期
const expiresTime = computed(() => {
  if (props.isOwn === 1) {
    const date1 = dayjs.unix(
      (Number(formState.value?.expiration_time) ?? 0) + 60
    ) //只在展示时加60秒
    const date2 = dayjs.unix(Number(formState.value?.issued_date) ?? 0)
    return `${date1.diff(date2, 'month')}个月`
  }
  return '3个月'
})
// 到期时间
const restTime = computed(() => {
  const date1 = dayjs.unix((Number(formState.value?.expiration_time) ?? 0) + 1)

  const date2 = dayjs.unix(dayjs().unix())
  const temp = date1.diff(date2, 'day')
  if (temp < 1) {
    return '（剩余0天）'
  } else {
    return `（剩余${temp}天）`
  }
})
</script>
