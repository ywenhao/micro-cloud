<script setup lang="ts">
import { formatUnix } from 'vc-material'

const appStore = useAppStore()
const userInfo = computed(() => appStore.userInfo)
</script>

<template>
  <div class="user-info-card">
    <vc-svg-icon class="mr-4" :size="50" name="default-avatar"></vc-svg-icon>
    <div class="flex flex-col">
      <label class="user-name">您好，{{ userInfo?.username || '' }}</label>
      <a-descriptions class="user-info__desc">
        <a-descriptions-item label="最近登录IP：">
          {{ userInfo?.login_ip || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="最近登录时间：">
          {{ formatUnix(+userInfo?.login_at!) }}
        </a-descriptions-item>
        <a-descriptions-item label="登录所在地：">
          {{ userInfo?.login_addr || '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </div>
</template>

<style scoped lang="less">
.user-info-card {
  @apply flex items-center h-20 px-6 py-4;
  background: url('@/assets/images/overview-user-card-bg.svg') no-repeat;
  background-size: cover;
  border-radius: 12px;
  .user-name {
    @apply color-ct-1 font-500 text-16px leading-22px;
  }
  .user-info__desc {
    :deep(.arco-descriptions-body) {
      .arco-descriptions-item-label,
      .arco-descriptions-item-value {
        @apply mb-0! mr-20!;
      }
    }
  }
}
</style>
