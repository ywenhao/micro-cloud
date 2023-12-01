<script setup lang="ts">
import { type TableColumnData } from '@arco-design/web-vue'
import { getCdnStatisticWafListApi } from '@vcp/apis/cdn'
import type { VcFilterBarScheme, VcFilterBarState } from 'vc-material'
import { useListRequest, useTable } from 'vc-material'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      widget: 'range',
      startField: 'start_time',
      endField: 'end_time',
      attrs: { valueFormat: 'X' }
    },
    {
      field: 'action',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [
          { value: 0, label: '全部操作' },
          { value: '允许', label: '允许' },
          { value: '阻止', label: '阻止' }
        ]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'rule_name',
        options: [
          { label: '规则名称', value: 'rule_name' },
          { label: '国家/地区', value: 'location' },
          { label: 'IP地址', value: 'ip' },
          { label: '域名', value: 'domain' }
        ]
      }
    }
  ]
}

const columns: TableColumnData[] = [
  {
    dataIndex: 'id',
    title: '时间',
    cellStyle: { minWidth: '120px' },
    slotName: 'id'
  },
  {
    dataIndex: 'username',
    title: '账号',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '180px' },
    render: emptyFormatter
  },
  { dataIndex: 'group_name', title: '分组', cellStyle: { minWidth: '120px' } },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: emptyFormatterUnix
  }
]

const state = inject('statisticState') as any
const filterState = ref<VcFilterBarState>({})

const {
  pagination,
  arcoPagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnStatisticWafListApi, filterState)

const { tableRef } = useTable(dataSource)

watchPostEffect(() => {
  filterState.value = {
    ...(state.value || {}),
    ...filterState.value,
    page: arcoPagination.current
  }
  getTableList()
})
</script>

<template>
  <vc-container page-title="日志" admin class="mt-2" :bordered="false">
    <template #header>
      <span class="text-sm font-medium">日志</span>
    </template>
    <vc-filter-bar
      class="my-4"
      :loading="loading"
      :refresh="false"
      v-model:page="pagination.page"
      v-model="filterState"
      :schemas="filterBarScheme"
      @search="getTableList"
    >
    </vc-filter-bar>
    <vc-table
      row-key="id"
      ref="tableRef"
      class="mt-4"
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      column-resizable
      @get-list="getTableList"
      :page-data="pagination"
      :loading="loading"
    >
    </vc-table>
  </vc-container>
</template>
