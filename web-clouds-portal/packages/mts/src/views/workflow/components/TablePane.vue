<template>
  <div class="table-pane">
    <vc-filter-bar
      ref="filterRef"
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-button type="primary" @click="handleDo('add', {})"
          >新建工作流</a-button
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
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        :loading="loading"
      >
        <template #actions="{ record }">
          <a-link @click="handleDo('details', record)">详情</a-link>
          <a-link @click="handleDo('edit', record)">编辑</a-link>
          <a-link @click="handleDo('copy', record)">复制</a-link>
          <a-link @click="handleDo('delete', record)" status="danger"
            >删除</a-link
          >
        </template>
      </vc-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  deleteMtsWorkflowApi,
  getMtsQueueApi,
  getMtsWorkflowApi,
  type WorkflowModel
} from '@vcp/apis/mts'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const filterRef = ref()

const filterData = ref({})
const state = computed(() => ({ ...filterData.value, region_id: props.id }))

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsWorkflowApi, state)

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

const addState = useSessionStorage('addWorkflowState', {} as WorkflowModel)

type Command = 'details' | 'delete' | 'add' | 'copy' | 'edit'
async function handleDo(command: Command, row: WorkflowModel) {
  const map: Record<Command, () => void> = {
    details() {
      router.push({ name: 'WorkflowDetail', params: { id: row.id } })
    },
    delete() {
      const request = () =>
        deleteMtsWorkflowApi({ id: row.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, tableData)
          getList()
        })
      VcModal.error(
        {
          title: '删除工作流',
          content: '确定删除工作流吗？'
        },
        request
      )
    },
    add() {
      router.push({ name: 'WorkflowAdd', params: { regionId: props.id } })
    },
    copy() {
      addState.value = { ...row, id: undefined, name: undefined }
      router.push({ name: 'WorkflowAdd', params: { regionId: props.id } })
    },
    edit() {
      router.push({
        name: 'WorkflowEdit',
        params: { id: row.id, regionId: props.id }
      })
    }
  }
  map[command]()
}

function getQueue() {
  filterRef.value?.setFieldAttrs('queue_id', {
    loading: true
  })
  getMtsQueueApi({ limit: 0 })
    .then(res => {
      filterRef.value?.setFieldAttrs('queue_id', {
        options: [
          { label: '全部队列', value: '' },
          ...res.list!.map(v => ({
            label: v.name,
            value: v.id
          }))
        ]
      })
    })
    .finally(() => {
      filterRef.value?.setFieldAttrs('queue_id', {
        loading: false
      })
    })
}

const initData = () => {
  getQueue()
  props.id && getList()
}

initData()

onActivated(() => {
  initData()
})
</script>
