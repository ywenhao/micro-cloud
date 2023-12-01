<template>
  <vc-filter-bar
    :schemas="filterBarScheme"
    :loading="loading"
    v-model:page="pagination.page"
    @search="getList()"
    v-model="filterData"
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
      is-selection
    >
      <template #pagination-left>
        <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
        <a-button type="outline" :disabled="readBtnDisabled" @click="handleRead"
          >标为已读</a-button
        >
        <a-button
          @click="handleDelete"
          type="outline"
          status="danger"
          :disabled="!selected.length"
          >删除</a-button
        >
        <a-button @click="handleAllRead" type="outline">全部已读</a-button>
        <a-button @click="handleAllDelete" type="outline" status="danger"
          >全部删除</a-button
        >
      </template>
    </vc-table>
  </div>

  <message-detail
    v-model="detailVisible"
    :typeId="typeId || ''"
    :id="checkId"
    @refresh="onRefresh"
  />
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  queryMessageApi,
  updateMessageSysAllApi,
  updateMessageSysApi
} from '@vcp/apis/pedestal'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { SET_HEADER_RIGHT_COUNT } from '@/constants'

import MessageDetail from '../components/MessageDetail.vue'
import { useColumns } from './columns'
import { filterBarScheme } from './filterBarScheme'

const checkId = ref('')
const detailVisible = ref(false)
const typeId = inject('typeId') as ComputedRef<string>
const setHeaderRightCount = inject(SET_HEADER_RIGHT_COUNT)

const columns = useColumns(handleRowClick)

const filterData = ref({
  status: 0,
  title: '',
  content: ''
})

const filterData2 = computed(() => ({
  type_id: typeId.value,
  ...filterData.value
}))

const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(queryMessageApi, filterData2)

getList()

const {
  tableRef,
  checkAll,
  indeterminate,
  selectedKeys,
  selected,
  createSortChange
} = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

const readBtnDisabled = computed(() => {
  if (!selected.value.length) return true
  return selected.value.every(item => +item.read! === 1)
})

const onRefresh = () => {
  const item = tableData.value.find(item => item.id === checkId.value)
  if (item && +item.read! === 1) return

  getList()
  setHeaderRightCount?.()
}

const handleRead = async () => {
  loading.value = true
  try {
    await updateMessageSysApi({
      status: 1,
      type_id: typeId.value,
      message_id_list: selectedKeys.value
    })
    Message.success('操作成功')
    getList()
    setHeaderRightCount?.()
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  const request = () =>
    updateMessageSysApi({
      status: 2,
      type_id: typeId.value,
      message_id_list: selectedKeys.value
    }).then(() => {
      Message.success('删除成功')
      decPageByData(pagination, tableData, selected)
      getList()
      setHeaderRightCount?.()
    })

  VcModal.error(
    {
      title: '确认删除消息',
      content: '确定要删除选中的消息吗？'
    },
    request
  )
}

const handleAllRead = async () => {
  const request = () =>
    updateMessageSysAllApi({
      status: 1,
      type_id: typeId.value
    }).then(() => {
      Message.success('操作成功')
      getList()
      setHeaderRightCount?.()
    })

  VcModal.confirm(
    {
      title: '全部已读',
      content: '您确定要标记全部消息为已读吗？'
    },
    request
  )
}

const handleAllDelete = async () => {
  const request = () =>
    updateMessageSysAllApi({
      status: 2,
      type_id: typeId.value
    }).then(() => {
      Message.success('删除成功')
      pagination.page = 1
      getList()
      setHeaderRightCount?.()
    })

  VcModal.error(
    {
      title: '全部删除',
      content: '确定要删除全部消息吗？'
    },
    request
  )
}

function handleRowClick(row: any) {
  checkId.value = row.id
  detailVisible.value = true
}
</script>
