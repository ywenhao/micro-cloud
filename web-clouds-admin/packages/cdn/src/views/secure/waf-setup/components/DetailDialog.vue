<template>
  <a-drawer
    :title="getTitle"
    v-model:visible="visible"
    width="600px"
    class="is-admin"
    @before-open="handleAdjustOpen"
    @close="handleAdjustClose"
    :footer="false"
  >
    <vc-table
      row-key="id"
      ref="tableRef"
      :loading="loading"
      :data="tableData"
      :bordered="false"
      :page-data="pageData"
      @sorter-change="handleSortChange"
    >
      <template #columns>
        <template v-if="props.type === 1">
          <a-table-column ellipsis tooltip data-index="name" title="节点名称">
            <template #cell="{ record }">{{ record.name || '-' }}</template>
          </a-table-column>

          <a-table-column
            ellipsis
            tooltip
            data-index="ip"
            title="节点IP"
            min-width="120"
          >
            <template #cell="{ record }">{{ record.ip || '-' }}</template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            data-index="rr_status"
            title="解析状态"
          >
            <template #cell="{ record }">{{
              getRrStatus(record) || '-'
            }}</template>
          </a-table-column>
        </template>
        <template v-else-if="props.type === 2">
          <a-table-column ellipsis tooltip data-index="domain" title="站点域名">
            <template #cell="{ record }">{{ record.domain || '-' }}</template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            data-index="cname_domain"
            title="CNAME域名"
          >
            <template #cell="{ record }">{{
              record.cname_domain || '-'
            }}</template>
          </a-table-column>
          <a-table-column
            ellipsis
            tooltip
            data-index="user_name"
            title="归属用户"
          >
            <template #cell="{ record }">{{
              record.user_name || '-'
            }}</template>
          </a-table-column>
          <a-table-column ellipsis tooltip data-index="attach" title="解析状态">
            <template #cell="{ record }">{{
              getSiteRrStatus(record) || '-'
            }}</template>
          </a-table-column>
        </template>
        <template v-else-if="props.type === 3">
          <a-table-column
            ellipsis
            tooltip
            data-index="created_at"
            title="添加时间"
            :sortable="sortableSettings"
          >
            <template #cell="{ record }">
              {{ formatUnix(+record.created_at) }}
            </template>
          </a-table-column>
          <a-table-column ellipsis tooltip data-index="domain" title="站点域名">
            <template #cell="{ record }">{{ record.domain || '-' }}</template>
          </a-table-column>
        </template>
        <template v-else>
          <a-table-column ellipsis tooltip data-index="name" title="节点名称">
            <template #cell="{ record }">{{ record.name || '-' }}</template>
          </a-table-column>
          <a-table-column
            show-overflow-tooltip
            prop="ip"
            label="节点IP"
            align="left"
            min-width="120"
          >
            <template #cell="{ record }">{{ record.ip || '-' }}</template>
          </a-table-column>
        </template>
      </template>
    </vc-table>
  </a-drawer>
</template>
<script lang="ts" setup>
import {
  getCdnGlobalWafNodeInfoListApi,
  getCdnResolvRegionsNodesByIdApi,
  getCdnSiteListApi
} from '@vca/apis/cdn'
import {
  formatUnix,
  sortableSettings,
  useListRequest,
  useTable
} from 'vc-material'

import type { NodeItem } from '../types'
import { RR_STATUS } from '../types'

// 刷新表格事件
const emit = defineEmits(['refresh-table', 'closeDialog', 'update:modelValue'])

interface IProps {
  modelValue: boolean
  id?: string
  type: number
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  id: '',
  type: 1 //1区域解析 节点详情  2区域解析站点详情 3 用户站点详情 4 安全配置waf节点详情
})

const visible = useVModel(props, 'modelValue', emit)

const filterData = ref({})

const {
  loading,
  pagination,
  data: tableData,
  run: getList
} = useListRequest(apiFn)

const pageData = computed(() =>
  props.type !== 1 && props.type !== 4 ? pagination : undefined
)

const getSiteRrStatus = computed(() => (row: any) => {
  return row.attach?.resolve_status === '3'
    ? RR_STATUS[+row.attach?.resolve_status ?? '-'] +
        `（${row.attach?.resolve_status_text ?? '-'}）`
    : RR_STATUS[+row.attach?.resolve_status ?? '-']
})
const getRrStatus = computed(
  () => (row: NodeItem) =>
    row.rr_status === 3
      ? RR_STATUS[row.rr_status] + `（${row.rr_status_desc}）`
      : RR_STATUS[row.rr_status]
)
const getTitle = computed(() => (props.type === 1 ? '节点详情' : '站点详情'))
//弹窗打开
const handleAdjustOpen = () => {
  getList()
}
//弹窗关闭
const handleAdjustClose = () => {
  emit('closeDialog')
}

const { tableRef, createSortChange } = useTable(tableData)

const handleSortChange = createSortChange(getList, filterData)

//获取解析域名列表
function apiFn(...args: any[]) {
  if (props.type === 1) {
    return getCdnResolvRegionsNodesByIdApi({ id: props.id }).then(res => {
      return { list: res.nodes! }
    })
  } else if (props.type === 2 || props.type === 3) {
    const data =
      props.type === 2 ? { region_id: props.id } : { user_id: props.id }
    // @ts-ignore
    return getCdnSiteListApi({ ...data, ...args }).then(res => {
      return res
    })
  } else {
    return getCdnGlobalWafNodeInfoListApi({ node_ids: props.id }).then(res => {
      return { list: res.node_list! }
    })
  }
}
</script>
