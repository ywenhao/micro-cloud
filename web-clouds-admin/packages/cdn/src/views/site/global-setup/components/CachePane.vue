<template>
  <div class="mb-4">
    <a-button type="primary" @click="handleCommand('create')">
      添加规则
    </a-button>
  </div>
  <vc-table
    :loading="loading"
    :bordered="false"
    :data="dataSource"
    :columns="columns"
    column-resizable
    @get-list="getTableList"
    :page-data="pagination"
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
        @click="handleCommand('del', record)"
        status="danger"
      >
        移除
      </a-link>
    </template>
  </vc-table>

  <editor-cache
    v-model="editorState.visible"
    v-model:loading="editorState.loading"
    v-model:record="editorState.record"
    @refresh="getTableList"
  ></editor-cache>
</template>

<script setup lang="ts">
import { Message, type TableColumnData } from '@arco-design/web-vue'
import {
  deleteCdnGlobalCacheRuleByIdApi,
  getCdnGlobalCacheRuleListApi
} from '@vca/apis/cdn'
import { cloneDeep } from 'lodash-es'
import { emptyFormatter, useListRequest, VcModal } from 'vc-material'

import EditorCache from './EditorCache.vue'

const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '规则名称',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '164px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'file_ext',
    title: '文件类型',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '164px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'ttl',
    title: '缓存时间',
    cellStyle: { minWidth: '164px' },
    render({ record }) {
      return getTime(record)
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 132,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

const {
  loading,
  pagination,
  data: dataSource,
  run: getTableList
} = useListRequest(getCdnGlobalCacheRuleListApi)

getTableList()

const getTime = (row: any) => {
  const ttl = row.ttl_unit === 1 ? +row.ttl / 3600 : +row.ttl / 86400
  const ttl_unit = row.ttl_unit === 1 ? '小时' : '天'
  return ttl + ttl_unit
}

const editorState = reactive<CommonState<any>>({
  visible: false,
  record: undefined,
  loading: false
})
type ICommand = 'create' | 'del' | 'edit'

/** 事件处理集合 */
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
        deleteCdnGlobalCacheRuleByIdApi({ rule_id: record!.id! }).then(() => {
          Message.success('移除成功')
          getTableList()
        })
      VcModal.error(
        {
          title: '移除所选规则',
          content: '移除该规则后，将不可恢复。'
        },
        request
      )
    }
  }
  actions[command]()
}
</script>
