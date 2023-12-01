<template>
  <div class="table-pane">
    <vc-filter-bar
      ref="filterBarRef"
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
          <a-link @click="handleDo('read', record)">查看</a-link>
          <a-link v-if="record.status === 5" @click="handleDo('retry', record)"
            >重试</a-link
          >
          <a-link
            v-if="![4, 5].includes(record.status)"
            status="danger"
            @click="handleDo('stop', record)"
            >终止</a-link
          >
        </template>
      </vc-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getMtsNodeApi,
  getMtsTaskListApi,
  type TaskModel,
  updateMtsTaskApi,
  updateMtsTaskRetryApi
} from '@vca/apis/mts'
import { regionListApi } from '@vca/apis/oss'
import { useListRequest, useTable, VcModal } from 'vc-material'
import type { ComboInputOptions } from 'vc-material/components/combo-input/props'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const router = useRouter()
const route = useRoute()
const filterBarRef = ref()
const filterData = ref({
  user_id: '',
  node_id: '',
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
} = useListRequest(getMtsTaskListApi, state)
loading.value = true

async function getRegions() {
  filterBarRef.value?.setFieldAttrs('region_id', { loading: true })
  try {
    const res = await regionListApi({})
    const list = (res.list || []).map(v => ({ value: v.id!, label: v.name! }))
    if (!list.length) {
      return Message.error('区域列表为空')
    }
    filterData.value.region_id = list[0].value
    filterBarRef.value?.setFieldAttrs('region_id', { options: list })
    filterBarRef.value?.setFieldValue('region_id', list[0].value)
  } finally {
    filterBarRef.value?.setFieldAttrs('region_id', { loading: false })
  }
}

// 获取所有节点
const getNode = () => {
  let nodeList: ComboInputOptions[] = [{ label: '全部节点', value: '' }]
  filterBarRef.value?.setFieldAttrs('node_id', { loading: true })

  getMtsNodeApi({})
    .then(res => {
      const list = res.list ?? []
      filterBarRef.value?.setFieldAttrs('node_id', {
        options: nodeList.concat(
          list.map(v => ({ label: v.name!, value: v.id! }))
        )
      })
    })
    .finally(() => {
      filterBarRef.value?.setFieldAttrs('node_id', { loading: false })
    })
}

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

type Command = 'read' | 'stop' | 'retry'
async function handleDo(command: Command, row: TaskModel) {
  const map: Record<Command, () => void> = {
    read() {
      router.push({ name: 'TaskManageDetail', params: { id: row.id } })
    },
    stop() {
      const data = {
        id: row.id!,
        status: 5
      }
      const request = () =>
        updateMtsTaskApi(data).then(() => {
          Message.success('操作成功')
          getList()
        })
      VcModal.confirm(
        {
          title: '终止任务',
          content: '确定终止任务吗？'
        },
        request
      )
    },
    retry() {
      const data = { id: row.id!, node_id: undefined }
      updateMtsTaskRetryApi(data).then(() => {
        getList()
      })
    }
  }
  map[command]()
}

async function handleFilter(row: TaskModel) {
  filterBarRef.value?.setFieldAttrs('keywords', {
    defaultSelected: ''
  })
  await nextTick()
  filterBarRef.value?.setFieldAttrs('keywords', {
    defaultSelected: 'user_id'
  })
  filterBarRef.value?.setFieldValue('user_id', row.user_id)
  getList()
}

onActivated(async () => {
  if (route.query?.user_id) {
    filterBarRef.value?.setFieldAttrs('keywords', {
      defaultSelected: ''
    })
    await nextTick()
    filterBarRef.value?.setFieldAttrs('keywords', {
      defaultSelected: 'user_id'
    })
    filterBarRef.value?.setFieldValue('user_id', route.query?.user_id)
  }
  if (route.query.node_id) {
    filterBarRef.value?.setFieldValue('node_id', route.query?.node_id)
  }

  getNode()
  await getRegions()

  if (!filterData.value.region_id) return
  await getList()

  const { user_id, node_id } = route.query || {}
  if (user_id || node_id) {
    const query = { ...route.query, user_id: void 0, node_id: void 0 }
    router.replace({ ...route, query })
  }
})
</script>
