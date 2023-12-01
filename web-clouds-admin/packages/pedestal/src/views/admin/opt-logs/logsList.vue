<script setup lang="ts">
import { getOperationLogsListApi } from '@vca/apis/pedestal'
import {
  TimeRange,
  timeRangeValue,
  useListRequest,
  useTable,
  type VcFilterBarState
} from 'vc-material'

import columns from './columns'
import filterBarScheme from './filterBarScheme'

const filterBarRef = ref()
const [st, et] = timeRangeValue(TimeRange.YESTERDAY)

const state = ref<VcFilterBarState>({
  begin_at: st,
  end_tm: et,
  // range: [],
  _range: TimeRange.YESTERDAY
})

const handleSearch = () => {
  if (!state.value?.begin_at) {
    const [start, end] = timeRangeValue(TimeRange.YESTERDAY)
    state.value.begin_at = start
    state.value.end_tm = end
    state.value._range = TimeRange.YESTERDAY
  }
  if (state.value?.range?.length) {
    state.value._range = undefined
    filterBarRef.value?.setFieldValue('range', [])
  }
  getTableList()
}

const onDateChange = (v: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(v))
  state.value.begin_at = start
  state.value.end_tm = end
  state.value.range = []
  handleSearch()
}
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getOperationLogsListApi, state)

const { tableRef, createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, state)

onMounted(getTableList)
</script>

<template>
  <vc-container admin page-title="操作日志" header-bordered>
    <vc-filter-bar
      ref="filterBarRef"
      class="mb-4"
      :loading="loading"
      v-model:page="pagination.page"
      v-model="state"
      :schemas="filterBarScheme"
      @search="handleSearch"
    >
      <template #prefix>
        <a-radio-group
          :default-value="1"
          v-model="state._range"
          @change="onDateChange"
          type="button"
          :options="[
            { label: '今日', value: 2 },
            { label: '昨日', value: 1 },
            { label: '近7日', value: 3 },
            { label: '近30日', value: 4 }
          ]"
        ></a-radio-group>
      </template>
    </vc-filter-bar>

    <vc-table
      ref="tableRef"
      class="mt-4"
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      column-resizable
      @sorter-change="handleSortChange"
      @get-list="getTableList"
      :page-data="pagination"
      :loading="loading"
    >
    </vc-table>
  </vc-container>
</template>
