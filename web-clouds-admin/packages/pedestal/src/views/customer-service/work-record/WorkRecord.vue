<script setup lang="tsx">
import {
  Image,
  Message,
  type TableChangeExtra,
  type TableColumnData,
  type TableData,
  type TableInstance
} from '@arco-design/web-vue'
import {
  type ProductModel,
  productUpdateIndexApi,
  updateWorkerOrderEndApi,
  type WorkerOrderFilterType,
  workerOrderListApi,
  workerOrderProductListApi,
  workerOrderTypeFilterApi
} from '@vca/apis/pedestal'
import {
  checkImages,
  sortableSettings,
  useListRequest,
  type VcFilterBarScheme,
  VcModal,
  VcSvgIcon
} from 'vc-material'
import { withModifiers } from 'vue'

const selectedKeys = ref<string[]>([])
const isCheckedAll = ref(false)
const tableRef = ref<TableInstance>()
const imageRowList = reactive<string[]>([])
const router = useRouter()
type PreviewState = {
  visible: boolean
  srcList: string[]
}

const previewState = reactive<PreviewState>({
  visible: false,
  srcList: []
})

const products = ref<{ value: string; label: string }[]>([
  { value: '0', label: '全部产品' }
])

const columns: TableColumnData[] = [
  {
    dataIndex: 'title',
    title: '反馈标题',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '300px' },
    slotName: 'title'
  },
  {
    dataIndex: 'name',
    title: '所属产品/类型',
    cellStyle: { minWidth: '400px' },
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      if (!record.product_name && !record.type_name) {
        return <span>-</span>
      }
      const arr = [record.product_name, record.type_name].filter(item =>
        item.trim()
      )
      return arr.join(' | ')
    }
  },
  {
    dataIndex: 'picture_path',
    title: '附件图片',
    ellipsis: true,
    tooltip: true,
    width: 100,
    render: ({ record, rowIndex }) => {
      if (!record.picture_path) return '-'
      let pictures = record.picture_path.split(',') as string[]

      if (pictures.length) {
        pictures = pictures.map(picture => picture)
        checkImages(pictures).then((res: any) => {
          res.length && (imageRowList[rowIndex] = res[0].url)
        })
      }

      return (
        <div
          class="table-image"
          onClick={withModifiers(() => handlePreview(pictures), ['stop'])}
        >
          <Image preview={false} src={imageRowList[rowIndex]}>
            {{
              extra:
                pictures.length > 1
                  ? () => <div class="image-count">{pictures.length}</div>
                  : void 0,
              error: !imageRowList[rowIndex]
                ? () => <VcSvgIcon class="w-full h-full" name="image-error" />
                : void 0
            }}
          </Image>
        </div>
      )
    }
  },
  {
    dataIndex: 'user_id',
    title: '反馈用户',
    cellStyle: { minWidth: '200px' }
  },
  {
    dataIndex: 'create_time',
    title: '反馈时间',
    cellStyle: { minWidth: '200px' },
    sortable: sortableSettings,
    render: ({ record }) => <span v-uts={record.create_time}></span>
  },
  {
    dataIndex: 'state',
    title: '工单状态',
    width: 100,
    // 工单状态 1:处理中 2:已结单
    render: ({ record }) => {
      if (record?.state === 1) {
        return <a-tag class="is-success">处理中</a-tag>
      }
      if (record?.state === 2) {
        return <a-tag class="is-info">已结单</a-tag>
      }
      return '-'
    }
  },
  {
    // 回复状态 1:待回复 2:已回复
    dataIndex: 'reply_status',
    title: '回复状态',
    width: 100,
    render: ({ record }) => {
      if (record?.reply_status === 1) {
        return <a-tag class="is-warning">待回复</a-tag>
      }
      if (record?.reply_status === 2) {
        return <a-tag class="is-info">已回复</a-tag>
      }
      return '-'
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

const state = ref({
  type_id: '0',
  state: '0',
  product_id: '0',
  reply_status: '0',
  order: undefined,
  sort: undefined
})

const filterTypes = ref<{ label: string; value: string }[]>([
  { value: '0', label: '全部类型' }
])

const {
  pagination,
  arcoPagination,
  loading,
  run: getTableList,
  data
} = useListRequest(workerOrderListApi, state, {
  showPageSize: true,
  showTotal: true
})

/** 图片预览  */
const handlePreview = (pictures: string[]) => {
  previewState.srcList = pictures.slice()
  previewState.visible = true
}
const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
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

const handleEndRecord = (ids: string[]) => {
  const request = () =>
    updateWorkerOrderEndApi({ id: ids }).then(() => {
      Message.success('成功结单')
      tableRef.value?.select(ids, false)
      getTableList()
    })

  VcModal.confirm(
    {
      title: '结单',
      content:
        '结单即表示工单反馈的问题已解决，工单将变为只读状态，确定要结单吗？'
    },
    request
  )
}

const hasEndWorkRecord = computed(() => {
  if (!selectedKeys.value.length) return true
  const hasStateOne = selectedKeys.value.some(id => {
    return data.value.find(item => item?.id === id)?.state === 2
  })
  return !!hasStateOne
})

watchEffect(() => {
  isCheckedAll.value =
    data.value?.length > 0 && selectedKeys.value.length === data.value?.length
})
const handleCheckAll = (value: boolean | (string | number | boolean)[]) => {
  tableRef.value?.selectAll(!!value)
}

const handleBatchRemove = () => {
  handleEndRecord(selectedKeys.value)
}

const getProducts = () => {
  filterBarRef.value?.setFieldAttrs('product_id', {
    loading: true
  })
  workerOrderProductListApi({ status: 2 })
    .then(res => {
      const list = (res?.list || []) as {
        product_id: string
        product_name: string
      }[]

      const options = list.map(({ product_id, product_name }) => {
        return {
          value: product_id,
          label: product_name
        }
      })

      products.value = [{ value: '0', label: '全部产品' }].concat(...options)

      filterBarRef.value?.setFieldAttrs('product_id', {
        options: products.value,
        loading: false
      })
    })
    .finally(() => {
      filterBarRef.value?.setFieldAttrs('product_id', {
        loading: false
      })
    })
}

const getFilterTypes = () => {
  filterBarRef.value?.setFieldAttrs('type_id', {
    disabled: false,
    loading: true
  })
  workerOrderTypeFilterApi({ product_id: state.value.product_id })
    .then(res => {
      const list = (res?.list || []) as WorkerOrderFilterType[]
      const types = list.map(({ id, name }) => ({
        value: id,
        label: name
      }))
      filterTypes.value = [{ value: '0', label: '全部类型' }].concat(...types)
      filterBarRef.value?.setFieldAttrs('type_id', {
        options: filterTypes.value
      })
    })
    .finally(() => {
      filterBarRef.value?.setFieldAttrs('type_id', {
        loading: false
      })
    })
}

watch(
  () => state,
  v => {
    if (v?.value?.product_id && v?.value?.product_id !== '0') {
      filterBarRef.value?.setFieldAttrs('type_id', {
        disabled: false
      })
      getFilterTypes()
    } else {
      filterTypes.value = [{ value: '0', label: '全部类型' }]
      state.value.type_id = '0'
      filterBarRef.value?.setFieldAttrs('type_id', {
        defaultValue: '0',
        disabled: true,
        options: filterTypes.value
      })
    }
  },
  { deep: true }
)

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  state.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  state.value.sort = direction ? dataIndex : undefined
  getTableList()
}
onActivated(() => {
  getProducts()
  getTableList()
})

const filterBarRef = ref()
const schemas: VcFilterBarScheme = {
  widgets: [
    {
      field: 'product_id',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        options: [{ value: '0', label: '全部产品' }]
      }
    },
    {
      field: 'type_id',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        disabled: true,
        options: [{ value: '0', label: '全部类型' }]
      }
    },
    {
      field: 'state',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        options: [
          { label: '全部工单状态', value: '0' },
          { label: '处理中', value: '1' },
          { label: '已结单', value: '2' }
        ]
      }
    },
    {
      field: 'reply_status',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        options: [
          { label: '全部回复状态', value: '0' },
          { label: '待回复', value: '1' },
          { label: '已回复', value: '2' }
        ]
      }
    },
    {
      field: 'key',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'title',
        options: [
          {
            label: '反馈标题',
            value: 'title'
          },
          {
            label: '问题描述',
            value: 'describe'
          },
          {
            label: '用户ID',
            value: 'user_id'
          }
        ]
      }
    }
  ]
}
</script>

