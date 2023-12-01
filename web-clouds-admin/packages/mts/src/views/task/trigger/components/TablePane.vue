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
        <template #status="{ record }">
          <a-switch
            v-model="record.status"
            :checked-value="1"
            :unchecked-value="2"
            @change="(v:string|number|boolean) => handleStatus(v,record)"
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
} from '@vca/apis/mts'
import { regionListApi } from '@vca/apis/oss'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const filterRef = ref()

const filterData = ref({
  region_id: ''
})

const state = computed(() => ({
  ...filterData.value
}))

const router = useRouter()

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsTriggerApi, state)

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

const handleStatus = (v: string | number | boolean, record: TriggerModel) => {
  const data = {
    id: record.id!,
    status: v as number
  }
  updateMtsTriggerStatusApi(data).then(() => {
    Message.success(v === 1 ? '开启成功' : '禁用成功')
    getList()
  })
}
const handleCommand = (command: 'details' | 'delete', record: TriggerModel) => {
  const map: Record<typeof command, () => void> = {
    details() {
      router.push({ name: 'TaskTriggerDetail', params: { id: record.id } })
    },
    delete() {
      const request = () =>
        deleteMtsTriggerApi({ id: record.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, tableData)
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

async function handleFilter(row: TriggerModel) {
  filterRef.value?.setFieldValue('user_id', row.user_id)
  getList()
}

const getQueue = async () => {
  const res = await getMtsQueueApi({})
  const list = res.list ?? []
  filterRef.value?.setFieldSchema('queue_id', {
    attrs: {
      options: [{ label: '全部队列', value: '0' }].concat(
        list.map(v => ({ label: v.name!, value: v.id! }))
      )
    }
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
