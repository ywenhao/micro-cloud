<template>
  <vc-container page-title="用户域名" header-bordered admin>
    <vc-filter-bar
      ref="filterBarRef"
      :loading="loading"
      v-model="filterData"
      v-model:page="pagination.page"
      @search="getList"
      :schemas="filterBarScheme"
    />
    <div table-box>
      <vc-table
        row-key="id"
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :bordered="false"
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        :loading="loading"
      >
        <template #ns_status="{ record }">
          <dns-status
            :status="record.ns_status"
            :ns-list="record.assign_ns_list!"
            @edit="handleEditDns(record)"
          />
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
    <edit-dns-dialog
      @submit="getList()"
      v-model="editDnsDialogVisible"
      :record="editDnsDialogState"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  domainDeleteApi,
  domainEditApi,
  domainListApi,
  type DomainModel
} from '@vca/apis/dns'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import DnsStatus from '@/components/DnsStatus.vue'

import { columns } from './columns/resolve'
import EditDnsDialog from './components/EditDnsDialog.vue'
import { filterBarScheme } from './scheme/resolve'

const router = useRouter()
const filterBarRef = ref()

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

onActivated(() => {
  getList()
})

const { tableRef, createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

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
    name: 'UserDomainResolveInfo',
    params: { id }
  })
}

async function handleEditRemark(row: DomainModel, content: string) {
  await domainEditApi({
    id: row.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

const editDnsDialogVisible = ref(false)
const editDnsDialogState = ref<DomainModel>()
async function handleEditDns(row: DomainModel) {
  editDnsDialogState.value = { ...row }
  editDnsDialogVisible.value = true
}
</script>
