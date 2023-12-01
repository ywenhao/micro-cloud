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
        <a-button type="primary" @click="handleCommand('add')"
          >添加任务触发器</a-button
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
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            :before-change="() => handleStatus(record)"
          ></a-switch>
        </template>
        <template #actions="{ record }">
          <a-link @click="handleCommand('details', record)">详情</a-link>
          <a-link
            status="danger"
            :disabled="record.status === 1"
            @click="handleCommand('delete', record)"
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
  deleteMtsTriggerApi,
  getMtsQueueApi,
  getMtsTriggerApi,
  type TriggerModel,
  updateMtsTriggerStatusApi
} from '@vcp/apis/mts'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const props = defineProps<{
  id: string
}>()
const filterRef = ref()

const filterData = ref({})
const state = computed(() => ({ ...filterData.value, region_id: props.id }))

const router = useRouter()

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsTriggerApi, state)

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

const handleStatus = async (record: TriggerModel) => {
  const data = {
    id: record.id!,
    status: +record.status! === 1 ? 2 : 1
  }
  await updateMtsTriggerStatusApi(data)
  Message.success(+record.status! === 1 ? '禁用成功' : '启用成功')
  getList()
}

const handleCommand = (
  command: 'add' | 'details' | 'delete',
  record?: TriggerModel
) => {
  const map: Record<typeof command, () => void> = {
    add() {
      router.push({ name: 'TriggerAdd', params: { regionId: props.id } })
    },
    details() {
      router.push({ name: 'TriggerDetail', params: { id: record?.id } })
    },
    delete() {
      const request = () =>
        deleteMtsTriggerApi({ id: record?.id ?? '' }).then(() => {
          decPageByData(pagination, tableData)
          Message.success('删除成功')
          getList()
        })
      VcModal.error(
        {
          title: '删除任务触发器',
          content:
            '删除后该任务触发器将不再触发任务（不影响已触发的任务），且无法恢复，请确认'
        },
        request
      )
    }
  }
  map[command]()
}

const getQueue = async () => {
  filterRef.value?.setFieldAttrs('queue_id', {
    loading: true
  })
  try {
    const res = await getMtsQueueApi({})
    const list = res.list ?? []
    const nodeList = list.map(v => ({ label: v.name!, value: v.id! }))
    filterRef.value?.setFieldSchema('queue_id', {
      attrs: {
        options: [{ label: '全部队列', value: '' }].concat(nodeList)
      }
    })
  } finally {
    filterRef.value?.setFieldAttrs('queue_id', {
      loading: false
    })
  }
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
