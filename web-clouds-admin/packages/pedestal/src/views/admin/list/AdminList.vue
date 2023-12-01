<script setup lang="tsx">
import 'vc-material/theme-chalk/table.css'

import { Message, type TableColumnData } from '@arco-design/web-vue'
import {
  adminDeleteApi,
  adminListApi,
  type AdminModel,
  adminUpdateApi
} from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
import {
  decPageByData,
  sortableSettings,
  useListRequest,
  VcModal
} from 'vc-material'

import EditorDialog from './components/EditorDialog.vue'
import filterBarScheme from './filterBarScheme'

const appStore = useAppStore()

const columns: TableColumnData[] = [
  {
    dataIndex: 'username',
    title: '账号',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'role',
    title: '角色',
    render: ({ record }) => <span>{RoleLabelMap[record?.role]} </span>,
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'login_at',
    sortable: sortableSettings,
    title: '最近登录时间',
    render: ({ record }) => <span v-uts={record.login_at}></span>,
    width: 180
  },

  {
    dataIndex: 'login_ip',
    title: '最近登录IP',
    render: ({ record }) => <span v-table-cell={record.login_ip}></span>,
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'login_addr',
    title: '所在地',
    render: ({ record }) => <span v-table-cell={record.login_addr}></span>,
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    sortable: sortableSettings,
    render: ({ record }) => <span v-uts={record.created_at}></span>,
    width: 180
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
    width: 180,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

const adminId = ref('')
const adminResetVisible = ref(false)
const state = ref({})
const {
  pagination,
  arcoPagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(adminListApi, state, {
  showPageSize: true,
  showTotal: true
})

const handleSearch = () => {
  getTableList()
}

const editorState = reactive<CommonState<AdminModel>>({
  visible: false,
  record: undefined,
  loading: false
})
type ICommand = 'del' | 'edit' | 'reset' | 'create'

const handleCommand = (command: ICommand, record?: AdminModel) => {
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
        adminDeleteApi({ id: record!.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, dataSource)
          getTableList()
        })
      VcModal.error(
        {
          title: '删除账户',
          content: '确定要删除该管理员账户吗？'
        },
        request
      )
    },
    reset: () => {
      adminId.value = record!.id!
      adminResetVisible.value = true
    }
  }
  actions[command]()
}
const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
  getTableList()
}

/** 状态切换事件 */
const handleChangeStatus = (record: Required<AdminModel>) => {
  const request = () => {
    return new Promise<void>((resolve, reject) => {
      loading.value = true
      adminUpdateApi({
        id: record.id,
        status: record.status === 1 ? 2 : 1
      })
        .then(() => {
          Message.success(record.status === 1 ? '禁用成功' : '启用成功')
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
        title: '确认禁用账户',
        content: '确定要禁用该管理员账户吗？'
      },
      request
    )
  }
}

const disabled = (admin: AdminModel) => {
  if (admin.role === 1) return true
  if (admin.id === appStore.userInfo?.id) return true
  return false
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  state.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  state.value.sort = direction ? dataIndex : undefined
  getTableList()
}
onMounted(() => {
  getTableList()
})
</script>

<template>
  <vc-container admin page-title="管理员列表" header-bordered>
    <vc-filter-bar
      :loading="loading"
      class="mb-4"
      @search="handleSearch"
      @update:page="handlePageChange"
      v-model="state"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button @click="handleCommand('create')" type="primary">
          添加账户
        </a-button>
      </template>
    </vc-filter-bar>
    <a-table
      :loading="loading"
      :bordered="false"
      :columns="columns"
      column-resizable
      :data="dataSource"
      :pagination="arcoPagination"
      @sorter-change="handleSorterChange"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #status="{ record }">
        <a-switch
          @change="handleChangeStatus(record)"
          :model-value="record.status"
          inlinePrompt
          :unchecked-value="2"
          :checked-value="1"
          :disabled="disabled(record)"
        ></a-switch>
      </template>
      <template #actions="{ record }">
        <a-link :hoverable="false" @click="handleCommand('reset', record)">
          重置密码
        </a-link>
        <a-link
          :hoverable="false"
          :disabled="disabled(record)"
          @click="handleCommand('edit', record)"
        >
          编辑
        </a-link>
        <a-link
          :hoverable="false"
          :disabled="disabled(record)"
          @click="handleCommand('del', record)"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </a-table>

    <editor-dialog
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      @refresh="handlePageChange(1)"
      @reload="getTableList"
    ></editor-dialog>
    <reset-password
      :is-user="false"
      v-model="adminResetVisible"
      :record-id="adminId"
    ></reset-password>
  </vc-container>
</template>
