<script setup lang="tsx">
import {
  Message,
  type TableChangeExtra,
  type TableColumnData,
  type TableData,
  type TableInstance
} from '@arco-design/web-vue'
import {
  guideDeleteApi,
  guideListApi,
  type GuideModel,
  guideUpdateIndexApi
} from '@vca/apis/pedestal'
import {
  emptyFormatter,
  sortableSettings,
  useListRequest,
  VcModal
} from 'vc-material'

import filterBarScheme from './filterBarScheme'

const columns: TableColumnData[] = [
  {
    dataIndex: 'draggable',
    title: '排序',
    width: 60,
    align: 'center',
    slotName: 'draggable'
  },
  {
    dataIndex: 'title',
    title: '文档标题',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '167px' }
  },
  {
    dataIndex: 'document_type',
    title: '类型',
    width: 157,
    render: ({ record }) =>
      record?.document_type === 1 ? '产品文档' : '常见问题'
  },
  {
    dataIndex: 'product_name',
    title: '所属产品',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter,
    cellStyle: { minWidth: '146px' }
  },
  {
    dataIndex: 'parent_name',
    title: '分类/子类',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '146px' },
    render: ({ record }) => {
      let categories = []
      try {
        categories = JSON.parse(record.parent_name).map(
          (item: any) => item.name
        )
      } catch (_) {
        categories = []
      }
      if (categories.length === 0) return '-'
      return <span>{categories.join(' / ')}</span>
    }
  },
  {
    dataIndex: 'updated_at',
    title: '更新时间',
    width: 190,
    sortable: sortableSettings,
    render: ({ record }) => (
      <span v-uts={record?.updated_at || record?.created_at}></span>
    )
  },
  {
    dataIndex: 'create_account',
    title: '创建人',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '96px' }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 110,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
const router = useRouter()
const selectedKeys = ref<string[]>([])
const isCheckedAll = ref(false)
const state = ref({})
const tableRef = ref<TableInstance>()

const {
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(guideListApi, state)

const handleSearch = () => {
  getTableList()
}

onActivated(() => {
  getTableList()
})

type ICommand = 'del' | 'detail' | 'create' | 'batchRemove'

const handleCommand = (command: ICommand, record?: GuideModel) => {
  const actions: Record<ICommand, () => void> = {
    create: () => router.push({ name: 'OperationForGuideAdd' }),
    detail: () =>
      router.push({
        name: 'OperationForGuideDetails',
        params: { id: record?.document_id }
      }),
    del: () => handleRemoveDocs([record!.id!]),
    batchRemove() {
      handleRemoveDocs(selectedKeys.value)
    }
  }
  actions[command]()
}

/** 表格切换事件 */
const handleTableChange = (data: TableData[], extra: TableChangeExtra) => {
  if (extra.type === 'drag') {
    const { id } = extra.dragTarget as GuideModel
    const newIndex = data.findIndex(({ id }) => id === extra.dragTarget?.id)
    loading.value = true
    guideUpdateIndexApi({ id: id!, index: newIndex! + 1 })
      .then(() => {
        Message.success('修改成功')
        getTableList()
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  state.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  state.value.sort = direction ? dataIndex : undefined
  getTableList()
}

const handleRemoveDocs = (id_list: string[]) => {
  const request = () =>
    guideDeleteApi({ id_list }).then(() => {
      Message.success('移除成功')
      tableRef.value?.selectAll(false)
      getTableList()
    })
  VcModal.error(
    {
      title: '移除文档',
      content: '确定要从新手指南中移除文档吗？'
    },
    request
  )
}

watchEffect(() => {
  isCheckedAll.value =
    dataSource.value.length > 0 &&
    selectedKeys.value.length === dataSource.value.length
})
const handleCheckAll = (value: boolean | (string | number | boolean)[]) => {
  tableRef.value?.selectAll(!!value)
}
</script>

<template>
  <vc-container admin page-title="新手使用指南" header-bordered>
    <vc-filter-bar
      class="mb-4"
      :loading="loading"
      @search="handleSearch"
      v-model="state"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button @click="handleCommand('create')" type="primary">
          新建
        </a-button>
      </template>
    </vc-filter-bar>
    <a-table
      ref="tableRef"
      row-key="id"
      :row-selection="{
        type: 'checkbox',
        fixed: true,
        showCheckedAll: true,
        onlyCurrent: false
      }"
      v-model:selectedKeys="selectedKeys"
      :loading="loading"
      :columns="columns"
      :draggable="{}"
      @change="handleTableChange"
      @sorter-change="handleSorterChange"
      :bordered="false"
      column-resizable
      :pagination="false"
      :data="dataSource"
    >
      <template #draggable>
        <vc-svg-icon
          class="vc-icon-button cursor-move!"
          :size="18"
          name="draggable"
        ></vc-svg-icon>
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          :disabled="record.role === 1"
          @click="handleCommand('detail', record)"
          type="primary"
        >
          详情
        </a-link>
        <a-link
          :hoverable="false"
          :disabled="record.role === 1"
          @click="handleCommand('del', record)"
          type="primary"
          status="danger"
        >
          移除
        </a-link>
      </template>
      <template #footer>
        <div class="flex items-center gap-x-8">
          <a-checkbox
            class="pl-0!"
            :disabled="dataSource.length === 0"
            @change="handleCheckAll"
            v-model="isCheckedAll"
            :indeterminate="
              selectedKeys.length
                ? selectedKeys.length !== dataSource.length
                : undefined
            "
          ></a-checkbox>
          <a-button
            type="outline"
            @click="handleCommand('batchRemove')"
            :disabled="selectedKeys.length < 1"
          >
            移除
          </a-button>
        </div>
      </template>
    </a-table>
  </vc-container>
</template>

<style scoped>
:deep(.arco-table-footer) {
  padding: 9px 14px !important;
}
</style>
