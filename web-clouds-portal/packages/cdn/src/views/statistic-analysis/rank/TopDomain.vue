<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'
import { getCdnStatisticTopDomainListApi } from '@vcp/apis/cdn'
import { emptyFormatterByte, useListRequest, useTable } from 'vc-material'

const columns: TableColumnData[] = [
  {
    dataIndex: 'domain',
    ellipsis: true,
    tooltip: true,
    title: '域名'
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
} = useListRequest(getCdnStatisticTopDomainListApi, state, {
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
  <vc-card>
    <template #title>
      <div class="flex items-center gap-x-1">
        <vc-svg-icon :size="20" prefix="cdn" name="rank"></vc-svg-icon>
        <span class="text-base">TOP100 域名</span>
      </div>
    </template>
    <vc-table
      :loading="loading"
      :pagination="{
        pageSize: 5,
        showPageSize: false,
        showTotal: false
      }"
      :page-data="pagination"
      ref="tableRef"
      :columns="columns"
      :data="dataSource"
    ></vc-table>
  </vc-card>
</template>
