<template>
  <div>
    <vc-filter-bar
      class="mb-4"
      v-model:page="pagination.page"
      v-model="filterState"
      :refresh="false"
      @search="getTableList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button @click="handleCommand('create')" type="primary">
          创建规则
        </a-button>
      </template>
    </vc-filter-bar>
    <vc-table
      row-key="id"
      ref="tableRef"
      column-resizable
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      :loading="loading"
      :draggable="{
        type: 'handle',
        width: 60
      }"
      @change="handleTableChange"
      :page-data="pagination"
      @get-list="getTableList"
    >
      <template #status="{ record }">
        <a-switch
          :before-change="() => handleChangeStatus(record)"
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
          @click="handleCommand('del', record)"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </vc-table>
    <editor-rules
      @success="getTableList"
      v-model="editorState.visible"
      v-model:record="editorState.record"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Message,
  type TableChangeExtra,
  type TableColumnData,
  type TableData
} from '@arco-design/web-vue'
import {
  getCdnSitePageRuleListByIdApi,
  updateCdnSitePageRuleByIdApi
} from '@vcp/apis/cdn'
import {
  useListRequest,
  useTable,
  type VcFilterBarScheme,
  type VcFilterBarState
} from 'vc-material'

const route = useRoute()

import { cloneDeep } from 'lodash-es'

import EditorRules from './components/EditorRules.vue'

const editorState = reactive<CommonState>({
  visible: false,
  record: undefined
})

const columns: TableColumnData[] = [
  { title: '优先级', dataIndex: 'name' },
  { title: '规则名称', dataIndex: 'ips' },
  { title: 'URL', dataIndex: 'URL' },
  { title: '说明', dataIndex: 'region_name' },
  { title: '创建时间', dataIndex: 'region_name' },
  {
    dataIndex: 'status',
    title: '状态',
    slotName: 'status',
    width: 120
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

const filterState = ref<VcFilterBarState>({
  site_id: route.params.id
})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnSitePageRuleListByIdApi, filterState)

const { tableRef } = useTable(dataSource)

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      widget: 'range',
      attrs: {
        valueFormat: 'X'
      }
    },
    {
      field: 'keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入规则名称'
      }
    }
  ]
}

type ICommand = 'del' | 'edit' | 'create'
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
    del: () => {}
  }
  actions[command]()
}

/** 表格切换事件 */
const handleTableChange = async (
  data: TableData[],
  extra: TableChangeExtra
) => {
  if (extra.type === 'drag') {
    const record = extra.dragTarget
    const newIndex = data.findIndex(item => item?.rule_id === record?.rule_id)
    loading.value = true
    const params = cloneDeep({
      page_rule: {
        ...record,
        priority: String(newIndex + 1),
        rule_id: record?.rule_id,
        site_id: record?.site_id
      },
      rule_id: record?.rule_id,
      site_id: record?.site_id
    })

    try {
      await updateCdnSitePageRuleByIdApi(params as any)
      Message.success('修改成功')
      loading.value = false
      getTableList()
      return true
    } catch (_) {
      loading.value = false
    }
  }
}
/** 状态切换事件 */
const handleChangeStatus = (record: any) => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    const params = cloneDeep({
      page_rule: {
        ...record,
        status: record?.status === 1 ? 2 : 1,
        rule_id: record?.rule_id,
        site_id: record?.site_id
      },
      rule_id: record?.rule_id,
      site_id: record?.site_id
    })
    updateCdnSitePageRuleByIdApi(params)
      .then(() => {
        Message.success(record.status === 1 ? '禁用成功' : '启用成功')
        getTableList()
        resolve(true)
      })
      .finally(() => {
        loading.value = false
      })
      .catch(() => reject(false))
  })
}

onMounted(getTableList)
</script>
