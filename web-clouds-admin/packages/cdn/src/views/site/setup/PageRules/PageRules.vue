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
      <template #rule="{ record }">
        {{ getDescription(Object.keys(record.rule ?? {})) }}
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
} from '@vca/apis/cdn'
import {
  emptyFormatterUnix,
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
  { title: '优先级', dataIndex: 'priority' },
  { title: '规则名称', dataIndex: 'name' },
  { title: 'URL', dataIndex: 'url' },
  { title: '说明', dataIndex: 'rule', slotName: 'rule' },
  { title: '创建时间', dataIndex: 'created_at', render: emptyFormatterUnix },
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
    del: () => {
      console.log(record)
    }
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

const ruleData = [
  {
    id: '1',
    label: '节点缓存TTL',
    name: 'edge_cache_ttl'
  },
  {
    id: '2',
    label: '缓存级别',
    name: 'cache_level'
  },
  {
    id: '3',
    label: '禁用安全性',
    name: 'disable_security'
  },
  {
    id: '4',
    label: '禁用性能',
    name: 'disable_perf'
  },
  {
    id: '5',
    label: '浏览器缓存TTL',
    name: 'browser_ttl'
  },
  {
    id: '6',
    label: '转发URL',
    name: 'forwarding_url'
  },
  {
    id: '7',
    label: '性能优化',
    name: 'auto_minify'
  },
  {
    id: '8',
    label: 'IP地理位置标头',
    name: 'ip_geolocation_header'
  },
  {
    id: '9',
    label: '真实客户端IP标头',
    name: 'true_client_ip'
  },
  {
    id: '10',
    label: '始终使用HTTPS',
    name: 'always_https'
  }
]
/** 说明数据 */
const getDescription = (keys: string[]) => {
  const arr: string[] = []
  keys.forEach(key => {
    const res = ruleData.find(item => item.name === key)
    if (res) {
      arr.push(res.label)
    }
  })
  console.log(arr)
  return arr.join(', ') || '-'
}
onMounted(getTableList)
</script>
