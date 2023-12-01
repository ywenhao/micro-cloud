<template>
  <a-drawer
    v-model:visible="modelValue"
    :title="title"
    class="is-admin"
    :width="800"
    @before-open="handleBeforeOpen"
    :footer="false"
  >
    <a-alert v-if="module === 'region'" class="mb-4">
      若有失败记录请检查解析相关配置/或者手动添加解析记录
    </a-alert>
    <div class="box">
      <vc-table
        class="mb-4"
        row-key="id"
        ref="tableRef"
        :data="dataSource"
        :columns="detailsCols(module, type)"
        column-resizable
        @sorter-change="handleSortChange"
        @get-list="getTableList"
        :page-data="pageData"
        :loading="loading"
        v-model:selectedKeys="selectedKeys"
      >
        <template #rr_status="{ record }">
          <template v-if="record?.rr_status == 1">添加中</template>
          <template v-else-if="record?.rr_status == 2">添加成功</template>
          <template v-else-if="record?.rr_status == 3">
            添加失败 ({{ record?.rr_status_desc || '-' }})
          </template>
          <template v-else>-</template>
        </template>
        <template #resolve_status="{ record }">
          <template v-if="record?.attach?.resolve_status == 1">
            添加中
          </template>
          <template v-else-if="record?.attach?.resolve_status == 2">
            添加成功
          </template>
          <template v-else-if="record?.attach?.resolve_status == 3">
            添加失败 ({{ record?.attach?.resolve_status_text || '-' }})
          </template>
          <template v-else>-</template>
        </template>
        <template #actions="{ record }">
          <a-link
            :hoverable="false"
            @click="handleCommand('edit', record)"
            type="primary"
          >
            编辑
          </a-link>
          <a-link
            :hoverable="false"
            @click="handleCommand('del', record)"
            status="danger"
          >
            删除
          </a-link>
        </template>
      </vc-table>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { useListRequest, useTable, VcModal } from 'vc-material'

const modelValue = defineModel()

import {
  getCdnResolvRegionsNodesByIdApi,
  getCdnResolvSiteResolvesBindingsDetailByIdApi,
  getCdnSiteListApi
} from '@vca/apis/cdn'

import { detailsCols } from './columns'

const props = defineProps<{
  module: 'domain' | 'region'
  recordId?: string
  type: 'node' | 'site'
}>()

const pageData = computed(() => {
  if (props.module === 'domain') return pagination
  if (props.type === 'node') return undefined
  if (props.type === 'site') return pagination
  return pagination
})

const title = computed(() => {
  if (props.module === 'domain') {
    return '分配详情'
  }
  if (props.type === 'node') {
    return '节点详情'
  }
  if (props.type === 'site') {
    return '站点详情'
  }
  return ''
})

function apiFn(args: any) {
  console.log(args)
  if (props.module === 'domain' && props.type === 'site') {
    return getCdnResolvSiteResolvesBindingsDetailByIdApi({ ...args } as any)
  }
  if (props.module === 'region' && props.type === 'node') {
    return getCdnResolvRegionsNodesByIdApi({ ...args } as any).then(res => {
      return {
        list: res.nodes || []
      }
    })
  }
  if (props.module === 'region' && props.type === 'site') {
    return getCdnSiteListApi({ ...args } as any)
  }
  return getCdnResolvSiteResolvesBindingsDetailByIdApi({ ...args } as any)
}
const filterData = ref({
  id: computed(() =>
    props.module === 'region' && props.type === 'site'
      ? undefined
      : props.recordId
  ),
  region_id: computed(() =>
    props.module === 'region' && props.type === 'site'
      ? props.recordId
      : undefined
  )
})

const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(apiFn, filterData)

const { tableRef, selectedKeys, createSortChange } = useTable(dataSource)
type ICommand = 'create' | 'del' | 'edit'

/** 事件处理集合 */
const handleCommand = (command: ICommand, record?: any) => {
  console.log(record)
  const actions: Record<ICommand, () => void> = {
    create: () => {
      // editorState.record = undefined
      // editorState.visible = true
    },
    edit: () => {
      // editorState.record = cloneDeep(record)
      // editorState.visible = true
    },
    del: () => {
      // const request = () =>
      //  adminDeleteApi({ id: record!.id! }).then(() => {
      //   Message.success('删除成功')
      // getTableList()
      // })
      VcModal.error(
        {
          title: '移除所选规则',
          content: '删除该规则后，将不可恢复。'
        }
        // request
      )
    }
  }
  actions[command]()
}

const handleSortChange = createSortChange(getTableList, filterData)
const handleBeforeOpen = () => {
  getTableList()
}
</script>
