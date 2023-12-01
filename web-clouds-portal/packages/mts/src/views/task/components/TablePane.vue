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
        <a-button
          type="primary"
          :disabled="addDisabled"
          @click="handleDo('createTask')"
          >添加任务</a-button
        >
        <a-button type="outline" @click="handleDo('createTrigger')"
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
        <template #actions="{ record }">
          <a-link @click="handleDo('read', record)">查看</a-link>
          <a-link v-if="record.status === 5" @click="handleDo('retry', record)"
            >重新提交</a-link
          >
        </template>
      </vc-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getMtsQueueApi,
  getMtsTaskListApi,
  getMtsTaskVerifyApi,
  type TaskModel,
  updateMtsTaskRetryApi
} from '@vcp/apis/mts'
import { useListRequest, useTable } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const filterRef = ref()
const filterData = ref({
  queue_id: ''
})

const addDisabled = ref(true)
const warningMsg = ref('')

const state = computed(() => ({ ...filterData.value, region_id: props.id }))

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsTaskListApi, state)

// 获取所有队列
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
  getMtsTaskVerifyApi().then(res => {
    addDisabled.value = !res.data?.success
    if (addDisabled.value) {
      warningMsg.value = `${res.message}，若需继续使用请提交工单或联系客服`
    }
  })
  props.id && getList()
}

initData()

onActivated(() => {
  initData()
})

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

type Command = 'createTask' | 'createTrigger' | 'read' | 'retry'
async function handleDo(command: Command, row?: TaskModel) {
  const map: Record<Command, () => void> = {
    createTask() {
      if (warningMsg.value) return Message.warning(warningMsg.value)
      router.push({ name: 'TaskAdd', params: { regionId: props.id } })
    },
    createTrigger() {
      router.push({ name: 'TriggerAdd', params: { regionId: props.id } })
    },
    read() {
      router.push({ name: 'TaskDetail', params: { id: row?.id } })
    },

    retry() {
      // @ts-ignore
      updateMtsTaskRetryApi({ id: row?.id! }).then(() => {
        getList()
      })
    }
  }
  map[command]()
}
</script>
