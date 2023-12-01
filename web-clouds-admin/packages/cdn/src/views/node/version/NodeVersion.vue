<template>
  <vc-container admin header-bordered page-title="版本管理">
    <vc-filter-bar
      class="mb-4"
      v-model="filterState"
      :schemas="filterBarScheme"
      @search="getTableList"
    >
      <template #prefix>
        <a-button type="primary" @click="commandEvent('UPLOAD')">
          上传版本
        </a-button>
      </template>
    </vc-filter-bar>

    <vc-table
      row-key="id"
      ref="tableRef"
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      column-resizable
      @sorter-change="handleSortChange"
      @get-list="getTableList"
      :page-data="pagination"
      :loading="loading"
    >
      <template #desc="{ record }">
        <version-des-input
          :content="record.desc"
          :on-submit="(v:string) => editRemark(record, v)"
        />
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          :loading="downloadLoading[record.id]"
          @click="commandEvent('DOWNLOAD', record)"
        >
          下载
        </a-link>
        <a-link
          :hoverable="false"
          @click="commandEvent('DELETE', record)"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </vc-table>
    <upload-version-dialog
      v-model="uploadVisible"
      @submit="getTableList()"
      title="上传版本"
      :addRequest="
        ({ file_key, remark: desc }) => addVersionsApi({ file_key, desc })
      "
    />
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  deleteVersionsByIdApi,
  getVersionsDownloadApi,
  getVersionsListApi,
  updateCdnVersionDescApi
} from '@vca/apis/cdn'
import { addVersionsApi } from '@vca/apis/cdn'
import {
  saveFileByURL,
  UploadVersionDialog,
  VersionDesInput
} from '@vca/shared'
import {
  decPageByData,
  useListRequest,
  useTable,
  type VcFilterBarScheme,
  type VcFilterBarState,
  VcModal
} from 'vc-material'

import { columns } from './columns'
// import useFileDownload from './useFileDownload'

const filterState = ref<VcFilterBarState>({})
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'version_keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入版本号'
      }
    }
  ]
}

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getVersionsListApi, filterState)

const { tableRef, createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, filterState)

const uploadVisible = ref(false)
// const { downloadFile } = useFileDownload()

const downloadLoading = reactive<Record<string, boolean>>({})

/** UPLOAD: 上传, DELETE: 删除 */
type ICommand = 'UPLOAD' | 'DOWNLOAD' | 'DELETE'

/** 事件处理集合 */
const commandEvent = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    UPLOAD() {
      uploadVisible.value = true
    },
    async DOWNLOAD() {
      downloadLoading[record?.id!] = true
      try {
        const { file } = await getVersionsDownloadApi({ id: record.id })
        await saveFileByURL(file!)
      } finally {
        downloadLoading[record?.id!] = false
      }
    },
    DELETE() {
      const request = () =>
        deleteVersionsByIdApi({ id: record!.id! }).then(() => {
          decPageByData(pagination, dataSource)
          Message.success('删除成功')
          getTableList()
        })
      VcModal.error(
        {
          title: '删除版本',
          content: '确认删除所选版本？'
        },
        request
      )
    }
  }
  actions[command]()
}

const editRemark = async (record: any, val: string) => {
  await updateCdnVersionDescApi({ id: record.id!, desc: val })
  Message.success('修改成功')
  getTableList()
}

onMounted(getTableList)
</script>
