<template>
  <vc-filter-bar
    class="mb-4"
    v-model="filterState"
    :refresh="false"
    :schemas="filterBarScheme"
  >
  </vc-filter-bar>
  <vc-table
    row-key="id"
    ref="tableRef"
    is-selection
    column-resizable
    :bordered="false"
    :data="dataSource"
    :columns="presetRulesCols"
    :loading="loading"
    :page-data="pagination"
    v-model:selectedKeys="selectedKeys"
    @get-list="getTableList"
    @sorter-change="handleSortChange"
  >
    <template #md5="{ record }">
      <div class="flex flex-row gap-x-2">
        <span v-table-cell>{{ record.rule.md5 }}</span>
        <vc-svg-icon
          prefix="cdn"
          name="copy"
          @click="copy(record.rule.md5)"
        ></vc-svg-icon>
      </div>
    </template>
    <template #desc="{ record }">
      <span v-table-cell="record.rule.description"></span>
    </template>
    <template #deploy="{ record }">
      <a-switch
        :model-value="record.deploy"
        :checked-value="1"
        :unchecked-value="2"
        @change="commandEvent('STATUS', record)"
      ></a-switch>
    </template>
    <template #pagination-left>
      <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
      <a-button
        type="outline"
        :disabled="!selectedKeys.length || batchBtnDisabled(false)"
        @click="commandEvent('STATUS', selected)"
      >
        批量部署
      </a-button>
      <a-button
        type="outline"
        :disabled="!selectedKeys.length || batchBtnDisabled(true)"
        status="warning"
        @click="commandEvent('STATUS', selected)"
      >
        批量取消部署
      </a-button>
    </template>
  </vc-table>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getCdnSiteManageRuleByIdApi,
  updateCdnSiteManageRuleByIdApi
} from '@vcp/apis/cdn'
import type { PresetRuleItem } from '@vcp/apis/src/cdn/model'
import {
  useClipboard,
  useListRequest,
  useTable,
  type VcFilterBarScheme,
  type VcFilterBarState
} from 'vc-material'

import { presetRulesCols } from './columns'
const { copy } = useClipboard()
const route = useRoute()
const siteId = route.params.id as string
const filterState = ref<VcFilterBarState>({
  site_id: siteId,
  rule_type: 0
})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnSiteManageRuleByIdApi, filterState)

const {
  tableRef,
  selectedKeys,
  selected,
  createSortChange,
  checkAll,
  indeterminate
} = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, filterState)

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'rule_name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入描述'
      }
    }
  ]
}

type ICommand = 'STATUS'

/** 事件处理集合 */
const commandEvent = (
  command: ICommand,
  record?: PresetRuleItem | PresetRuleItem[]
) => {
  const actions: Record<ICommand, () => void> = {
    STATUS() {
      let ids: string[] = []
      let deploy: number = 0
      if (Array.isArray(record)) {
        const select = record as PresetRuleItem[]
        ids = select.map(item => item.rule?.rule_id ?? '')
        // @ts-ignore
        deploy = select[0].deploy === 1 ? 2 : 1
      } else {
        ids = [record?.rule?.rule_id ?? '']
        // @ts-ignore
        deploy = record?.deploy === 1 ? 2 : 1
      }
      const data = {
        site_id: siteId,
        rule_type: 0,
        rule_id: ids,
        deploy: deploy
      }
      updateCdnSiteManageRuleByIdApi(data as any).then(() => {
        if (ids.length > 1) {
          const content = deploy === 1 ? '批量部署成功' : '批量取消部署成功'
          Message.success(content)
        } else {
          const content = deploy === 1 ? '部署成功' : '取消部署成功'
          Message.success(content)
        }
        getTableList()
      })
    }
  }
  actions[command]()
}

const batchBtnDisabled = computed(() => (isCancel: boolean) => {
  let flag = false
  if (isCancel) {
    selected.value.find(item => {
      if (Number(item.deploy) === 2) {
        flag = true
      }
    })
  } else {
    selected.value.find(item => {
      if (Number(item.deploy) === 1) {
        flag = true
      }
    })
  }
  return flag
})

onMounted(getTableList)
</script>
