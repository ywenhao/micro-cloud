<template>
  <vc-filter-bar
    class="mb-4"
    v-model="filterState"
    :refresh="false"
    :schemas="filterBarScheme"
    @search="getTableList"
  >
    <template #prefix>
      <a-button type="primary" @click="commandEvent('CREATE')"
        >创建规则</a-button
      >
    </template>
  </vc-filter-bar>
  <vc-table
    row-key="rule_id"
    ref="tableRef"
    :bordered="false"
    :data="dataSource"
    :columns="columns"
    :draggable="{
      type: 'handle',
      width: 60,
      title: ''
    }"
    column-resizable
    @get-list="getTableList"
    @sorter-change="handleSortChange"
    @change="handleTableChange"
    :page-data="pagination"
    :loading="loading"
  >
    <template #status="{ record }">
      <a-switch
        :model-value="record.status"
        :checked-value="1"
        :unchecked-value="2"
        @change="v => commandEvent('STATUS', record)"
      ></a-switch>
    </template>
    <template #actions="{ record }">
      <a-link :hoverable="false" @click="commandEvent('EDIT', record)">
        编辑
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
  <conversion-edit-rules
    v-model="ruleState.visible"
    :id="ruleState.id"
    :rule_type="ruleState.rule_type"
    @submit="getTableList"
  ></conversion-edit-rules>
</template>

<script setup lang="ts">
import type { TableChangeExtra, TableData } from '@arco-design/web-vue'
import {
  type ConversionRuleItem,
  getCdnSiteTransformRuleListByIdApi,
  updateCdnSiteTransformRuleByIdApi
} from '@vca/apis/cdn'
import { useListRequest, useTable, type VcFilterBarState } from 'vc-material'

import ConversionEditRules from '../components/ConversionEditRules.vue'
import useConversionRules from '../hooks/useConversionRules'
import { columns } from './columns'
import filterBarScheme from './filterBarScheme'
const route = useRoute()
const siteId = route.params.id as string
const filterState = ref<VcFilterBarState>({
  site_id: siteId,
  rule_type: 1
})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnSiteTransformRuleListByIdApi, filterState)
const { ruleState, commandEvent } = useConversionRules(1, getTableList)

const { tableRef, createSortChange } = useTable(dataSource)
const handleSortChange = createSortChange(getTableList, filterState)

/** 表格切换事件 */
const handleTableChange = (data: TableData[], extra: TableChangeExtra) => {
  if (extra.type === 'drag') {
    const row = extra.dragTarget as ConversionRuleItem
    const { rule_id } = row
    const newIndex = data.findIndex(({ rule_id }) => rule_id === row?.rule_id)
    loading.value = true
    updateCdnSiteTransformRuleByIdApi({
      rule_id: rule_id!,
      site_id: siteId,
      rule: { ...row, priority: (newIndex! + 1).toString() }
    })
      .then(() => {
        // Message.success('修改成功')
        getTableList()
      })
      .finally(() => {
        loading.value = false
      })
  }
}

onMounted(getTableList)
</script>
