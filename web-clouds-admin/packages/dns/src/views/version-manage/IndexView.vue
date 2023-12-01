<template>
  <vc-container page-title="版本管理" header-bordered admin>
    <vc-filter-bar
      ref="filterBarRef"
      :loading="loading"
      v-model="filterData"
      v-model:page="pagination.page"
      @search="getList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button
          class="upload-btn"
          type="primary"
          @click="handleUploadNewVersion"
          >上传版本</a-button
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
        <template #remark="{ record }">
          <version-des-input
            :content="record.remark"
            :on-submit="e => handleEditRemark(record, e)"
          />
        </template>
        <template #actions="{ record }">
          <a-link
            @click="handleDownload(record)"
            :loading="downloadLoading[record.id]"
            >下载</a-link
          >
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>
    <upload-version-dialog
      @submit="getList()"
      :add-request="addDnsNodeVersionApi"
      v-model="newVersionDialogVisible"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  addDnsNodeVersionApi,
  deleteDnsNodeVersionApi,
  getDnsNodeVersionsListApi,
  getDnsNodeVersionUrlApi,
  type NodeVersionModel,
  updateDnsNodeVersionApi
} from '@vca/apis/dns'
import {
  saveFileByURL,
  UploadVersionDialog,
  VersionDesInput
} from '@vca/shared'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const filterBarRef = ref()

const filterData = ref({})

const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(getDnsNodeVersionsListApi, filterData)

getList()

const { tableRef, createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

function handleDelete(row: NodeVersionModel) {
  const request = () =>
    deleteDnsNodeVersionApi({ id: row?.id! }).then(() => {
      Message.success('删除成功')
      decPageByData(pagination, tableData)
      getList()
    })
  VcModal.error(
    {
      title: '删除当前版本',
      content: '删除后不可恢复，是否确定删除？'
    },
    request
  )
}

async function handleEditRemark(row: NodeVersionModel, content: string) {
  await updateDnsNodeVersionApi({
    id: row.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

const newVersionDialogVisible = ref(false)
async function handleUploadNewVersion() {
  newVersionDialogVisible.value = true
}

const downloadLoading = reactive<Record<string, boolean>>({})
async function handleDownload(record: NodeVersionModel) {
  downloadLoading[record?.id!] = true
  try {
    const { url } = await getDnsNodeVersionUrlApi({ id: record?.id! })
    await saveFileByURL(url!)
  } finally {
    downloadLoading[record?.id!] = false
  }
}
</script>
