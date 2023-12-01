<template>
  <vc-table
    :bordered="false"
    :data="dataSource"
    :columns="columns"
    column-resizable
    @get-list="getTableList"
    :page-data="pagination"
    :loading="loading"
  >
  </vc-table>
</template>
<script lang="ts" setup>
import type { TableColumnData } from '@arco-design/web-vue'
import { getUserLoginRecordsApi } from '@vca/apis/pedestal'
import { emptyFormatter, emptyFormatterUnix, useListRequest } from 'vc-material'

const route = useRoute()

const columns: TableColumnData[] = [
  {
    dataIndex: 'login_at',
    title: '登录时间',
    cellStyle: { minWidth: 180 },
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'login_ip',
    title: '登录IP',
    cellStyle: { minWidth: 160 },

    render: emptyFormatter
  },
  {
    dataIndex: 'login_addr',
    title: '所在地',
    render: emptyFormatter
  },
  {
    dataIndex: 'system_info',
    title: '系统版本',
    cellStyle: { minWidth: 180 },
    render: emptyFormatter
  },
  {
    dataIndex: 'browser_info',
    title: '浏览器版本',
    render: emptyFormatter
  }
]

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getUserLoginRecordsApi, {
  user_id: String(route.params?.userId || '')
})
onMounted(getTableList)
</script>
