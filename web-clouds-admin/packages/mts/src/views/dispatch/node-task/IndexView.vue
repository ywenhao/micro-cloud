<template>
  <vc-container header-bordered admin page-title="节点任务">
    <vc-filter-bar
      ref="filterBarRef"
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-radio-group
          v-model="dateRadio"
          :options="mtsDayOpts"
          type="button"
        />
        <a-range-picker
          class="ml-2 w-300px"
          v-model="datePicker"
          value-format="X"
          :disabled-date="disabledDate"
          @clear="dateRadio = 'today'"
        />
      </template>
    </vc-filter-bar>

    <div table-box>
      <vc-table
        row-key="id"
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :bordered="false"
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        :loading="loading"
      />
    </div>
  </vc-container>
</template>

<script setup lang="ts">
import { getCollectNodeApi, getMtsNodeApi } from '@vca/apis/src/mts'
import type { NodeTaskItem } from '@vca/apis/src/mts/model'
import {
  mtsDayOpts,
  useDatePicker,
  useListRequest,
  useTable
} from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const filterBarRef = ref()
const { dateRadio, dateValue, datePicker } = useDatePicker()

const filterData = reactive({})
const state = computed(() => {
  return {
    ...filterData,
    begin_time: dateValue.value[0],
    end_time: dateValue.value[1]
  }
})

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getCollectNodeApi, state)
const { tableRef, createSortChange } = useTable<NodeTaskItem[]>(tableData)

const handleSortChange = createSortChange(getList, state)

const getNode = () => {
  filterBarRef.value?.setFieldAttrs('node_id', { loading: true })
  getMtsNodeApi({})
    .then(res => {
      const list = res.list ?? []
      filterBarRef.value?.setFieldSchema('node_id', {
        attrs: {
          options: [{ label: '全部节点', value: '0' }].concat(
            list.map(v => ({ label: v.name!, value: v.id! }))
          )
        }
      })
    })
    .finally(() => {
      filterBarRef.value?.setFieldAttrs('node_id', { loading: false })
    })
}

watch(dateValue, () => getList())

onMounted(() => {
  getNode()
  getList()
})
</script>
