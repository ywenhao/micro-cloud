<template>
  <vc-container page-title="系统公告">
    <vc-filter-bar
      class="mt-16px"
      :schemas="filterBarScheme"
      :loading="loading"
      v-model:page="pagination.page"
      @search="getList()"
      v-model="filterData"
    />

    <div table-box>
      <vc-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        :loading="loading"
      />
    </div>
    <vc-notice
      v-model:visible="noticeState.visible"
      :list="noticeState.list"
      @open="handleNext"
    />
  </vc-container>
</template>

<script setup lang="ts">
import {
  type NoticeModel,
  queryAnnouncementListApi,
  updateAnnouncementUserApi
} from '@vcp/apis/pedestal'
import { type NoticeItem, useListRequest, useTable } from 'vc-material'

import { useColumns } from './notice/columns'
import { filterBarScheme } from './notice/scheme/filterBarScheme'

const appStore = useAppStore()

const filterData = ref({
  status: 0,
  title: '',
  content: ''
})

const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(queryAnnouncementListApi, filterData)

getList()

const { createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

const noticeState = reactive({
  visible: false,
  list: [] as NoticeItem[]
})

const handleRowClick = (row: NoticeModel) => {
  noticeState.list = [row as NoticeItem]
  noticeState.visible = true
}

const columns = useColumns(handleRowClick)

const handleNext = (index: number = 0) => {
  const item = noticeState.list[index] as NoticeModel

  if (appStore.noticeReportedList.includes(item.id!)) return
  updateAnnouncementUserApi({ announcement_id_list: [item.id!] })
  appStore.noticeReportedList.push(item.id!)
}
</script>

<style lang="less" scoped>
:deep(.vc-container__content) {
  display: flex;
  flex-direction: column;
}
</style>
