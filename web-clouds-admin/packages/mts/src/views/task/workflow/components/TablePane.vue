<template>
  <div class="table-pane">
    <vc-filter-bar
      ref="filterRef"
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
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
          <a-link @click="handleDo('details', record)">详情</a-link>
          <a-link @click="handleDo('delete', record)">删除</a-link>
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
} from '@vca/apis/mts'
import { regionListApi } from '@vca/apis/oss'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const router = useRouter()
const filterRef = ref()

const filterData = ref({
  region_id: ''
})

const state = computed(() => ({
  ...filterData.value
}))

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsWorkflowApi, state)

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

type Command = 'details' | 'delete'
async function handleDo(command: Command, row: WorkflowModel) {
  const map: Record<Command, () => void> = {
    details() {
      router.push({ name: 'TaskWorkflowDetail', params: { id: row.id } })
    },
    delete() {
      const data = {
        id: row.id!,
        status: 5
      }
      const request = () =>
        deleteMtsWorkflowApi(data).then(() => {
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
    }
  }
  map[command]()
}
async function handleFilter(row: WorkflowModel) {
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

async function getRegions() {
  filterRef.value?.setFieldAttrs('region_id', { loading: true })
  try {
    const res = await regionListApi({})
    const list = (res.list || []).map(v => ({ value: v.id!, label: v.name! }))
    if (!list.length) {
      return Message.error('区域列表为空')
    }
    filterData.value.region_id = list[0].value
    filterRef.value?.setFieldAttrs('region_id', { options: list })
    filterRef.value?.setFieldValue('region_id', list[0].value)
  } finally {
    filterRef.value?.setFieldAttrs('region_id', { loading: false })
  }
}

onActivated(async () => {
  getQueue()
  await getRegions()

  if (!filterData.value.region_id) return
  await getList()
})
</script>
