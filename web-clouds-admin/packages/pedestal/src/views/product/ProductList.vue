<script setup lang="tsx">
import {
  Message,
  type TableChangeExtra,
  type TableColumnData,
  type TableData
} from '@arco-design/web-vue'
import {
  productChangeStatusApi,
  productListApi,
  type ProductModel,
  productUpdateIndexApi
} from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
import { useListRequest, VcModal } from 'vc-material'

import EditorDialog from './components/EditorDialog.vue'
import filterBarScheme from './filterBarScheme'

const router = useRouter()
const editorState = reactive<CommonState<ProductModel>>({
  visible: false,
  record: undefined,
  loading: false
})
const columns: TableColumnData[] = [
  {
    dataIndex: 'icon',
    title: '产品图表n',
    cellStyle: { minWidth: '100px' },
    slotName: 'icon'
  },
  { dataIndex: 'name', title: '产品名称', cellStyle: { minWidth: '120px' } },
  {
    dataIndex: 'symbol',
    title: '产品标识',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '120px' },
    render: ({ record }) => <span v-uts={record.created_at}></span>
  },
  {
    dataIndex: 'status',
    title: '状态',
    slotName: 'status',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 150,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
const state = ref({})
type ICommand = 'del' | 'edit' | 'console'

/** 事件处理集合 */
const handleCommand = (command: ICommand, record?: ProductModel) => {
  const actions: Record<ICommand, () => void> = {
    edit: () => {
      editorState.record = cloneDeep(record)
      editorState.visible = true
    },
    del: () => {
      VcModal.error({
        title: '删除产品',
        content: '删除后官网和用户控制台将不再展示该产品，确定要删除吗？'
      })
    },
    console: () => {
      const { href } = router.resolve({
        name: 'PortalMicro',
        params: { app: record?.symbol }
      })
      if (import.meta.env.VITE_CLOSE_NEW_TAB) {
        window.history.pushState(null, '', href)
        window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
        return
      }
      window.open(href, '_blank')
    }
  }
  actions[command]()
}

const {
  loading,
  run: getTableList,
  data
} = useListRequest(productListApi, state)

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
        // Message.success('修改成功')
        getTableList()
      })
      .finally(() => {
        loading.value = false
      })
  }
}

/** 状态切换事件 */
const handleChangeStatus = (record: Required<ProductModel>) => {
  const request = () => {
    return new Promise<void>((resolve, reject) => {
      loading.value = true
      productChangeStatusApi({
        id: record.id,
        status: record.status === 1 ? 2 : 1
      })
        .then(() => {
          Message.success(record.status === 1 ? '禁用成功' : '启用成功')
          getTableList()
          resolve()
        })
        .finally(() => {
          loading.value = false
        })
        .catch(() => reject())
    })
  }

  if (record.status !== 1) {
    request()
  } else {
    VcModal.confirm(
      {
        title: '确认禁用产品',
        content: () => (
          <>
            <div class="text-sm pb-2">确定要禁用该产品吗？禁用后影响：</div>
            <div>
              · 官网和用户控制台将不再展示该产品；
              <br />
              · 依赖该产品的功能，将可能出现异常；
              <br />
              · 跳转该产品控制台时，将跳转至404页面；
              <br />
              · 文档中心将不展示该产品相关的产品文档。
              <br />
            </div>
          </>
        )
      },
      request
    )
  }
}

onMounted(() => {
  getTableList()
})
</script>

<template>
  <vc-container admin page-title="产品列表" header-bordered>
    <vc-filter-bar
      class="mb-4"
      v-model="state"
      :loading="loading"
      :schemas="filterBarScheme"
      @search="handleSearch"
    >
    </vc-filter-bar>
    <a-table
      :loading="loading"
      @change="handleTableChange"
      :columns="columns"
      :draggable="{ type: 'handle', width: 60, title: '排序' }"
      :bordered="false"
      :pagination="false"
      column-resizable
      :data="data"
    >
      <template #icon="{ record }">
        <product-icon :record="record" />
      </template>
      <template #status="{ record }">
        <div class="flex items-center">
          <a-switch
            @change="handleChangeStatus(record)"
            :model-value="record.status"
            inlinePrompt
            :disabled="!!record?.config_status?.length"
            :unchecked-value="2"
            :checked-value="1"
          ></a-switch>
          <product-config-status :record="record" />
        </div>
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          @click="handleCommand('console', record)"
          type="primary"
        >
          产品控制台
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('edit', record)"
          type="primary"
        >
          编辑
        </a-link>
        <!-- <a-link :hoverable="false" @click="handleCommand('del', record)" status="danger">
          删除
        </a-link> -->
      </template>
    </a-table>
    <editor-dialog
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      @reload="getTableList"
    ></editor-dialog>
  </vc-container>
</template>