<template>
  <vc-container admin page-title="工单管理" header-bordered>
    <vc-filter-bar
      ref="filterBarRef"
      v-model:page="pagination.page"
      v-model="state"
      :loading="loading"
      class="mb-4"
      @search="getTableList"
      :schemas="schemas"
    >
    </vc-filter-bar>
    <a-image-preview-group
      infinite
      :srcList="previewState.srcList"
      v-model:visible="previewState.visible"
    />
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
      :bordered="false"
      @change="handleTableChange"
      @sorter-change="handleSorterChange"
      :columns="columns"
      column-resizable
      :data="data"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #title="{ record }">
        <router-link
          class="no-underline"
          :to="{ name: 'WorkRecordDetails', params: { id: record?.id } }"
        >
          <a-link class="text-ct-1! hover:text-primary!" :hoverable="false">
            {{ record?.title || '' }}
          </a-link>
        </router-link>
      </template>
      <template #actions="{ record }">
        <a-space :size="16">
          <a-link
            :disabled="record?.state === 2"
            :hoverable="false"
            @click="handleEndRecord([record.id])"
            type="primary"
          >
            结单
          </a-link>
          <a-link
            :hoverable="false"
            @click="
              router.push({
                name: 'WorkRecordDetails',
                params: { id: record?.id }
              })
            "
            type="primary"
          >
            详情
          </a-link>
        </a-space>
      </template>

      <template #pagination-left>
        <div class="flex items-center gap-x-6 mr-auto pl-3.5">
          <a-checkbox
            class="pl-0!"
            :disabled="!data?.length"
            @change="handleCheckAll"
            v-model="isCheckedAll"
            :indeterminate="
              selectedKeys.length
                ? selectedKeys.length !== data.length
                : undefined
            "
          ></a-checkbox>
          <a-button
            type="outline"
            @click="handleBatchRemove"
            :disabled="hasEndWorkRecord"
          >
            结单
          </a-button>
        </div>
      </template>
    </a-table>
  </vc-container>
</template>

<style lang="less" scoped>
:deep(.filter-bar__prefix) {
  @apply flex-1;
  & + .filter-bar__form {
    display: none;
  }
}
</style>
