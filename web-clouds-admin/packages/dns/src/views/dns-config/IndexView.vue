<template>
  <vc-container page-title="DNS配置" header-bordered admin>
    <vc-filter-bar
      ref="filterBarRef"
      :loading="loading"
      v-model="filterData"
      v-model:page="pagination.page"
      @search="getList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button type="primary" @click="handleGetInstallScript"
          >获取安装脚本</a-button
        >
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
        <template #ip="{ record }">
          <table-tips
            v-if="!getIpStatus(record)"
            icon="warning"
            :data="getIpTipsData(record)"
          >
            {{ emptyText(record.ip) }}
          </table-tips>
          <vc-text-ell v-else>{{ emptyText(record.ip) }}</vc-text-ell>
        </template>
        <template #current_version="{ record }">
          <div class="flex items-center">
            {{ record.current_version || '-' }}

            <a-tag
              color="green"
              v-if="record.has_new_version"
              @click="handleUpgrade(record)"
              hover="opacity-80"
              class="text-12px! leading-18px! ml-2 py-0! px-1! py-1px! rounded-4px! cursor-pointer"
            >
              有更新
              <vc-svg-icon
                class="ml-2px"
                name="upgrade"
                prefix="dns"
                :size="14"
              />
            </a-tag>
          </div>
        </template>
        <template #assign_status_title>
          <vc-tips-pop title="自动分配" icon="help-outline">
            <div>
              1、为保障服务正常运转,DNS服务器必须至少有2台DNS服务器处于自动分配状态。
            </div>
            <div>
              2、最开始添加的2台DNS服务器会强制设置为自动分配状态，不可手动关闭。
            </div>
          </vc-tips-pop>
        </template>
        <template #assign_status="{ record }">
          <a-switch
            :model-value="record.assign_status"
            :checked-value="1"
            :unchecked-value="2"
            :before-change="() => handleChangeAssignStatus(record)"
          />
        </template>
        <template #remark="{ record }">
          <vc-remark-input
            :content="record.remark"
            :on-submit="e => handleEditRemark(record, e)"
          />
        </template>
        <template #actions="{ record }">
          <a-link v-if="record.has_new_version" @click="handleUpgrade(record)"
            >升级</a-link
          >
          <span v-else />
          <a-link @click="handleEdit(record)">编辑</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>
    <edit-dns-dialog
      @submit="getList()"
      v-model="dialogVisible"
      :record="dialogState"
      v-if="dialogType === 'edit'"
    />
    <install-script-dialog
      v-model="dialogVisible"
      :record="dialogState"
      v-if="dialogType === 'installScript'"
    />
    <upgrade-dialog
      v-model="dialogVisible"
      :record="dialogState"
      v-if="dialogType === 'upgrade'"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  deleteDnsNsApi,
  getDnsNssListApi,
  type NsModel,
  updateDnsNsApi
} from '@vca/apis/dns'
import {
  decPageByData,
  emptyText,
  useListRequest,
  useTable,
  VcModal
} from 'vc-material'

import TableTips from '@/components/TableTips.vue'

import { columns } from './columns'
import EditDnsDialog from './components/EditDnsDialog.vue'
import InstallScriptDialog from './components/InstallScriptDialog.vue'
import UpgradeDialog from './components/UpgradeDialog.vue'
import { filterBarScheme } from './scheme'
import { ipDnsTipsData, ipTipsData } from './state'

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
} = useListRequest(getDnsNssListApi, filterData)

getList()

const { tableRef, createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

const getIpStatus = (row: NsModel) =>
  row.communicate_ip_status === 1 && row.resolve_ip_status === 1

function getIpTipsData(row: NsModel) {
  const res = []
  row.communicate_ip_status === 2 && res.push(...ipTipsData)
  row.resolve_ip_status === 2 && res.push(...ipDnsTipsData)
  return res
}

function handleDelete(row: NsModel) {
  VcModal.error(
    {
      title: '删除地址',
      content: () => (
        <div>
          <div>删除地址，对应的解析记录可能仍旧生效。</div>
          <div>想要地址失效，需要到域名注册商处删除对应地址。</div>
        </div>
      )
    },
    async () => {
      await deleteDnsNsApi({ id: row?.id! })
      decPageByData(pagination, tableData)
      Message.success('删除成功')
      getList()
    }
  )
}

async function handleChangeAssignStatus(row: NsModel) {
  await updateDnsNsApi({
    id: row?.id!,
    assign_status: row?.assign_status === 1 ? 2 : 1
  })
  Message.success('修改成功')
  getList()
}

const dialogVisible = ref(false)
const dialogState = ref<NsModel>()
const dialogType = ref<'edit' | 'upgrade' | 'installScript'>('edit')

function handleGetInstallScript() {
  dialogState.value = undefined
  dialogVisible.value = true
  dialogType.value = 'installScript'
}

async function handleEditRemark(row: NsModel, content: string) {
  await updateDnsNsApi({
    id: row?.id!,
    remark: content
  })
  Message.success('修改成功')
  getList()
}

async function handleEdit(row: NsModel) {
  dialogState.value = { ...row }
  dialogVisible.value = true
  dialogType.value = 'edit'
}

async function handleUpgrade(row: NsModel) {
  dialogState.value = { ...row }
  dialogVisible.value = true
  dialogType.value = 'upgrade'
}
</script>
