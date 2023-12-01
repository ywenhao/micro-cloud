<template>
  <a-table
    sticky-header
    class="mt-2 task-table-list"
    :data="tableData"
    :pagination="false"
    :columns="[
      {
        dataIndex: 'space_name',
        title: '所属空间',
        cellStyle: { minWidth: '200px' },
        ellipsis: true,
        tooltip: true
      },

      {
        dataIndex: 'catalog',
        slotName: 'catalog',
        title: '目录',
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
        width: 110,
        slotName: 'actions',
        cellClass: 'table-actions'
      }
    ]"
    :loading="loading"
  >
    <template #status="{ record }">
      <a-tag
        :class="{
          'is-primary': ['ready', 'deleteIng'].includes(record.status),
          'is-success': record.status === 'success',
          'is-danger': ['error', 'cancel'].includes(record.status)
        }"
      >
        {{ getStatus(record.status) }}
      </a-tag>
    </template>
    <template #actions="{ record, rowIndex }">
      <a-link
        v-if="['error', 'cancel'].includes(record.status)"
        :hoverable="false"
        @click="handleRetry(rowIndex)"
        type="primary"
      >
        重试
      </a-link>
      <a-link
        :hoverable="false"
        @click="handleRemove(rowIndex)"
        type="primary"
        status="danger"
      >
        移除
      </a-link>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { deleteObjectsApi, fileListApi } from '@vcp/apis/oss'
import type { SliceUploadStatus } from '@vcp/shared/lib/slice-upload-utils'

import type { DelCatalogItem } from '@/stores/modules/taskCenter'
import { useTaskCenterStore } from '@/stores/modules/taskCenter'

const loading = ref(false)
const taskCenterStore = useTaskCenterStore()

const tableData = computed(() =>
  taskCenterStore.delCatalogList.filter(item => {
    let s = status.value
    if (s === 'doing') s = 'deleteIng'
    return !s ? true : item.status === s
  })
)

const status = defineModel<string>('status')

const getStatus = (status: SliceUploadStatus) => {
  const statusData = {
    ready: '待处理',
    deleteIng: '处理中',
    error: '失败',
    success: '成功',
    cancel: '已停止'
  }
  return statusData[status as keyof typeof statusData]
}

const list = computed(() => taskCenterStore.delCatalogList)
const waitDelList = computed(() =>
  list.value.filter(item => ['ready'].includes(item.status))
)

const hasDeleteIng = computed(() =>
  list.value.some(item => item.status === 'deleteIng')
)

const requestControllerMap = new WeakMap<
  DelCatalogItem,
  { list: AbortController; del: AbortController }
>()

// 取消请求
const abort = (item: DelCatalogItem) => {
  const abort = requestControllerMap.get(item)
  if (abort) {
    abort.list.abort()
    abort.del.abort()
  }
}

const MAX_COUNT = 2

const handleRemove = (index: number) => {
  const item = list.value[index]
  abort(item)
  taskCenterStore.delCatalogList.splice(index, 1)
}

const handleAllRetry = () => {
  if (hasDeleteIng.value) return
  taskCenterStore.delCatalogList.forEach(item => {
    if (['error', 'cancel'].includes(item.status)) item.status = 'ready'
  })

  let i = 0
  while (i < MAX_COUNT && waitDelList.value.length) {
    handleStart()
    i++
  }
}

const handleRetry = (index: number) => {
  const item = list.value[index]
  if (!['error', 'cancel'].includes(item.status)) return
  item.status = 'ready'

  handleStart(item)
}

const handleStart = async (item?: DelCatalogItem) => {
  if (!waitDelList.value.length) return
  if (
    list.value.filter(item => item.status === 'deleteIng').length >= MAX_COUNT
  )
    return

  item ??= waitDelList.value[0]
  requestControllerMap.set(item, {
    list: new AbortController(),
    del: new AbortController()
  })
  try {
    item.status = 'deleteIng'
    const params = item.params
    const catalog = await fileListApi(params, {
      signal: requestControllerMap.get(item)?.list.signal
    })
    const catalogList = catalog?.list || []
    const keys = catalogList.map(item => item.key!)
    await deleteObjectsApi(
      { bucket_id: params.bucket_id, keys },
      {
        signal: requestControllerMap.get(item)?.del.signal
      }
    )
    item.status = 'success'
  } catch (e) {
    if (item.status === 'deleteIng') item.status = 'error'
  }
  handleStart()
}

const handleAllStop = () => {
  if (!hasDeleteIng.value) return
  taskCenterStore.delCatalogList.forEach(item => {
    if (item.status === 'deleteIng') item.status = 'cancel'
    abort(item)
  })
}

defineExpose({ handleAllRetry, handleAllStop })
</script>

<style scoped lang="less">
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
