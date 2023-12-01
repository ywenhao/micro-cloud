<template>
  <div class="table-pane">
    <vc-filter-bar
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-button
          type="primary"
          @click="handleAdd"
          :disabled="loading || addDisabled"
          >新建队列</a-button
        >
      </template>
    </vc-filter-bar>
    <div table-box>
      <vc-table
        row-key="id"
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :bordered="false"
        @get-list="getList()"
        :loading="loading"
        @change="handleChange"
        :draggable="{ type: 'handle', width: 60, title: '排序' }"
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
    <add-queue-dialog
      v-model="dialogVisible"
      @submit="getList()"
      :checkName="e => checkName(e)"
    />
  </div>
</template>

<script setup lang="ts">
import { Message, type TableChangeExtra } from '@arco-design/web-vue'
import {
  deleteMtsQueueApi,
  type QueueModel,
  updateMtsQueueApi,
  updateMtsQueueIndexApi
} from '@vcp/apis/mts'
import { getMtsQueueApi } from '@vcp/apis/mts'
import { useListRequest, useTable, VcModal } from 'vc-material'

import AddQueueDialog from './AddQueueDialog.vue'
import { columns } from './columns'
import { filterBarScheme } from './scheme'

const filterData = ref({})

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsQueueApi, filterData)
getList()

const { tableRef } = useTable(tableData)

const addDisabled = computed(() => tableData.value.length >= 5)
const isDeleteDisabled = (record: QueueModel) =>
  record.queue_count! + record.process_count! >= 1

async function handleDelete(row: QueueModel) {
  if (isDeleteDisabled(row)) {
    return Message.warning('当前队列存在待处理/正在处理任务，不可删除')
  }
  VcModal.error(
    {
      title: '删除队列',
      content: '确认删除队列'
    },
    async () => {
      await deleteMtsQueueApi({ id: row.id! })
      Message.success('删除成功')
      getList()
    }
  )
}

async function handleEditName(name: string, row: QueueModel) {
  const errorMsg = checkName(name)
  if (errorMsg) {
    Message.error(errorMsg)
    throw new Error('name is error')
  }
  await updateMtsQueueApi({ id: row.id!, name: name || '' })
  Message.success('修改成功')
  getList()
}

const dialogVisible = ref(false)
function handleAdd() {
  dialogVisible.value = true
}

function handleChange(data: QueueModel[], extra: TableChangeExtra) {
  if (extra.type === 'drag') {
    const id = extra.dragTarget?.id
    const idx = data.findIndex(item => item.id === id)
    const index = tableData.value[idx].index!
    loading.value = true
    updateMtsQueueIndexApi({ id, index })
      .then(() => getList())
      .catch(() => (loading.value = false))
  }
}

function checkName(name: string) {
  const reg = /^[0-9A-Za-z_-]{5,20}$/
  if (!name) return '请输入名称'
  if (!reg.test(name))
    return '队列名称只能由 0-9、A-Z、a-z、-、_ 组成，长度为5-20'
  if (tableData.value.some(item => item.name === name)) return '队列名称重复'
}
</script>
