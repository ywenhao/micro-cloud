<template>
  <vc-filter-bar
    class="mb-4"
    v-model="filterState"
    :schemas="filterBarScheme"
    @search="getTableList"
  >
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
    v-model:selectedKeys="selectedKeys"
    is-selection
  >
    <template #pagination-left>
      <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
      <a-button
        @click="wafNodeBatchByIdApi"
        type="outline"
        :disabled="!selectedKeys.length"
      >
        批量取消部署
      </a-button>
    </template>
    <template #deploy="{ record }">
      <a-badge
        v-if="record.deploy === 1"
        status="success"
        class="deploy-badge"
        text="已部署"
      />
      <template v-else>未部署</template>
    </template>
    <template #actions="{ record }">
      <a-link
        :hoverable="false"
        @click="handleViewRecord(record)"
        type="primary"
      >
        查看规则
      </a-link>
    </template>
  </vc-table>
  <rule-details
    v-model="detailState.visible"
    v-model:record="detailState.record"
  />
</template>

<script setup lang="ts">
import { Message, type TableColumnData } from '@arco-design/web-vue'
import {
  getCdnGlobalWafNodeListApi,
  updateCdnGlobalWafNodeBatchByIdApi
} from '@vca/apis/cdn'
import {
  useListRequest,
  useTable,
  type VcFilterBarScheme,
  type VcFilterBarState
} from 'vc-material'

import RuleDetails from './RuleDetails.vue'

const route = useRoute()
const filterState = ref<VcFilterBarState>({
  node_id: route.params?.id
})
const detailState = reactive<CommonState>({
  visible: false,
  record: undefined
})
const handleViewRecord = (record: any) => {
  detailState.visible = true
  detailState.record = record
}
/**
 * 生成匹配规则模板描述
 * @param template
 * @returns
 */
const generateMatchRuleDescription = (template: string) => {
  const arr = JSON.parse(template)
  const sets = new Set()
  arr.forEach((item: any) => {
    item.rules.forEach((rule: any) => {
      sets.add(rule.field)
    })
  })
  const fields = Array.from(sets).map(filed => {
    const config = getFieldConfig(filed as string)
    return config ? config.label : ''
  })
  return fields.join(', ')
}

const wafNodeBatchByIdApi = () => {
  updateCdnGlobalWafNodeBatchByIdApi({
    node_id: filterState.value.node_id,
    rule_ids: selectedKeys.value,
    status: 2
  }).then(() => {
    Message.success('批量取消部署成功')
    getTableList()
  })
}

const columns: TableColumnData[] = [
  { title: '规则名称', dataIndex: 'name' },
  {
    title: '执行策略',
    dataIndex: 'operation',
    render({ record }) {
      return record?.operation === 0 ? '允许' : '阻止'
    }
  },
  {
    title: '描述',
    dataIndex: 'expression_template',
    render({ record }) {
      return generateMatchRuleDescription(record?.expression_template)
    }
  },
  {
    title: '部署状态',
    dataIndex: 'deploy',
    slotName: 'deploy'
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 146,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnGlobalWafNodeListApi, filterState)

const { tableRef, selectedKeys, createSortChange, checkAll, indeterminate } =
  useTable(dataSource)

const handleSortChange = createSortChange(getTableList, filterState)

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'rule_name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入规则名称'
      }
    }
  ]
}

onMounted(getTableList)
</script>

<style lang="less" scoped>
.deploy-badge {
  :deep(.arco-badge-status-text) {
    @apply text-success!;
  }
}
</style>
