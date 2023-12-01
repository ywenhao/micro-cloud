<template>
  <vc-container
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="() => $router.push({ name: 'Task' })"
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
import {
  getMtsTaskInfoDetailApi,
  type TaskModel,
  type WorkflowConfList
} from '@vcp/apis/mts'
import { formatUnix, VcTextEll } from 'vc-material'

import X6Flow from '@/components/flow/X6Flow.vue'
import SubTitle from '@/components/SubTitle.vue'
import type { TableCardItem } from '@/components/TableCard.vue'
import TableCard from '@/components/TableCard.vue'
import DetailDrawer from '@/components/workflow/detail/DetailDrawer.vue'
import { useWorkFlow } from '@/components/workflow/hooks'

import { statusMap } from './components/columns'

const {
  flowRef,
  activeNodeId,
  flowDataMap,
  drawerVisible,
  setFlowData,
  onNodeClick
} = useWorkFlow()

const route = useRoute()
const id = computed(() => route.params.id as string)
const loading = ref(false)
const dataSource = ref<TaskModel>({})

const baseData = computed<TableCardItem[]>(() => {
  const status = dataSource.value.status as unknown as keyof typeof statusMap

  const sourceValue = +dataSource.value.trigger_id!
    ? `任务触发器 ${dataSource.value.trigger_name} ${dataSource.value.trigger_id}`
    : '自建任务'

  return [
    { label: '任务ID', value: dataSource.value.id ?? '-' },
    { label: '任务名称', value: dataSource.value.name ?? '-' },
    {
      label: '任务状态',
      value: (
        <div
          class={[
            'mr-8px',
            'text-primary',
            { 'text-success!': status === 4 },
            { 'text-danger!': status === 5 }
          ]}
        >
          {statusMap[status ?? 1]!.label || '-'}
        </div>
      )
    },
    { label: '所属队列', value: dataSource.value.queue_name || '-' },

    {
      label: '提交时间',
      value: formatUnix(+dataSource.value.submit_time!)
    },
    { label: '任务来源', value: <VcTextEll content={sourceValue} /> }
  ]
})

const inputData = computed<TableCardItem[]>(() => [
  { label: '区域', value: dataSource.value.region_name || '-' },
  { label: '空间', value: dataSource.value.bucket_name || '-' },
  { label: '资源名称', value: dataSource.value.file_name || '-' }
])

async function getDetail() {
  loading.value = true
  getMtsTaskInfoDetailApi({ id: id.value })
    .then(res => {
      dataSource.value = res
      setFlowData(res?.workflow_conf_list! as WorkflowConfList, {
        isSuccess: [3, 4].includes(+res?.status!),
        errMsg: res?.message
      })
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getDetail()
})
</script>
