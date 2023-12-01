<template>
  <vc-container
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="() => $router.push({ name: 'Trigger' })"
  >
    <a-spin :loading="loading" class="w-full h-full overflow-hidden">
      <sub-title class="mt-8px">基本信息</sub-title>
      <table-card :data="baseData" />
      <sub-title class="mt-32px">输入</sub-title>
      <table-card :data="inputData" />
      <sub-title class="mt-32px">输出</sub-title>
      <x6-flow :add-start="false" ref="flowRef" @node-click="onNodeClick" />
    </a-spin>
    <detail-drawer
      :data="flowDataMap"
      :activeId="activeNodeId"
      v-model="drawerVisible"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  getMtsTriggerInfoDetailApi,
  type TriggerModel,
  type WorkflowConfList
} from '@vcp/apis/mts'
import { formatUnix } from 'vc-material'

import X6Flow from '@/components/flow/X6Flow.vue'
import SubTitle from '@/components/SubTitle.vue'
import type { TableCardItem } from '@/components/TableCard.vue'
import TableCard from '@/components/TableCard.vue'
import DetailDrawer from '@/components/workflow/detail/DetailDrawer.vue'
import { useWorkFlow } from '@/components/workflow/hooks'

import { rulesMap } from './components/columns'
const route = useRoute()

const id = computed(() => route.params.id as string)

const loading = ref(false)
const dataSource = ref<TriggerModel>({})

const {
  flowRef,
  activeNodeId,
  flowDataMap,
  drawerVisible,
  setFlowData,
  onNodeClick
} = useWorkFlow()

const baseData = computed<TableCardItem[]>(() => {
  const status = Number(dataSource.value.status)
  return [
    { label: '任务触发器名称', value: dataSource.value.name ?? '-' },
    { label: '任务触发器ID', value: dataSource.value.id ?? '-', span: 2 },
    {
      label: '创建时间',
      value: formatUnix(+dataSource.value.created_at!)
    },
    { label: '所属队列', value: dataSource.value.queue_name ?? '-' },
    {
      label: '任务状态',
      value: (
        <div class="flex items-center">
          <div
            class={[
              'mr-8px',
              { 'text-success': status === 1, 'text-danger': status === 2 }
            ]}
          >
            {status === 1 ? '已启用' : '已禁用'}
          </div>
        </div>
      )
    }
  ]
})

const inputData = computed(() => {
  const rule = (dataSource.value.match_rule ?? 1) as keyof typeof rulesMap
  return [
    { label: '区域', value: dataSource.value.region_name ?? '-' },
    { label: '空间', value: dataSource.value.bucket_name ?? '-' },
    {
      label: '匹配规则',
      value:
        +dataSource.value?.match_rule! === 1
          ? rulesMap[rule]
          : `${rulesMap[rule]}: ${dataSource.value.match_field}`
    }
  ]
})

async function getDetail() {
  loading
  getMtsTriggerInfoDetailApi({ id: id.value })
    .then(res => {
      dataSource.value = res
      setFlowData(res?.workflow_conf_list! as WorkflowConfList)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  if (!id) {
    Message.error('缺少任务触发器id')
    return
  }
  getDetail()
})
</script>

<style lang="less" scoped>
:deep(.table-label) {
  width: 122px;
}
</style>
