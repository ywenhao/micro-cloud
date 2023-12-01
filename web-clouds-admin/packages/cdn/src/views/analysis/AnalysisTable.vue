<template>
  <vc-table
    row-key="id"
    ref="tableRef"
    class="mt-4"
    :data="dataSource"
    :columns="columns[module]"
    column-resizable
    @sorter-change="handleSortChange"
    @get-list="getTableList"
    :page-data="pagination"
    :loading="loading"
    v-model:selectedKeys="selectedKeys"
  >
    <template #site_count="{ record }">
      <div class="flex items-center">
        <span>{{ record.site_count }}</span>
        <vc-svg-icon
          :size="16"
          name="detail"
          prefix="cdn"
          class="ml-1 cursor-pointer cell-hide"
          v-if="record.site_count > 0"
          @click="emit('command', 'SITE_COUNT', record)"
        />
      </div>
    </template>
    <template #node_count="{ record }">
      <div class="flex items-center">
        <span>{{ record.node_count }}</span>
        <vc-svg-icon
          :size="16"
          name="detail"
          prefix="cdn"
          class="ml-1 cursor-pointer cell-hide"
          v-if="record.node_count > 0"
          @click="emit('command', 'NODE_COUNT', record)"
        />
      </div>
    </template>
    <template #actions="{ record }">
      <a-link
        :hoverable="false"
        @click="emit('command', 'EDIT', record)"
        type="primary"
      >
        编辑
      </a-link>
      <a-link
        :hoverable="false"
        @click="emit('command', 'DEL', record)"
        status="danger"
      >
        删除
      </a-link>
    </template>
  </vc-table>
</template>

<script setup lang="ts">
import {
  getCdnResolvRegionsListApi,
  getCdnResolvSiteResolvesListApi
} from '@vca/apis/cdn'
import { useListRequest, useTable, type VcFilterBarState } from 'vc-material'

import { columns } from './columns'
import type { ICommand } from './hooks/useCommand'

const props = defineProps<{
  module: 'domain' | 'region'
}>()

const filterState = defineModel<VcFilterBarState>('filterState', {
  required: true
})

const emit = defineEmits<{
  (event: 'command', command: ICommand, record: any): void
}>()

const api =
  props.module === 'domain'
    ? getCdnResolvSiteResolvesListApi
    : getCdnResolvRegionsListApi

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(api, filterState)

const { tableRef, selectedKeys, createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, filterState)
onMounted(getTableList)
defineExpose({
  // 刷新
  refresh: getTableList
})
</script>
