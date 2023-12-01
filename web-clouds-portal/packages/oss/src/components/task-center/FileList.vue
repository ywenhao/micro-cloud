<template>
  <a-table
    sticky-header
    class="mt-2 task-table-list"
    :data="tableData"
    :pagination="false"
    :columns="[
      {
        dataIndex: 'name',
        title: '文件名',
        slotName: 'name',
        cellStyle: { minWidth: '200px' },
        ellipsis: true,
        tooltip: true
      },

      {
        dataIndex: 'position',
        slotName: 'position',
        ellipsis: true,
        tooltip: true,
        title: '上传位置',
        cellStyle: { minWidth: '180px' }
      },
      {
        dataIndex: 'file_size',
        slotName: 'file_size',
        title: '文件大小',
        cellStyle: { minWidth: '180px' }
      },
      {
        dataIndex: 'status',
        slotName: 'status',
        title: '状态',
        cellStyle: { minWidth: '180px' }
      },
      {
        dataIndex: 'actions',
        title: '操作',
        width: 140,
        slotName: 'actions',
        cellClass: 'table-actions'
      }
    ]"
    :loading="loading"
  >
    <template #name="{ record }">
      {{ record.file?.name }}
    </template>
    <template #status="{ record }">
      <a-tag
        :class="{
          'is-success': record.status === 'success',
          'is-primary': ['ready', 'uploading'].includes(record.status),
          'is-danger': ['error', 'cancel'].includes(record.status)
        }"
      >
        {{ getStatus(record) }}
      </a-tag>

      <!-- <a-tooltip
        :content="record.errorMessage"
        class="light dns-status-tooltip"
        content-class="tool-content"
        trigger="click"
      >
        <icon-exclamation-circle v-if="record.status === 'error'" />
      </a-tooltip> -->
    </template>
    <template #file_size="{ record }">
      {{ convertByte(record.file?.size) }}
    </template>
    <template #actions="{ record, rowIndex }">
      <a-link
        v-if="record.status === 'uploading'"
        :hoverable="false"
        @click="handleClick('cancel', record, rowIndex)"
        type="primary"
      >
        取消
      </a-link>
      <a-link
        v-if="['error', 'pause', 'cancel'].includes(record.status)"
        :hoverable="false"
        @click="handleClick('retry', record, rowIndex)"
        type="primary"
      >
        重试
      </a-link>
      <a-link
        v-if="record.status === 'success'"
        :hoverable="false"
        @click="handleClick('copy', record)"
        type="primary"
      >
        复制外链
      </a-link>
      <a-link
        v-if="record.status !== 'uploading'"
        :hoverable="false"
        @click="handleClick('remove', record, rowIndex)"
        type="primary"
        status="danger"
      >
        移除
      </a-link>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { getObjectsPreSignApi } from '@vcp/apis/oss'
import { convertByte, useClipboard } from 'vc-material'

import type { CustomFileItem } from '@/stores/modules/taskCenter'
import { useTaskCenterStore } from '@/stores/modules/taskCenter'

import { getStatus } from './utils'

const loading = ref<boolean>(false)
const taskCenterStore = useTaskCenterStore()

const status = defineModel<CustomFileItem['status'] | 'doing' | ''>('status', {
  required: true
})

const baseUrl = computed(() => taskCenterStore.outDomain)

type ICommand = 'cancel' | 'copy' | 'remove' | 'retry'

const fileOutLinkDomain = ref<string>('')

const tableData = computed(() =>
  taskCenterStore.taskFileList.filter(item => {
    let s = status.value
    if (s === 'doing') s = 'uploading'
    return !s ? true : item.status === s
  })
)

const { copy: handleCopy } = useClipboard(fileOutLinkDomain)

const handleClick = (
  command: ICommand,
  record?: CustomFileItem,
  rowIndex?: number
) => {
  const actions: Record<ICommand, () => void> = {
    // 单个取消
    cancel: () => {
      taskCenterStore.cancel(rowIndex!)
      taskCenterStore.start()
    },
    retry: () => {
      taskCenterStore.retry(rowIndex!)
    },
    remove: () => {
      taskCenterStore.remove(rowIndex!)
    },
    copy: () => {
      if (!baseUrl.value) {
        Message.error('请先选择外链域名')
        return
      }
      getObjectsPreSignApi({
        bucket_id: record?.params.bucket_id!,
        keys: [record?.params.key!],
        base_url: baseUrl.value
      }).then(res => {
        const url = res?.list?.[0]?.url
        if (!url) return Message.error('获取外链失败')
        fileOutLinkDomain.value = url
        handleCopy()
        Message.success('复制成功')
      })
    }
  }
  actions[command as ICommand]()
}
</script>

<style lang="less" scope>
.tool-content {
  color: var(--color-text-1);
}
.task-table-list {
  height: calc(100% - 230px) !important;
  .arco-spin {
    .arco-table-container {
      .arco-scrollbar {
        .arco-scrollbar-container {
          @apply overflow-y-auto!;
        }
      }
    }
  }
}
</style>
