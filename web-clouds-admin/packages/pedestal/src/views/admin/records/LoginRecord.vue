<script setup lang="tsx">
import type { SelectOptionData, TableColumnData } from '@arco-design/web-vue'
import { adminListApi, adminLoginRecordApi } from '@vca/apis/pedestal'
import { useListRequest } from 'vc-material'

import filterBarScheme from './filterBarScheme'

const filterBarRef = ref()

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
    dataIndex: 'username',
    title: '账号',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '146px' }
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
const state = ref({})

const {
  arcoPagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(adminLoginRecordApi, state, {
  showPageSize: true,
  showTotal: true
})

const getAdmins = () => {
  adminListApi({}).then(res => {
    const data = [{ username: '全部账户', id: 0 }, ...(res?.list ?? [])]
    const options: SelectOptionData[] = data.map(({ id, username }) => ({
      value: id,
      label: username
    }))

    filterBarRef.value?.setFieldAttrs('admin_id', {
      options
    })
  })
}
onMounted(() => {
  getTableList()
  getAdmins()
})
</script>

<template>
  <vc-container admin page-title="登录记录" header-bordered>
    <vc-filter-bar
      ref="filterBarRef"
      class="mb-4"
      @search="getTableList"
      @update:page="handlePageChange"
      v-model="state"
      :schemas="filterBarScheme"
    >
    </vc-filter-bar>
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
  </vc-container>
</template>
