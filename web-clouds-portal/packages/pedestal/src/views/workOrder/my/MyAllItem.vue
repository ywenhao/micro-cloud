<template>
  <filter-bar
    :loading="loading"
    v-model="filterData"
    @search="getList()"
    :pagination="pagination"
  />

  <div table-box>
    <vc-table
      row-key="id"
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      @sorter-change="handleSortChange"
      @get-list="getList()"
      :page-data="pagination"
      :loading="loading"
      v-model:selectedKeys="selectedKeys"
      :is-selection="active !== '已结单'"
    >
      <template #pagination-left v-if="active !== '已结单'">
        <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
        <a-button type="outline" :disabled="endDisabled" @click="handleEnd()"
          >结单</a-button
        >
      </template>
    </vc-table>
  </div>
  <a-image-preview-group
    infinite
    :srcList="previewState.srcList"
    v-model:visible="previewState.visible"
  />
</template>

<script setup lang="ts">
import { Message, type TableColumnData } from '@arco-design/web-vue'
import {
  queryWorkerOrderListApi,
  updateWorkerOrderEndApi,
  type WorkerOrderModel
} from '@vcp/apis/pedestal'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import FilterBar from '../components/FilterBar.vue'
import type { IActive } from '../MyWorkOrder.vue'
import { useColumns } from './columns'

const router = useRouter()
const active = inject('active') as Ref<IActive>

export type PreviewState = {
  visible: boolean
  srcList: string[]
}

const previewState = reactive<PreviewState>({
  visible: false,
  srcList: []
})

const columns = useColumns({
  previewState,
  handleEnd,
  goTalkPage: handleCellClick
})

const status = computed(() => {
  if (active.value === '全部工单') return undefined
  return active.value === '已结单' ? 2 : 1
})

const filterData = ref({
  product_id: '',
  type_id: '',
  title: ''
})

const filterData2 = computed(() => ({
  state: status.value,
  ...filterData.value
}))

const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(queryWorkerOrderListApi, filterData2)

getList()

const {
  tableRef,
  indeterminate,
  checkAll,
  selectedKeys,
  selected,
  createSortChange
} = useTable(tableData)

const endDisabled = computed(() => {
  if (!selected.value.length) return true
  return selected.value.some(v => v.state === 2)
})

const handleSortChange = createSortChange(getList, filterData)

function handleCellClick(row: WorkerOrderModel, column?: TableColumnData) {
  if (column && column.dataIndex !== 'title') return
  router.push({ name: 'WorkOrderTalk', params: { id: row.id } })
}

async function handleEnd(rows?: WorkerOrderModel[]) {
  const list = (rows || selected.value).filter(v => v.state === 1)
  if (!list.length) {
    Message.error('请选择未结单的工单')
    return
  }

  const ids = list.map(v => v.id!)

  const request = () =>
    updateWorkerOrderEndApi({ id: ids }).then(() => {
      active.value === '处理中' && decPageByData(pagination, tableData, list)
      Message.success('操作成功')
      tableRef.value?.select(ids, false)
      getList()
    })

  VcModal.confirm(
    {
      title: '结单',
      content:
        '结单即表示工单反馈的问题已解决，工单将变为只读状态，确定要结单吗？'
    },
    request
  )
}
</script>
