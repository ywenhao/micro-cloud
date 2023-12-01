<template>
  <div class="base-info">
    <div class="base-info__header">
      <vc-svg-icon class="avatar" :size="48" name="default-avatar" />
      <div v-for="item in headerData" :key="item.label" class="info-item">
        <div class="up">
          <vc-svg-icon :size="16" :name="item.icon" />
          <div class="info-label">{{ item.label }}</div>
        </div>
        <div class="down">
          <vc-text-ell :content="item.value" />
        </div>
      </div>
    </div>
    <div table-box>
      <vc-table
        :data="tableList"
        :columns="columns"
        @get-list="getList()"
        :loading="loading"
        :page-data="pagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { userLoginLogApi } from '@vcp/apis/pedestal'
import {
  emptyText,
  formatUnix,
  useListRequest,
  usernameMailEll
} from 'vc-material'

import { columns } from '../../layout/components/loginLogColumns'

const {
  run: getList,
  pagination,
  data: tableList,
  loading
} = useListRequest(userLoginLogApi)

getList()

const appStore = useAppStore()

const headerData = computed(() => {
  const userInfo = appStore.userInfo
  return [
    {
      icon: 'center-user',
      label: '账号',
      value: emptyText(userInfo.username)
    },
    {
      icon: 'center-email',
      label: '邮箱',
      value: usernameMailEll(userInfo.email!)
    },
    {
      icon: 'center-time',
      label: '创建时间',
      value: formatUnix(+userInfo.created_at!)
    }
  ]
})
</script>

<style lang="less" scoped>
.base-info {
  width: 100%;
  height: 100%;
  @apply flex-col flex;
  .base-info__header {
    @apply flex items-center w-full h-80px px-24px;
    background: rgb(var(--primary-1));
    border-radius: 6px;
    .avatar {
      @apply rounded-1/2;
    }
    .info-item {
      display: flex;
      padding: 0 40px;
      max-width: 240px;
      height: 48px;
      font-size: 14px;
      flex-direction: column;
      gap: 8px;
      font-weight: 400;
      line-height: 20px;
      & + .info-item {
        border-left: 1px solid rgba(var(--primary-2), 0.5);
      }
      .up {
        display: flex;
        align-items: center;
        white-space: nowrap;
        color: var(--color-text-3);
        gap: 4px;
      }
      .down {
        white-space: nowrap;
        color: var(--color-text-1);
        font-weight: 400;
      }
    }
  }
  &__body {
    height: calc(100% - 208px);
    @apply px-4 pt-[18px] mt-4 rounded-lg bg-white overflow-hidden;
  }
}
</style>
