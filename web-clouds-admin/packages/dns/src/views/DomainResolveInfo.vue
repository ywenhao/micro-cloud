<template>
  <vc-container
    admin
    :page-title="`解析设置 ${domain}`"
    :back="() => $router.push({ name: backName })"
    header-bordered
  >
    <vc-filter-bar
      @search="getList()"
      v-model="filterData"
      :loading="loading"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-button type="primary" @click="handleAdd">添加记录</a-button>
      </template>
    </vc-filter-bar>
    <div table-box>
      <vc-table
        :data="tableData"
        :loading="loading"
        :columns="columns"
        :bordered="false"
        @get-list="getList()"
        :page-data="pagination"
        @sorter-change="handleSortChange"
      >
        <template #remark="{ record }">
          <vc-remark-input
            :content="record.remark"
            :on-submit="e => handleEditRemark(record, e)"
          />
        </template>
        <template #status="{ record }">
          <a-switch
            :unchecked-value="2"
            :checked-value="1"
            :model-value="record.status"
            :before-change="() => handleSwitchChange(record)"
          />
        </template>
        <template #actions="{ record }">
          <a-link @click="handleEdit(record)">修改</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>
    <edit-resolve-drawer
      @submit="getList()"
      :is-sys="isSys"
      :domain="info?.name || ''"
      :domainLoading="infoLoading"
      v-model="resolveDrawer.visible"
      :record="resolveDrawer.record"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  deleteDnsSystemRrApi,
  delRecordApi,
  domainInfoApi,
  getDnsSystemDomainDetailApi,
  getDnsSystemRrsListApi,
  recordListApi,
  type ResolveModel,
  updateDnsSystemRrApi,
  updateRecordApi
} from '@vca/apis/dns'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import { columns } from './user-domain/columns/resolveInfo'
import EditResolveDrawer from './user-domain/components/EditResolveDrawer.vue'
import { filterBarScheme } from './user-domain/scheme/resolveInfo'

const route = useRoute()
const backName = computed(() => route.meta.currentActive as string)

const resolveDrawer = reactive({
  visible: false,
  record: undefined as ResolveModel | undefined
})

const domainId = ref(route.params.id as string)

const filterData = ref({
  type: '',
  name_keyword: '',
  value_keyword: ''
})

const domain = ref<string>('')

const queryState = computed(() => ({
  domain_id: domainId.value,
  ...filterData.value
}))

const isSys = computed(() => backName.value === 'SysDomain')
const listApi = isSys.value ? getDnsSystemRrsListApi : recordListApi
const infoApi = isSys.value ? getDnsSystemDomainDetailApi : domainInfoApi
const updateApi = isSys.value ? updateDnsSystemRrApi : updateRecordApi
const deleteApi = isSys.value ? deleteDnsSystemRrApi : delRecordApi

const {
  pagination,
  loading,
  data: tableData,
  run: getList
} = useListRequest(listApi, queryState)

const { createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

const info = ref<ResolveModel>()
const infoLoading = ref(false)
async function getResolveInfo(id: string) {
  infoLoading.value = true
  try {
    const res = await infoApi({ id })
    // @ts-ignore
    info.value = isSys.value ? res.info ?? res : res
    domain.value = info.value?.name!
  } finally {
    infoLoading.value = false
  }
}

onMounted(() => {
  if (!domainId.value) {
    Message.error('缺少参数域名id')
    return
  }
  domainId.value && getList()
  domainId.value && getResolveInfo(domainId.value)
})

function handleAdd() {
  resolveDrawer.record = undefined
  resolveDrawer.visible = true
}

async function handleEditRemark(row: ResolveModel, content: string) {
  await updateApi({
    id: row.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

async function handleEdit(row: ResolveModel) {
  resolveDrawer.record = { ...row }
  resolveDrawer.visible = true
}

async function handleSwitchChange(row: ResolveModel) {
  const status = row.status === 1 ? 2 : 1
  await updateApi({ id: row.id!, status })
  Message.success('修改成功')
  getList()
}

async function handleDelete(row: ResolveModel) {
  const content = isSys.value
    ? '删除系统域名的解析记录，可能会导致域名对应子产品的某些服务不可用，请谨慎操作。'
    : () => (
        <div class="text-left">
          <div class="pb-6">
            解析记录变更后，可能不会立即生效。因为各地网络运营商 dns
            存在缓存，在缓存未到期时，是不会向云解析 DNS
            请求最新的解析记录，而是直接将之前缓存的解析结果返回给访问者，所以需要等待运营商刷新本地缓存后，解析才会实际生效。
          </div>
          <div>
            解析生效时间主要取决于运营商DNS缓存的解析记录的TTL到期时间，预计最快10-30分钟左右生效。如进行过DNS服务器名称修改，则一般需要24-48小时左右生效。
          </div>
        </div>
      )
  VcModal.error({ title: '删除解析记录', content }, async () => {
    await deleteApi({ id: row.id! })
    Message.success('删除成功')
    decPageByData(pagination, tableData)
    getList()
  })
}
</script>
