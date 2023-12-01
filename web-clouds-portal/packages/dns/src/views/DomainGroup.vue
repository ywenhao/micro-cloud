<template>
  <vc-container page-title="域名分组" header-bordered>
    <vc-filter-bar
      :loading="loading"
      v-model="filterData"
      v-model:page="pagination.page"
      @search="getList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button type="primary" @click="handleAdd">新建分组</a-button>
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
        @get-list="getList()"
        :page-data="pagination"
        v-model:selectedKeys="selectedKeys"
        :loading="loading"
      >
        <template #pagination-left>
          <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
          <a-button
            type="outline"
            status="danger"
            :disabled="deleteDisabled"
            @click="handleBatchDelete()"
            >删除</a-button
          >
        </template>
        <template #domain_count="{ record }">
          <a-link
            @click="toDomainListPage(record.id)"
            v-if="record.domain_count > 0"
          >
            {{ record.domain_count }}
          </a-link>
          <span v-else>{{ record.domain_count }}</span>
        </template>
        <template #remark="{ record }">
          <vc-remark-input
            :content="record.remark"
            :on-submit="e => handleEditRemark(record, e)"
          />
        </template>
        <template #actions="{ record }">
          <a-link @click="handleEdit(record)">编辑</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>

    <edit-group-dialog
      @submit="getList()"
      :record="dialogState"
      v-model="editDialogVisible"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  domainGroupDeleteApi,
  domainGroupDeleteBatchApi,
  domainGroupListApi,
  type DomainGroupModel,
  updateDnsDomainGroupRemarkApi
} from '@vcp/apis/dns'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from '@/columns/group'
import EditGroupDialog from '@/components/group/EditGroupDialog.vue'
import { filterBarScheme } from '@/scheme/group'

const editDialogVisible = ref(false)
const dialogState = ref<DomainGroupModel>()
const router = useRouter()

const filterData = ref({
  name_keyword: '',
  remark_keyword: ''
})

const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(domainGroupListApi, filterData)

getList()

const { tableRef, indeterminate, checkAll, selectedKeys, selected } =
  useTable(tableData)

const deleteDisabled = computed(() => !selected.value.length)

function handleDelete(row: DomainGroupModel) {
  VcModal.error(
    {
      title: '删除分组',
      content: '删除后不可恢复，是否确定删除'
    },
    async () => {
      await domainGroupDeleteApi({ id: row.id! })
      decPageByData(pagination, tableData)
      Message.success('删除成功')
      getList()
    }
  )
}

function handleBatchDelete() {
  VcModal.error(
    {
      title: '删除分组',
      content: '删除后不可恢复，是否确定删除'
    },
    async () => {
      await domainGroupDeleteBatchApi({ ids: selectedKeys.value })
      decPageByData(pagination, tableData, selected)
      Message.success('删除成功')
      getList()
    }
  )
}

function handleAdd() {
  dialogState.value = undefined
  editDialogVisible.value = true
}

function handleEdit(row: DomainGroupModel) {
  editDialogVisible.value = true
  dialogState.value = { ...row }
}

async function handleEditRemark(row: DomainGroupModel, content: string) {
  await updateDnsDomainGroupRemarkApi({
    id: row.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

function toDomainListPage(id: string) {
  router.push({ name: 'DomainResolve', params: { groupId: id } })
}
</script>
