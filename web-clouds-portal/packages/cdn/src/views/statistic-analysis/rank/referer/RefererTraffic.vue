<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'
import { getCdnStatisticTopRefererTrafficListApi } from '@vcp/apis/cdn'
import { emptyFormatterByte, useListRequest, useTable } from 'vc-material'

const columns: TableColumnData[] = [
  {
    dataIndex: 'referer',
    ellipsis: true,
    tooltip: true,
    title: 'Referer'
  },
  { dataIndex: 'bytes', title: '流量', width: 200, render: emptyFormatterByte }
]

const state = inject('statisticState') as any

const {
  arcoPagination,
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnStatisticTopRefererTrafficListApi, state, {
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
