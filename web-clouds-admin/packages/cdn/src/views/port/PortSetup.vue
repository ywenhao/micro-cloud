<template>
  <vc-container admin header-bordered page-title="端口配置">
    <vc-filter-bar class="mb-4">
      <template #prefix>
        <a-button type="primary" @click="commandEvent('CREATE')">
          添加端口
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
      <template #user_count="{ record }">
        <port-user-list
          :record-id="record.id"
          :model-value="record?.user_count ?? 0"
        />
      </template>
      <template #actions="{ record }">
        <a-link :hoverable="false" @click="commandEvent('EDITOR', record)">
          编辑
        </a-link>
        <a-link :hoverable="false" @click="commandEvent('CONFIG', record)">
          配置
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
    <editor-dialog
      @reload="getTableList"
      v-model="editorState.visible"
      v-model:record="editorState.record"
    />
    <conf-dialog v-model="confState.visible" v-model:portId="confState.id" />
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { deleteCdnPortsByIdApi, getCdnPortsListApi } from '@vca/apis/cdn'
import { cloneDeep } from 'lodash-es'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './columns'
import ConfDialog from './components/ConfDialog.vue'
import EditorDialog from './components/EditorDialog.vue'
import PortUserList from './components/PortUserList.vue'

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnPortsListApi)

const { tableRef, createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, {})

const confState = reactive({
  visible: false,
  id: ''
})
const editorState = reactive<CommonState>({
  visible: false,
  record: undefined
})

type ICommand = 'CREATE' | 'EDITOR' | 'DELETE' | 'CONFIG'

/** 事件处理集合 */
const commandEvent = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    CONFIG() {
      confState.visible = true
      confState.id = record?.id
    },
    CREATE() {
      editorState.visible = true
    },
    EDITOR() {
      editorState.record = cloneDeep(record)
      editorState.visible = true
    },
    DELETE() {
      const request = () =>
        deleteCdnPortsByIdApi({ id: record!.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, dataSource)
          getTableList()
        })
      VcModal.error(
        {
          title: '删除端口配置',
          content: '确认删除所选端口配置？'
        },
        request
      )
    }
  }
  actions[command]()
}

onMounted(async () => {
  getTableList()
})
</script>
