<template>
  <vc-container admin header-bordered page-title="WAF配置">
    <vc-filter-bar
      class="mb-4"
      v-model="filterState"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
      @search="getTableList"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('add')">
          创建规则
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
      <template #operation="{ record }">
        {{ emptyText(getOperation(record.operation)) }}
      </template>
      <template #expression_template="{ record }">
        {{
          emptyText(generateMatchRuleDescription(record.expression_template))
        }}
      </template>
      <template #node_ids="{ record }">
        <div class="flex items-center">
          <span>{{ getNodeIdsLength(record.node_ids) }}</span>
          <vc-svg-icon
            :size="16"
            name="detail"
            prefix="cdn"
            class="ml-1 cursor-pointer cell-hide"
            v-if="getNodeIdsLength(record.node_ids) > 0"
            @click="handleCommand('node', record)"
          />
        </div>
      </template>
      <template #actions="{ record }">
        <a-link :hoverable="false" @click="handleCommand('edit', record)">
          编辑
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('delete', record)"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </vc-table>
    <edit-rule
      :id="editState.id"
      v-model="editState.visible"
      @submit="getTableList"
    />
    <detail-dialog
      :id="nodeState.id"
      v-model="nodeState.visible"
      :type="nodeState.type"
      @submit="getTableList"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  deleteCdnGlobalWafNodeByIdApi,
  getCdnGlobalWafNodeListApi
} from '@vca/apis/cdn'
import {
  emptyText,
  useListRequest,
  useTable,
  type VcFilterBarScheme,
  type VcFilterBarState,
  VcModal
} from 'vc-material'

import { generateMatchRuleDescription } from '@/components/MatchingRule/utils'

import { columns } from './columns'
import DetailDialog from './components/DetailDialog.vue'
import EditRule from './components/EditRule.vue'
import { OPERATION } from './state'

const filterState = ref<VcFilterBarState>({})
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'op',
      widget: 'select',
      defaultValue: -1,
      attrs: {
        options: [
          { label: '全部操作', value: -1 },
          { label: '允许', value: 0 },
          { label: '阻止', value: 1 }
        ]
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

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnGlobalWafNodeListApi, filterState)

const { tableRef, createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, filterState)

const editState = reactive({
  visible: false,
  id: ''
})
const detailState = reactive({
  visible: false,
  id: ''
})
const nodeState = reactive<{ id: string; type?: number; visible: boolean }>({
  id: '',
  type: undefined, //1:节点 2：站点
  visible: false
})

const getOperation = computed(
  () => (operation: keyof typeof OPERATION) => OPERATION[operation]
)

const getNodeIdsLength = (ids: string) => {
  return ids.split(',').filter(Boolean).length
}
/** 页面操作事件入口，通过策略模式分发事件 */
type ICommand = 'add' | 'edit' | 'delete' | 'detail' | 'node'
const handleCommand = (command: ICommand, record?: any) => {
  const strategies: Strategies<() => void> = {
    add: () => {
      editState.id = ''
      editState.visible = true
    },
    edit: () => {
      editState.id = record?.id as string
      editState.visible = true
    },
    detail: () => {
      detailState.id = record?.id as string
      detailState.visible = true
    },
    delete: () => handleDelete(record?.id as string),
    node: () => {
      nodeState.visible = true
      nodeState.id = record?.node_ids as string
      nodeState.type = 4
    }
  }
  strategies[command] && strategies[command]()
}

/**
 * 删除
 * @param id
 */
const handleDelete = (rule_id: string) => {
  const request = () =>
    deleteCdnGlobalWafNodeByIdApi({ rule_id }).then(() => {
      Message.success('删除成功')
      getTableList()
    })

  VcModal.error(
    {
      title: '删除所选规则',
      content: '删除该规则后，将不可恢复。'
    },
    request
  )
}

onMounted(async () => {
  getTableList()
})
</script>
./state
