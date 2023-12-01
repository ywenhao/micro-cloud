<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  messageDelApi,
  messageListApi,
  type MessageModel,
  type MessageTypeModel,
  messageTypesApi
} from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
import {
  decPageByData,
  useListRequest,
  type VcFilterBarInstance,
  VcModal
} from 'vc-material'
import { onMounted, reactive, ref } from 'vue'

import columns from './columns'
import DetailDrawer from './components/DetailDrawer.vue'
import EditorDrawer from './components/EditorDrawer.vue'
import filterBarScheme from './filterBarScheme'

const filterBarRef = ref<VcFilterBarInstance>()
const editorState = reactive<CommonState<MessageModel>>({
  visible: false,
  record: undefined,
  loading: false
})
const detailState = reactive<CommonState<MessageModel>>({
  visible: false,
  record: undefined,
  loading: false
})

type ICommand = 'del' | 'create' | 'edit' | 'detail'
const handleCommand = (command: ICommand, record?: MessageModel) => {
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
        messageDelApi({ id: record!.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, dataSource)
          getTableList()
        })
      VcModal.error(
        {
          title: '确认删除消息',
          content: '删除消息后，用户将无法查看该消息，确定要删除吗？'
        },
        request
      )
    },
    detail: () => {
      detailState.record = record!
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
} = useListRequest(messageListApi, state, {
  showPageSize: true,
  showTotal: true
})

const messageTypes = ref<MessageTypeModel[]>([])
const getTypeList = () => {
  filterBarRef.value?.setFieldAttrs('type_id', {
    loading: true
  })
  messageTypesApi({})
    .then(res => {
      const data = (res?.list || []) as MessageTypeModel[]
      messageTypes.value = data
      const options = data.map(item => ({
        label: item.type_name,
        value: item.id
      }))

      filterBarRef.value?.setFieldSchema('type_id', {
        attrs: {
          options: [{ label: '全部类型', value: 0 }].concat(...options)
        }
      })
    })
    .finally(() => {
      filterBarRef.value?.setFieldAttrs('type_id', {
        loading: false
      })
    })
}
const handleSearch = () => {
  getTableList()
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
  getTypeList()
})
</script>

<template>
  <vc-container admin page-title="消息通知" header-bordered>
    <vc-filter-bar
      class="mb-4"
      ref="filterBarRef"
      :loading="loading"
      @update:page="handlePageChange"
      @search="handleSearch"
      v-model="state"
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
      column-resizable
      :bordered="false"
      :columns="columns"
      :data="dataSource"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @sorter-change="handleSorterChange"
      @page-size-change="handlePageSizeChange"
    >
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
      :types="(messageTypes as MessageTypeModel[])"
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      @reload="getTableList"
      @reload-types="getTypeList"
    ></editor-drawer>
    <!-- 详情 -->
    <detail-drawer
      v-model="detailState.visible"
      v-model:loading="detailState.loading"
      v-model:record="detailState.record"
    ></detail-drawer>
  </vc-container>
</template>
