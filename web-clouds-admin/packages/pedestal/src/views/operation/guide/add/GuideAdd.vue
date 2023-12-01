<script setup lang="tsx">
import { Message, type TableColumnData } from '@arco-design/web-vue'
import { IconInfoCircleFill } from '@arco-design/web-vue/es/icon'
import {
  docAllApi,
  guideAddApi,
  guideListApi,
  type GuideModel
} from '@vca/apis/pedestal'
import { useListRequest, type VcFilterBarScheme } from 'vc-material'

const columns = computed<TableColumnData[]>(() => {
  if (document_type.value === 1) {
    return [
      {
        dataIndex: 'title',
        title: '文档标题',
        cellStyle: { minWidth: '167px' }
      },
      {
        dataIndex: 'product_name',
        title: '所属产品',
        cellStyle: { minWidth: '167px' }
      },
      {
        dataIndex: 'parent_name',
        title: '分类/子类',
        cellStyle: { minWidth: '167px' },
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
        cellStyle: { minWidth: '167px' },
        render: ({ record }) => (
          <span v-uts={record?.updated_at || record?.created_at}></span>
        )
      },
      {
        dataIndex: 'actions',
        title: '操作',
        width: 100,
        slotName: 'actions'
      }
    ]
  }
  return [
    {
      dataIndex: 'title',
      title: '问题标题',
      cellStyle: { minWidth: '167px' }
    },
    {
      dataIndex: 'parent_name',
      title: '分类/子类',
      cellStyle: { minWidth: '167px' },
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
      cellStyle: { minWidth: '167px' },
      render: ({ record }) => (
        <span v-uts={record?.updated_at || record?.created_at}></span>
      )
    },
    {
      dataIndex: 'create_account',
      title: '创建人',
      cellStyle: { minWidth: '96px' }
    },
    {
      dataIndex: 'actions',
      title: '操作',
      align: 'center',
      width: 120,
      slotName: 'actions'
    }
  ]
})

const router = useRouter()
const document_type = ref(1)
const state = ref({})

const queryState = computed(() => ({
  ...state.value,
  document_type: document_type.value
}))

const {
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(docAllApi, queryState)

const handleSearch = () => {
  getTableList()
}

const { run: getGuideList, data: guides } = useListRequest(guideListApi, state)

const guidIds = computed(() => guides.value.map(item => item.document_id))
const handleGuideAdd = (document_id: string) => {
  guideAddApi({ document_id }).then(() => {
    getGuideList()
    Message.success('添加成功')
  })
}

type ICommand = 'add'

const handleCommand = (command: ICommand, record?: GuideModel) => {
  const actions: Record<ICommand, () => void> = {
    add: () => {
      handleGuideAdd(record?.id!)
    }
  }
  actions[command]()
}

const filterBarScheme = computed<VcFilterBarScheme>(() => {
  const res: VcFilterBarScheme = {
    widgets: [
      {
        field: 'title',
        widget: 'input-icon',
        attrs: {
          placeholder:
            document_type.value === 1 ? '请输入文档标题' : '请输入问题标题'
        }
      }
    ]
  }
  return res
})
onMounted(() => {
  getGuideList()
  getTableList()
})
</script>

<template>
  <vc-container
    admin
    page-title="添加文档"
    header-bordered
    :back="() => router.push({ name: 'OperationForGuide' })"
  >
    <div class="flex flex-col w-full gap-y-4 mb-4">
      <a-alert>
        <template #icon><icon-info-circle-fill /> </template>
        添加的文档或常见问题，将展示在官网的新手使用指南模块
      </a-alert>
      <vc-filter-bar
        class="w-full"
        :loading="loading"
        v-model="state"
        :key="document_type"
        @search="handleSearch"
        :schemas="filterBarScheme"
      >
        <template #prefix>
          <a-radio-group
            v-model="document_type"
            type="button"
            @change="() => getTableList()"
          >
            <a-radio :value="1">产品文档</a-radio>
            <a-radio :value="2">常见问题</a-radio>
          </a-radio-group>
        </template>
      </vc-filter-bar>
    </div>
    <a-table
      :key="document_type"
      :pagination="false"
      :loading="loading"
      :columns="columns"
      :bordered="false"
      column-resizable
      :data="dataSource"
    >
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          :disabled="guidIds.includes(record?.id)"
          @click="handleCommand('add', record)"
          status="normal"
          type="primary"
        >
          {{ guidIds.includes(record?.id) ? '已添加' : '添加' }}
        </a-link>
      </template>
    </a-table>
  </vc-container>
</template>
