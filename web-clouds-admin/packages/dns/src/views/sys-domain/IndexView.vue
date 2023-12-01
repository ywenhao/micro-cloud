<template>
  <vc-container page-title="系统域名" header-bordered admin>
    <vc-filter-bar
      ref="filterBarRef"
      :loading="loading"
      v-model="filterData"
      v-model:page="pagination.page"
      @search="getList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button type="primary" @click="handleAddDomain">添加域名</a-button>
      </template>
    </vc-filter-bar>
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
          <a-link @click="handleEdit(record)">编辑</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>
    <edit-domain-dialog
      @submit="getList()"
      v-model="editDomainDialogVisible"
      :record="editDomainDialogState"
    />
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
  deleteDnsSystemDomainApi,
  getDnsSystemDomainsListApi,
  type SysDomainModel,
  updateDnsSystemDomainApi
} from '@vca/apis/dns'
import { getMicroAppData } from '@vca/shared'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import DnsStatus from '@/components/DnsStatus.vue'

import { columns } from './columns/resolve'
import EditDnsDialog from './components/EditDnsDialog.vue'
import EditDomainDialog from './components/EditDomainDialog.vue'
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
} = useListRequest(getDnsSystemDomainsListApi, filterData)

onActivated(() => {
  getList()
})

const { tableRef, createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

const microAppData = computed(() => getMicroAppData())
const productList = computed(() => microAppData.value.productList)
const productOpts = computed(() =>
  ['cdn', 'oss'].map((key, index) => {
    const item = productList.value.find(item => item.symbol === key)
    if (!item) return []
    return {
      label: item.name,
      value: index + 1
    }
  })
)

watchPostEffect(() => {
  if (productOpts.value.length)
    filterBarRef.value?.setFieldAttrs('sub_product_type', {
      options: [{ value: '', label: '全部子产品' }, ...productOpts.value]
    })
})

function handleDelete(row: SysDomainModel) {
  if (row?.usage_status === 2) {
    VcModal.confirm({
      title: '不可删除域名',
      hideCancel: true,
      okText: '知道了',
      content: () => (
        <div>
          <div>子系统正在使用该域名，不可删除。</div>
          <div>请到子系统解除使用后再删除。</div>
        </div>
      )
    })
    return
  }
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
      await deleteDnsSystemDomainApi({ id: row?.id! })
      decPageByData(pagination, tableData)
      Message.success('删除成功')
      getList()
    }
  )
}

function toInfoPage(id: string) {
  router.push({
    name: 'SysDomainResolveInfo',
    params: { id }
  })
}

const editDomainDialogVisible = ref(false)
const editDomainDialogState = ref<SysDomainModel>()

const editDnsDialogVisible = ref(false)
const editDnsDialogState = ref<SysDomainModel>()

function handleEditDns(row: SysDomainModel) {
  editDnsDialogState.value = { ...row }
  editDnsDialogVisible.value = true
}

function handleAddDomain() {
  editDomainDialogState.value = undefined
  editDomainDialogVisible.value = true
}

async function handleEditRemark(row: SysDomainModel, content: string) {
  await updateDnsSystemDomainApi({
    id: row?.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

async function handleEdit(row: SysDomainModel) {
  editDomainDialogState.value = { ...row }
  editDomainDialogVisible.value = true
}
</script>
