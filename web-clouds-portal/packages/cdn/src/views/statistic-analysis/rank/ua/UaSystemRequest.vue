<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'
import { getCdnStatisticTopUaSystemRequestListApi } from '@vcp/apis/cdn'
import { useListRequest, useTable } from 'vc-material'

const columns: TableColumnData[] = [
  {
    dataIndex: 'system',
    ellipsis: true,
    tooltip: true,
    title: '系统'
  },
  {
    dataIndex: 'requests',
    title: '请求数',
    width: 200
  }
]

const state = inject('statisticState') as any

const {
  arcoPagination,
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnStatisticTopUaSystemRequestListApi, state, {
  showPageSize: false,
  pageSize: 5
})

const { tableRef } = useTable(dataSource)
watch(
  state,
  () => {
    pagination.page = 1
    getTableList({ page: arcoPagination.current, limit: 5 } as any)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <vc-table
    :loading="loading"
    :pagination="{
      pageSize: 5,
      showPageSize: false,
      showTotal: false
    }"
    column-resizable
    :page-data="pagination"
    ref="tableRef"
    :columns="columns"
    :data="dataSource"
  ></vc-table>
</template>
