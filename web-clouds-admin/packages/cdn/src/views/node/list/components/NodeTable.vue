<template>
  <vc-table
    row-key="id"
    ref="tableRef"
    :bordered="false"
    :data="dataSource"
    :columns="columns"
    column-resizable
    @sorter-change="handleSortChange"
    @get-list="getTableList"
    :page-data="pagination"
    :loading="loading"
    v-model:selectedKeys="selectedKeys"
    is-selection
  >
    <template #resolve_status_title>
      解析状态
      <a-popover position="right" content-class="py-3!">
        <icon-question-circle-fill class="cursor-pointer" />
        <template #content>
          <a-descriptions :column="1" :data="analysisStatusContent" bordered />
        </template>
      </a-popover>
    </template>

    <!-- 同步状态 -->
    <template #sync_status="{ record }">
      <template v-if="record?.sync_status === 1">已同步</template>
      <template v-if="record?.sync_status === 2">同步中</template>
      <template v-if="record?.sync_status === 3">同步失败</template>
    </template>

    <!-- 运行状态 -->
    <template #run_status="{ record }">
      <a-tag v-if="record?.run_status === 1" size="medium" class="is-success">
        运行
      </a-tag>
      <a-tag v-if="record?.run_status === 2" size="medium" class="is-info">
        停止
      </a-tag>
      <a-tag v-if="record?.run_status === 3" size="medium" class="is-warning">
        异常
      </a-tag>
      <a-dropdown
        v-if="record?.run_status === 3"
        position="br"
        trigger="hover"
        class="vc-dropdown"
        @select="v => commandEvent(v as ICommand, record)"
      >
        <span class="vc-icon-button p-0.5 ml-1">
          <icon-more-vertical />
        </span>
        <template #content>
          <a-doption class="pr-6!" value="START">启用</a-doption>
          <a-doption class="pr-6!" value="STOP">停用</a-doption>
          <a-doption class="pr-6!" value="RESTART">重启</a-doption>
        </template>
      </a-dropdown>
    </template>

    <!-- 解析状态 -->
    <template #resolve_status="{ record }">
      <div
        class="flex items-center gap-x-1"
        v-if="resolveStats(record)?.status === 0"
      >
        <a-spin :size="12" :loading="resolveStats(record)?.loading"> </a-spin>
        <span>获取中</span>
      </div>
      <template v-if="resolveStats(record)?.status === -1">获取失败</template>
      <template v-if="resolveStats(record)?.status === 1">正常</template>
      <template v-if="resolveStats(record)?.status === 2">移除</template>
      <a-dropdown
        v-if="resolveStats(record)?.status as number > 0"
        position="br"
        trigger="hover"
        class="vc-dropdown"
        @select="v => commandEvent(v as ICommand, record)"
      >
        <span class="vc-icon-button p-0.5 ml-1">
          <icon-more-vertical />
        </span>
        <template #content>
          <a-doption
            :disabled="resolveStats(record)?.status === 1"
            class="pr-6!"
            value="RESOLVE_ADD"
          >
            添加解析
          </a-doption>
          <a-doption
            class="pr-6!"
            :class="
              resolveStats(record)?.status === 2
                ? 'text-waring-4!'
                : 'text-waring!'
            "
            :disabled="resolveStats(record)?.status === 2"
            value="RESOLVE_RM"
          >
            移除解析
          </a-doption>
        </template>
      </a-dropdown>
    </template>
    <template #pagination-left>
      <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
      <a-button
        type="outline"
        @click="commandEvent('SYNC_CONFIG')"
        :disabled="!selectedKeys.length"
      >
        同步配置
      </a-button>
      <a-button
        @click="commandEvent('CLEAR_CACHE')"
        type="outline"
        :disabled="!selectedKeys.length"
        status="warning"
      >
        清理缓存
      </a-button>
    </template>
    <template #actions="{ record }">
      <a-link
        :hoverable="false"
        @click="commandEvent('EDIT', record)"
        type="primary"
      >
        编辑
      </a-link>
      <a-link
        :hoverable="false"
        @click="commandEvent('CONFIG', record)"
        type="primary"
      >
        配置
      </a-link>
      <a-dropdown
        class="vc-dropdown"
        @select="(v: SelectValue) => commandEvent(v as ICommand, record)"
      >
        <a-link :hoverable="false" type="primary">
          <icon-more class="vc-icon-button text-primary" />
        </a-link>
        <template #content>
          <a-doption value="VERSION_UPGRADE">版本升级</a-doption>
          <a-doption value="SYNC_CONFIG">同步配置</a-doption>
          <a-doption value="ERROR_LOG">错误日志</a-doption>
          <a-doption value="CLEAR_CACHE">
            <span class="text-waring">清除缓存</span>
          </a-doption>
          <a-doption value="DELETE">
            <span class="text-danger">删除</span>
          </a-doption>
        </template>
      </a-dropdown>
    </template>
  </vc-table>
  <version-upgrade
    @reload="getTableList"
    :record-id="currentNodeId"
    v-model="risibles.version"
  ></version-upgrade>
  <error-log v-model="risibles.errorLog"></error-log>
</template>

<script setup lang="ts">
import {
  IconMore,
  IconMoreVertical,
  IconQuestionCircleFill
} from '@arco-design/web-vue/es/icon'
import { getCdnnodeNodesListApi } from '@vca/apis/cdn'
import {
  decPageByData,
  useListRequest,
  useTable,
  type VcFilterBarState
} from 'vc-material'

import { useResolveStatus } from '@/hooks/useResolveStatus'

import { type ICommand, useCommand } from '../hooks/useCommand'
import { columns } from './columns'
import ErrorLog from './ErrorLog.vue'
import VersionUpgrade from './VersionUpgrade.vue'

const state = defineModel<VcFilterBarState>('state', { required: true })

const analysisStatusContent = [
  { label: '移除解析', value: '系统将区域到节点解析记录移除' },
  { label: '添加解析', value: '系统将区域到节点解析记录添加' }
]

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getCdnnodeNodesListApi, state)

const { tableRef, selectedKeys, createSortChange, checkAll, indeterminate } =
  useTable(dataSource)

const { resolveStats, setKeys } = useResolveStatus('node')

const { commandEvent, risibles, currentNodeId } = useCommand({
  selectedKeys: () => selectedKeys.value,
  refresh: getTableList,
  deleteAfter() {
    decPageByData(pagination, dataSource, selectedKeys)
  }
})

watchPostEffect(() => {
  if (dataSource.value.length) {
    const keys = dataSource.value.map(({ id }) => String(id))
    setKeys(keys)
  }
})

const handleSortChange = createSortChange(getTableList, state)

onMounted(getTableList)
defineExpose({
  getTableList
})
</script>
