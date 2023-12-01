<script setup lang="tsx">
import {
  Message,
  type TableChangeExtra,
  type TableColumnData,
  type TableData,
  type TableInstance
} from '@arco-design/web-vue'
import {
  delWorkerOrderTypeApi,
  type ProductModel,
  productUpdateIndexApi,
  updateWorkerOrderTypeApi,
  workerOrderProductListApi,
  workerOrderTypeListApi
} from '@vca/apis/pedestal'
import { cloneDeep, has } from 'lodash-es'
import { useListRequest, type VcFilterBarScheme, VcModal } from 'vc-material'

import EditorType from './EditorType.vue'

const filterBarRef = ref()
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'product_id',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        placeholder: '请选择',
        options: [{ value: '0', label: '全部产品' }]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name',
        options: [
          { label: '类型名称', value: 'name' },
          { label: '类型ID', value: 'id' }
        ]
      }
    }
  ]
}
const tableRef = ref<TableInstance>()
const editorState = reactive<CommonState<ProductModel>>({
  visible: false,
  record: undefined,
  loading: false
})
const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '类型名称',
    cellStyle: { minWidth: '200px' },
    render: ({ record }) => <span>{record.product_name || record?.name}</span>
  },
  {
    dataIndex: 'id',
    title: '类型ID',
    cellStyle: { minWidth: '230px' },
    render: ({ record }) => <span>{record?.product_name ? '' : record.id}</span>
  },
  {
    dataIndex: 'sort',
    title: '排序',
    cellStyle: { minWidth: '120px' }
  },

  {
    dataIndex: 'status',
    title: '状态',
    slotName: 'status',
    width: 120
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 130,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
const state = ref({})
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
      const request = () =>
        delWorkerOrderTypeApi({ id: record.id }).then(() => {
          Message.success('删除成功')
          getTableList()
        })
      VcModal.error(
        {
          title: '删除类型',
          content: '确定要删除该类型吗？'
        },
        request
      )
    }
  }
  actions[command]()
}

const dataSource = computed(() => {
  return data.value.map((item: any) => ({
    ...item,
    children: item.type_list,
    id: item.product_id
  }))
})

const {
  loading,
  run: getTableList,
  data
} = useListRequest(workerOrderTypeListApi, state)

const products = ref<{ product_id: string; product_name: string }[]>([])
const getProducts = () => {
  workerOrderProductListApi({ status: 2 }).then(res => {
    const data = (res?.list || []) as {
      product_id: string
      product_name: string
    }[]
    products.value = data
    const options = data.map(({ product_id, product_name }) => {
      return {
        value: product_id,
        label: product_name
      }
    })

    filterBarRef.value?.setFieldSchema('product_id', {
      attrs: { options: [{ label: '全部类型', value: '0' }].concat(...options) }
    })
  })
}
const handleSearch = () => {
  getTableList()
}

/** 表格切换事件 */
const handleTableChange = (data: TableData[], extra: TableChangeExtra) => {
  if (extra.type === 'drag') {
    const { id } = extra.dragTarget as ProductModel
    const newIndex = data.findIndex(({ id }) => id === extra.dragTarget?.id)
    loading.value = true
    productUpdateIndexApi({ id: id!, index: newIndex! + 1 })
      .then(() => {
        Message.success('修改成功')
        getTableList()
      })
      .finally(() => {
        loading.value = false
      })
  }
}

/** 状态切换事件 */
const handleChangeStatus = (record: any) => {
  const request = () => {
    return new Promise<void>((resolve, reject) => {
      loading.value = true
      updateWorkerOrderTypeApi({
        ...record,
        status: record?.status === 1 ? 2 : 1
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
        title: '确认禁用工单类型',
        content: '确定要禁用该工单类型吗？'
      },
      request
    )
  }
}

onMounted(async () => {
  getProducts()
  await getTableList()
  tableRef.value?.expandAll()
})
</script>

<template>
  <vc-container admin page-title="工单类型" header-bordered>
    <vc-filter-bar
      class="mb-4"
      ref="filterBarRef"
      v-model="state"
      :schemas="filterBarScheme"
      @search="handleSearch"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('create')">
          新建
        </a-button>
      </template>
    </vc-filter-bar>
    <a-table
      row-key="id"
      ref="tableRef"
      :loading="loading"
      @change="handleTableChange"
      :columns="columns"
      :hoverable="false"
      :bordered="false"
      column-resizable
      :pagination="false"
      :data="dataSource"
      :row-class="({ isLeaf }) => (isLeaf ? 'sub-arco-tr' : '')"
    >
      <template #icon="{ record }">
        <vc-image :width="32" :height="32" :src="record?.icon" />
      </template>
      <template #status="{ record }">
        <a-switch
          v-if="has(record, 'sort')"
          @change="handleChangeStatus(record)"
          :model-value="record.status"
          inlinePrompt
          :unchecked-value="2"
          :checked-value="1"
        ></a-switch>
      </template>
      <template #actions="{ record }">
        <template v-if="has(record, 'sort')">
          <a-link
            :hoverable="false"
            @click="handleCommand('edit', record)"
            type="primary"
          >
            编辑
          </a-link>
          <a-link
            :disabled="record?.status === 1"
            :hoverable="false"
            @click="handleCommand('del', record)"
            status="danger"
          >
            删除
          </a-link>
        </template>
      </template>
    </a-table>
    <editor-type
      :products="products"
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      @reload="getTableList"
    ></editor-type>
  </vc-container>
</template>
