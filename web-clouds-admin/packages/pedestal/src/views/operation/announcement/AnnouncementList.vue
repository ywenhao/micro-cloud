<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  announcementDelApi,
  announcementListApi,
  type AnnouncementModel,
  announcementUpdateApi
} from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
import { decPageByData, useListRequest, VcModal } from 'vc-material'

import columns from './columns'
import DetailDrawer from './components/DetailDrawer.vue'
import EditorDrawer from './components/EditorDrawer.vue'
import filterBarScheme from './filterBarScheme'

const editorState = reactive({
  visible: false,
  record: undefined,
  loading: false
})
const detailState = reactive({
  visible: false,
  record: undefined,
  loading: false
})
type ICommand = 'del' | 'create' | 'edit' | 'detail'
const handleCommand = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    create: () => {
      editorState.record = undefined
      editorState.visible = true
    },
    edit: () => {
      editorState.record = cloneDeep(record)
      editorState.visible = true
    },
    del: () => {
      const request = () =>
        announcementDelApi({ id: record!.id }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, dataSource)
          getTableList()
        })
      VcModal.error(
        {
          title: '删除公告',
          content: '删除公告后，用户将无法查看该公告，确定要删除吗？'
        },
        request
      )
    },
    detail: () => {
      detailState.record = cloneDeep(record)
      detailState.visible = true
    }
  }
  actions[command]()
}

const state = ref({})
const {
  pagination,
  arcoPagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(announcementListApi, state, {
  showPageSize: true,
  showTotal: true
})
const handleSearch = () => {
  getTableList()
}

/** 状态切换事件 */
const handleChangeStatus = (record: AnnouncementModel) => {
  const request = () => {
    loading.value = true
    return new Promise<void>((resolve, reject) => {
      loading.value = true
      announcementUpdateApi({
        ...record,
        status: record.status === 1 ? 2 : 1
      })
        .then(() => {
          Message.success(record?.status === 1 ? '禁用成功' : '启用成功')
          getTableList()
          resolve()
        })
        .catch(() => reject())
        .finally(() => {
          loading.value = false
        })
    })
  }

  if (record.status !== 1) {
    request()
  } else {
    VcModal.confirm(
      {
        title: '确认禁用公告',
        content: '确定要禁用该公告吗？'
      },
      request
    )
  }
}

const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
  getTableList()
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  state.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  state.value.sort = direction ? dataIndex : undefined
  getTableList()
}
onMounted(() => {
  getTableList()
})
</script>

<template>
  <vc-container admin page-title="系统公告" header-bordered>
    <vc-filter-bar
      class="mb-4"
      :loading="loading"
      @update:page="handlePageChange"
      v-model="state"
      @search="handleSearch"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('create')">
          新建
        </a-button>
      </template>
    </vc-filter-bar>
    <a-table
      :loading="loading"
      :bordered="false"
      :columns="columns"
      column-resizable
      :data="dataSource"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @sorter-change="handleSorterChange"
    >
      <template #status="{ record }">
        <a-switch
          @change="handleChangeStatus(record)"
          :model-value="record.status"
          inlinePrompt
          :unchecked-value="2"
          :checked-value="1"
        ></a-switch>
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          @click="handleCommand('edit', record)"
          type="primary"
        >
          编辑
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('detail', record)"
          type="primary"
        >
          详情
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('del', record)"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </a-table>

    <!-- 新建/编辑 -->
    <editor-drawer
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      @reload="getTableList"
    ></editor-drawer>
    <!-- 详情 -->
    <detail-drawer
      v-model="detailState.visible"
      v-model:loading="detailState.loading"
      v-model:record="detailState.record"
    ></detail-drawer>
  </vc-container>
</template>
