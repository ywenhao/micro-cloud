<template>
  <div class="api-key">
    <div class="api-key__description">
      <p class="label">
        密钥(Access/Secret Key)和API接口，主要用于SSL证书平台开放API使用。
      </p>
      <span class="value">
        API接口：
        <span class="font-normal text-sm">
          {{ open_api_addr || '-' }}
        </span>
        <span
          v-if="open_api_addr"
          v-copy:icon="open_api_addr"
          class="text-sm"
        />
      </span>
    </div>
    <div class="mt-16px flex">
      <a-button type="primary" @click="handleCreate">创建API Key</a-button>
      <a-input-search
        v-model="formState.remark"
        placeholder="搜索备注"
        class="w-200px! ml-12px search-input"
        :max-length="20"
      />
    </div>

    <div class="flex-1 mt-16px">
      <vc-table
        row-key="id"
        :loading="loading"
        :data="tableList"
        @get-list="run()"
        :columns="columns"
        :page-data="pagination"
      />
    </div>
    <create-api-key-dialog
      v-model="createApiKey.visible"
      :record="createApiKey.record"
      @close="createApiKey.record = void 0"
      @submit="handleSearch()"
    />
    <privatekey-dialog
      v-model="privatekey.visible"
      :record="privatekey.record"
      @close="privatekey.record = void 0"
    />
  </div>
</template>

<script setup lang="tsx">
import {
  Button,
  Link,
  Message,
  type TableColumnData
} from '@arco-design/web-vue'
import type { AppKeyModel } from '@vcp/apis/pedestal'
import { apiKeyEditApi, apiKeyListApi, queryConfApi } from '@vcp/apis/pedestal'
import {
  emptyFormatter,
  emptyFormatterUnix,
  useListRequest,
  VcModal
} from 'vc-material'
import { withDirectives } from 'vue'

import Copy from '@/directives/modules/copy'

import CreateApiKeyDialog from './components/CreateApiKeyDialog.vue'
import PrivatekeyDialog from './components/PrivatekeyDialog.vue'

const createApiKey = reactive({
  visible: false,
  record: undefined as AppKeyModel | undefined
})
const open_api_addr = ref('')

const formState = reactive({
  remark: ''
})

const {
  loading,
  run,
  data: tableList,
  pagination
} = useListRequest(apiKeyListApi, formState)

run()

const privatekey = reactive({
  visible: false,
  record: undefined as AppKeyModel | undefined
})

function handleCreate() {
  createApiKey.visible = true
  createApiKey.record = undefined
}

function handleSearch() {
  pagination.page = 1
  pagination.offset = 0
  run()
}

function handleChangeStatus(row: AppKeyModel) {
  const title = row.status === 1 ? '确认要禁用该密钥吗？' : '提示'
  const content =
    row.status === 1
      ? '禁用后可能导致接入服务平台API使用异常，请确认该密钥没有被使用。'
      : '确定要启用该密钥吗？'
  const status = row.status === 1 ? 2 : 1
  const request = () =>
    apiKeyEditApi({ id: row.id!, status }).then(() => {
      Message.success('修改成功')
      run()
    })
  VcModal.confirm(
    {
      content,
      title
    },
    request
  )
}

async function handleEdit(row: AppKeyModel) {
  createApiKey.visible = true
  createApiKey.record = row
}

function handleView(row: AppKeyModel) {
  privatekey.record = row
  privatekey.visible = true
}

onMounted(async () => {
  const res = await queryConfApi({ type: 7 })
  open_api_addr.value = res?.domain_conf?.openapi_domain!
})

const columns: TableColumnData[] = [
  {
    dataIndex: 'appid',
    title: 'APP ID',
    cellStyle: { minWidth: '115px' },
    render({ record, column }) {
      const value = record[column.dataIndex!]
      if (!value) return '-'
      return (
        <div class="flex flex-row items-center">
          <span class="truncate mr-2">{{ value }}</span>
          {withDirectives(h('span'), [Copy, value, 'icon'])}
        </div>
      )
    }
  },
  {
    dataIndex: 'remark',
    title: '备注',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'status',
    title: '状态',
    render({ record }) {
      return (
        <VcSwitch
          modelValue={record.status}
          onClick={() => handleChangeStatus(record as AppKeyModel)}
        />
      )
    }
  },
  {
    dataIndex: 'action',
    title: '操作',
    fixed: 'right',
    width: 140,
    render({ record }) {
      return (
        <>
          <Link onClick={() => handleView(record as AppKeyModel)}>
            查看私钥
          </Link>
          <Button onClick={() => handleEdit(record as AppKeyModel)}>
            修改
          </Button>
        </>
      )
    }
  }
]
</script>

<style lang="less" scoped>
.api-key {
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
  @apply bg-white pb-0 h-full;
  &__description {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    background: rgb(var(--primary-1));
    border-radius: 6px;
    padding: 16px 24px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    p {
      margin: 0;
    }
    .label {
      color: var(--color-text-2);
    }
    .value {
      color: var(--color-text-1);
    }
  }
}
</style>
