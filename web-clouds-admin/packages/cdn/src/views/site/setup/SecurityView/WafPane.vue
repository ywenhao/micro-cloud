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
    @change="handleTableChange"
    @sorter-change="handleSortChange"
    @get-list="getTableList"
    :page-data="pagination"
    :loading="loading"
  >
    <template #status="{ record }">
      <a-switch
        :model-value="record.is_enable"
        :checkedValue="1"
        :uncheckedValue="2"
        @Change="v => commandEvent('STATUS', record)"
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
  <edit-rule
    v-model="ruleState.visible"
    :id="ruleState.id"
    @submit="getTableList"
  ></edit-rule>
</template>

<script setup lang="ts">
import {
  Message,
  type TableChangeExtra,
  type TableData
} from '@arco-design/web-vue'
import {
  deleteCdnSiteWafRuleByIdApi,
  getCdnSiteWafRuleListByIdApi,
  updateCdnSiteWafRuleByIdApi
} from '@vca/apis/cdn'
import type { WafRuleItem } from '@vca/apis/src/cdn/model'
import { omit } from 'lodash-es'
import {
  useListRequest,
  useTable,
  type VcFilterBarScheme,
  type VcFilterBarState,
  VcModal
} from 'vc-material'

import EditRule from '../components/EditRule.vue'
import { columns } from './columns'
const route = useRoute()
const siteId = route.params.id as string
const filterState = ref<VcFilterBarState>({
  site_id: siteId,
  op: -1
})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnSiteWafRuleListByIdApi, filterState)

const { tableRef, createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, filterState)

const ruleState = reactive<any>({
  id: undefined,
  visible: false
})
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'start_time',
      widget: 'range',
      attrs: {
        valueFormat: 'X'
      }
    },
    {
      field: 'op',
      widget: 'select',
      attrs: {
        defaultValue: -1,
        options: [
          { label: '全部执行策略', value: -1 },
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

type ICommand = 'EDIT' | 'DELETE' | 'CREATE' | 'STATUS'

/** 事件处理集合 */
const commandEvent = (command: ICommand, record?: WafRuleItem) => {
  const actions: Record<ICommand, () => void> = {
    CREATE() {
      ruleState.id = undefined
      ruleState.visible = true
    },
    EDIT() {
      ruleState.id = record?.rule_id ?? ''
      ruleState.visible = true
    },
    STATUS() {
      const data = {
        rule_id: record?.rule_id ?? '',
        site_id: record?.site_id ?? '',
        rule: {
          ...omit(record, 'is_enable'),
          // @ts-ignore
          is_enable: record?.is_enable === 1 ? 2 : 1
        }
      }

      updateCdnSiteWafRuleByIdApi(data as any).then(() => {
        // @ts-ignore
        Message.success(record?.is_enable === 2 ? '开启成功' : '关闭成功')
        getTableList()
      })
    },
    DELETE() {
      // const request = () =>
      //   adminDeleteApi({ id: record!.id! }).then(() => {
      //     decPageByData(pagination, dataSource, selectedKeys)
      //     Message.success('删除成功')
      //     getTableList()
      //   })
      VcModal.error(
        {
          title: '删除规则',
          content: '确认删除所选规则？'
        },
        () => {
          const data = {
            site_id: record?.site_id ?? '',
            rule_id: record?.rule_id ?? ''
          }
          return deleteCdnSiteWafRuleByIdApi(data).then(() => {
            Message.success('删除成功')
            getTableList()
          })
        }
        // request
      )
    }
  }
  actions[command]()
}

/** 表格切换事件 */
const handleTableChange = (data: TableData[], extra: TableChangeExtra) => {
  if (extra.type === 'drag') {
    const row = extra.dragTarget as WafRuleItem
    const { rule_id } = row
    const newIndex = data.findIndex(({ rule_id }) => rule_id === row?.rule_id)
    loading.value = true
    updateCdnSiteWafRuleByIdApi({
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
