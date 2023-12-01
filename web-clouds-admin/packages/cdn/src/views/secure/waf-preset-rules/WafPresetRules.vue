<template>
  <vc-container admin header-bordered page-title="WAF预置规则">
    <vc-filter-bar
      class="mb-4"
      v-model="filterState"
      @search="getTableList"
      v-model:page="pagination.page"
      :schemas="filterBarScheme"
    />
    <vc-table
      row-key="id"
      ref="tableRef"
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      column-resizable
      @get-list="getTableList"
      :page-data="pagination"
      :loading="loading"
    />
  </vc-container>
</template>

<script setup lang="ts">
import { getCdnGlobalManagedRuleApi } from '@vca/apis/cdn'
import {
  useListRequest,
  type VcFilterBarScheme,
  type VcFilterBarState
} from 'vc-material'

import { columns } from './columns'

const filterState = ref<VcFilterBarState>({
  rule_type: 0
})
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入规则描述'
      }
    }
  ]
}

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnGlobalManagedRuleApi, filterState)

onMounted(async () => {
  getTableList()
})
</script>
