<template>
  <vc-container header-bordered admin page-title="版本管理">
    <vc-filter-bar
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('upload')"
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
            :on-submit="(v:string) => editRemark(record, v)"
          />
        </template>
        <template #actions="{ record }">
          <a-link
            @click="handleCommand('download', record)"
            :loading="downloadLoading[record.id]"
            >下载</a-link
          >
          <a-link status="danger" @click="handleCommand('delete', record)"
            >删除</a-link
          >
        </template>
      </vc-table>
    </div>
    <upload-version-dialog
      @submit="getList()"
      :add-request="addMtsVersionApi"
      v-model="uploadState.visible"
    ></upload-version-dialog>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  addMtsVersionApi,
  deleteMtsVersionApi,
  getMtsVersionApi,
  getMtsVersionDownloadApi,
  updateMtsVersionApi
} from '@vca/apis/mts'
import type { VersionModel } from '@vca/apis/src/mts/model'
import {
  saveFileByURL,
  UploadVersionDialog,
  VersionDesInput
} from '@vca/shared'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import { filterBarScheme } from './scheme'

const filterData = reactive({})

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsVersionApi, filterData)
const { tableRef, createSortChange } = useTable<VersionModel[]>(tableData)

const handleSortChange = createSortChange(getList, filterData)
const uploadState = reactive({
  visible: false
})

const downloadLoading = reactive<Record<string, boolean>>({})

type Command = 'download' | 'delete' | 'upload'
const handleCommand = (command: Command, record?: VersionModel) => {
  const map: Record<Command, () => void> = {
    upload() {
      uploadState.visible = true
    },
    async download() {
      downloadLoading[record?.id!] = true
      try {
        const { path } = await getMtsVersionDownloadApi({ id: record?.id! })
        await saveFileByURL(path!)
      } finally {
        downloadLoading[record?.id!] = false
      }
    },
    delete() {
      const request = () =>
        deleteMtsVersionApi({ id: record?.id! }).then(() => {
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
  }
  map[command]()
}

const editRemark = async (record: VersionModel, v: string) => {
  const data = {
    id: record.id!,
    remark: v
  }
  await updateMtsVersionApi(data)
  Message.success('修改成功')
  getList()
}

onMounted(() => {
  getList()
})
</script>
