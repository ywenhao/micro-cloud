<script setup lang="ts">
import { type DescData, Message } from '@arco-design/web-vue'
import type { UserGroupModel } from '@vca/apis/pedestal'
import { deleteUserGroupApi, getUserGroupsListApi } from '@vca/apis/pedestal'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import columns from './columns'
import EditorGroup from './components/EditorGroup.vue'
import filterBarScheme from './filterBarScheme'
const state = ref({})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getUserGroupsListApi, state)
// 列表hooks
const { tableRef } = useTable(dataSource)
const router = useRouter()

const handleEquity = (record: UserGroupModel) => {
  const { max_site_count, speed_limit } = record.cdn_privilege ?? {}
  const { max_domain_count: dnsDomainCount, max_rr_count_per_domain } =
    record.dns_privilege ?? {}
  const { max_certificate_count, max_domain_count } = record.ssl_privilege ?? {}

  const data: DescData[] = [
    { label: '可创建站点数', value: String(max_site_count ?? '-') },
    { label: '带宽限速', value: speed_limit ? `${speed_limit}Mbps` : '-' },
    { label: '可添加域名数', value: String(dnsDomainCount ?? '-') },
    { label: '可解析域名数量', value: String(max_rr_count_per_domain ?? '-') },
    {
      label: '可申请证书数量',
      value:
        Number(max_certificate_count) === 0
          ? '无限制'
          : String(max_certificate_count ?? '-')
    },
    {
      label: '可申请域名数量',
      value:
        Number(max_domain_count) === 0
          ? '无限制'
          : String(max_domain_count ?? '-')
    }
  ]
  return data
}
const createState = reactive<CommonState>({
  visible: false,
  record: undefined
})
type Command = 'CREATE' | 'EDIT' | 'DELETE' | 'USER_COUNT'
const handleCommand = (command: Command, record?: UserGroupModel) => {
  const map: Record<Command, () => void> = {
    USER_COUNT() {
      router.push({
        name: 'UserList',
        query: {
          groupId: record!.id
        }
      })
    },
    CREATE() {
      createState.visible = true
    },
    EDIT() {
      createState.visible = true
      createState.record = record
    },
    DELETE() {
      const request = () =>
        deleteUserGroupApi({ id: record!.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, dataSource)
          getTableList()
        })
      VcModal.error(
        {
          title: '确认删除分组',
          content: '确定要删除该分组吗？'
        },
        request
      )
    }
  }
  map[command]()
}
onMounted(() => {
  getTableList()
})
</script>

<template>
  <vc-container admin page-title="分组管理" header-bordered>
    <vc-filter-bar
      class="mb-4"
      :loading="loading"
      @search="getTableList"
      :schemas="filterBarScheme"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('CREATE')">
          新建分组
        </a-button>
      </template>
    </vc-filter-bar>
    <vc-table
      ref="tableRef"
      row-key="id"
      :data="dataSource"
      :columns="columns"
      :page-data="pagination"
      column-resizable
      :loading="loading"
      :bordered="false"
      @get-list="getTableList"
    >
      <template #userCount="{ record }">
        <a-link :hoverable="false" @click="handleCommand('USER_COUNT', record)">
          {{ record?.user_count }}
        </a-link>
      </template>
      <template #equity="{ record }">
        <a-tooltip content-class="table-equity">
          <span class="cursor-pointer">查看权益</span>
          <template #content>
            <a-descriptions
              :data="handleEquity(record)"
              size="medium"
              :column="2"
            />
          </template>
        </a-tooltip>
      </template>
      <template #actions="{ record }">
        <a-link type="inline" @click="handleCommand('EDIT', record)">
          编辑
        </a-link>
        <a-tooltip v-if="record.is_default === 1" position="br">
          <a-link
            type="inline"
            status="danger"
            @click="handleCommand('DELETE', record)"
            :disabled="record.is_default === 1"
          >
            删除
          </a-link>
          <template #content>
            <div class="flex flex-col gap-y-2">
              <div class="flex flex-row gap-x-1 items-center">
                <vc-svg-icon name="warning"></vc-svg-icon>
                <span class="text-ct-1">不可删除</span>
              </div>
              <span class="text-ct-2">默认分组，不支持删除</span>
            </div>
          </template>
        </a-tooltip>
        <a-link
          v-else
          @click="handleCommand('DELETE', record)"
          type="inline"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </vc-table>
    <editor-group
      v-model:visible="createState.visible"
      v-model:record="createState.record"
      @reload="getTableList"
    ></editor-group>
  </vc-container>
</template>

<style lang="less" scoped>
:deep(.arco-descriptions-row) {
  .arco-descriptions-item-label-block {
    padding: 6px 8px;
    width: 100px;
    height: 30px;
    @apply bg-fill-1 border border-solid border-color-1;
  }
  .arco-descriptions-item-value-block {
    padding: 6px 8px;
    width: 112px;
    height: 30px;
    @apply bg-white border border-solid border-color-1;
  }
}
</style>
