<template>
  <vc-container page-title="域名解析" header-bordered>
    <vc-filter-bar
      ref="filterBarRef"
      :loading="loading"
      v-model="filterData"
      v-model:page="pagination.page"
      @search="getList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button type="primary" @click="handleAdd">添加域名</a-button>
        <a-button type="outline" @click="handleBatchDo">批量操作</a-button>
      </template>
    </vc-filter-bar>
    <div table-box>
      <vc-table
        row-key="id"
        ref="tableRef"
        is-selection
        :data="tableData"
        :columns="columns"
        :bordered="false"
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        v-model:selectedKeys="selectedKeys"
        :loading="loading"
      >
        <template #pagination-left>
          <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
          <a-button
            type="outline"
            :disabled="joinDisabled"
            @click="handleJoinGroup()"
            >加入分组</a-button
          >
        </template>
        <template #remark="{ record }">
          <vc-remark-input
            :content="record.remark"
            :on-submit="e => handleEditRemark(record, e)"
          />
        </template>
        <template #actions="{ record }">
          <a-link @click="toInfoPage(record.id)">解析设置</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>
    <add-domain-dialog
      @submit="getList()"
      v-model="addDialogVisible"
      :domains="selectDomains"
    />
    <join-group-dialog
      @submit="getList()"
      :rows="selected"
      v-model="joinGroupDialogVisible"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  domainDeleteApi,
  domainEditApi,
  domainGroupListApi,
  domainListApi,
  type DomainModel
} from '@vcp/apis/dns'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from '@/columns/resolve'
import AddDomainDialog from '@/components/resolve/AddDomainDialog.vue'
import JoinGroupDialog from '@/components/resolve/JoinGroupDialog.vue'
import { filterBarScheme } from '@/scheme/resolve'

const route = useRoute()
const router = useRouter()
const filterBarRef = ref()
const joinGroupDialogVisible = ref(false)

const groupId = computed(() => route.params.groupId as string)

const filterData = ref({
  name_keyword: '',
  remark_keyword: ''
})

const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(domainListApi, filterData)

const {
  tableRef,
  indeterminate,
  checkAll,
  selectedKeys,
  selected,
  createSortChange
} = useTable(tableData)

async function getGroup() {
  filterBarRef.value?.setFieldAttrs('group_id', {
    loading: true
  })
  try {
    const res = await domainGroupListApi({ limit: 0 })
    filterBarRef.value?.setFieldAttrs('group_id', {
      options: [
        { value: '', label: '全部分组' },
        ...res.list!.map(item => ({
          label: item.name!,
          value: item.id
        }))
      ]
    })
  } finally {
    filterBarRef.value?.setFieldAttrs('group_id', {
      loading: false
    })
  }
}

const selectDomains = computed(() =>
  selected.value.map(item => item.name).join('\n')
)

const handleSortChange = createSortChange(getList, filterData)
const addDialogVisible = ref(false)

const joinDisabled = computed(() => !selected.value.length)

function handleDelete(row: DomainModel) {
  VcModal.error(
    {
      title: '删除域名',
      content: () => (
        <div>
          <div>确认删除此域名？</div>
          <div>删除域名，解析记录会同步删除，且无法恢复。</div>
        </div>
      )
    },
    async () => {
      await domainDeleteApi({ id: row.id! })
      decPageByData(pagination, tableData)
      Message.success('删除成功')
      getList()
    }
  )
}

function toInfoPage(id: string) {
  router.push({
    name: 'DomainResolveInfo',
    params: { id }
  })
}

function handleJoinGroup() {
  joinGroupDialogVisible.value = true
}

function handleAdd() {
  addDialogVisible.value = true
}

function handleBatchDo() {
  router.push({ name: 'DomainBatchAdd' })
}

async function handleEditRemark(row: DomainModel, content: string) {
  await domainEditApi({
    id: row.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

onActivated(() => {
  getGroup()
  groupId.value && Reflect.set(filterData.value, 'group_id', groupId.value)
  getList()
})
</script>
