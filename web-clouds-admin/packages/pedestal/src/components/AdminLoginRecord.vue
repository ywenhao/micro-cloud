<template>
  <a-drawer
    :footer="false"
    class="is-admin"
    v-model:visible="modelValue"
    title="登录记录"
    :width="856"
    @open="handleDrawerOpen"
  >
    <a-table
      :bordered="false"
      class="mb-4"
      :loading="loading"
      :columns="columns"
      column-resizable
      :data="dataSource"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
    </a-table>
  </a-drawer>
</template>

<script setup lang="tsx">
import type { TableColumnData } from '@arco-design/web-vue'
import { adminLoginRecordApi } from '@vca/apis/pedestal'
import { useListRequest } from 'vc-material'

const modelValue = defineModel()
const appStore = useAppStore()

const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
  getTableList()
}

const columns: TableColumnData[] = [
  {
    dataIndex: 'login_at',
    title: '登录时间',
    render: ({ record }) => <span v-uts={record.login_at}></span>,
    cellStyle: { minWidth: '180px' }
  },
  {
    dataIndex: 'login_ip',
    title: '登录IP',
    render: ({ record }) => <span v-table-cell={record.login_ip}></span>,
    cellStyle: { minWidth: '165px' }
  },
  {
    dataIndex: 'login_addr',
    title: '所在地',
    render: ({ record }) => <span v-table-cell={record.login_addr}></span>,
    cellStyle: { minWidth: '137px' }
  },
  {
    dataIndex: 'system_info',
    title: '系统版本',
    render: ({ record }) => <span v-table-cell={record.system_info}></span>,
    cellStyle: { minWidth: '147px' }
  },
  {
    dataIndex: 'browser_info',
    title: '浏览器版本',
    render: ({ record }) => <span v-table-cell={record.browser_info}></span>,
    cellStyle: { minWidth: '170px' }
  }
]
const admin_id = computed(() => appStore.userInfo?.id)
const state = ref({
  admin_id
})
const {
  arcoPagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(adminLoginRecordApi, state, {
  showPageSize: true,
  showTotal: true
})
const handleDrawerOpen = () => {
  getTableList()
}
</script>
