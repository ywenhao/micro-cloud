<template>
  <div class="table-pane">
    <vc-filter-bar
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
      ref="filterRef"
    />
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
      >
        <template #name="{ record }">
          <div class="flex items-center" v-if="record.default === 1">
            <vc-text-ell
              class="sub-title font-400! max-w-[max-content]"
              :content="record.name"
            />
            <a-tag size="small" class="is-info ml-4px px-4px!">默认</a-tag>
          </div>
          <vc-remark-input
            v-else
            :content="record.name"
            :on-submit="e => handleEditName(e, record)"
            placeholder="请输入名称"
          />
        </template>
        <template #user_id="{ record }">
          <div class="flex items-center">
            <vc-text-ell
              class="sub-title font-400! max-w-[max-content]"
              :content="record.user_id"
            />
            <vc-svg-icon
              prefix="mts"
              name="filter"
              :size="16"
              @click="handleFilter(record)"
              class="ml-4px cursor-pointer cell-hide"
            />
          </div>
        </template>
        <template #actions="{ record }">
          <template v-if="record.default === 1">-</template>
          <a-link
            v-else
            @click="handleDelete(record)"
            :status="
              isDeleteDisabled(record.process_count) ? 'normal' : 'danger'
            "
            >删除</a-link
          >
        </template>
      </vc-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { type QueueModel, updateMtsQueueApi } from '@vca/apis/mts'
import { deleteMtsQueueApi, getMtsQueueApi } from '@vca/apis/mts'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const filterRef = ref()

const filterData = ref({})

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsQueueApi, filterData)

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

const isDeleteDisabled = (record: QueueModel) =>
  record.queue_count! + record.process_count! >= 1

async function handleDelete(row: QueueModel) {
  if (isDeleteDisabled(row)) {
    return Message.warning('当前队列存在待处理/正在处理任务，不可删除')
  }
  VcModal.error(
    {
      title: '删除队列',
      content: '确定删除队列吗？'
    },
    async () => {
      await deleteMtsQueueApi({ id: row.id! })
      decPageByData(pagination, tableData)
      Message.success('删除成功')
      getList()
    }
  )
}

async function handleEditName(name: string, row: QueueModel) {
  await updateMtsQueueApi({ id: row.id!, name: name || '' })
  Message.success('修改成功')
  getList()
}

async function handleFilter(row: QueueModel) {
  filterRef.value?.setFieldAttrs('keywords', {
    defaultSelected: ''
  })
  await nextTick()
  filterRef.value?.setFieldAttrs('keywords', {
    defaultSelected: 'user_id'
  })
  filterRef.value?.setFieldValue('user_id', row.user_id)
  getList()
}

onMounted(() => {
  getList()
})
</script>
