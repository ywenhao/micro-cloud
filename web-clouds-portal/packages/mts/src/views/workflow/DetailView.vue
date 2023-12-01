<template>
  <vc-container
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="() => $router.push({ name: 'Workflow' })"
  >
    <a-spin :loading="loading" class="w-full h-full overflow-hidden">
      <sub-title class="mt-8px">基本信息</sub-title>
      <table-card :data="baseData" />
      <sub-title class="mt-32px">输入</sub-title>
      <table-card :data="inputData" bordered />
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
  getMtsWorkflowInfoDetailApi,
  type WorkflowConfList,
  type WorkflowModel
} from '@vcp/apis/mts'
import { emptyText, formatUnix } from 'vc-material'

import X6Flow from '@/components/flow/X6Flow.vue'
import SubTitle from '@/components/SubTitle.vue'
import TableCard from '@/components/TableCard.vue'
import DetailDrawer from '@/components/workflow/detail/DetailDrawer.vue'
import { useWorkFlow } from '@/components/workflow/hooks'
const route = useRoute()

const id = computed(() => route.params.id as string)
const loading = ref(false)
const dataSource = ref<WorkflowModel>({})

const {
  flowRef,
  activeNodeId,
  flowDataMap,
  drawerVisible,
  setFlowData,
  onNodeClick
} = useWorkFlow()

const baseData = computed(() => {
  return [
    { label: '工作流名称', value: emptyText(dataSource.value.name) },
    { label: '工作流ID', value: emptyText(dataSource.value.id), span: 2 },
    { label: '所属队列', value: emptyText(dataSource.value.queue_name) },
    {
      label: '更新时间',
      value: formatUnix(+dataSource.value.updated_at!)
    },
    {
      label: '创建时间',
      value: formatUnix(+dataSource.value.created_at!)
    }
  ]
})

const inputData = computed(() => [
  { label: '区域', value: emptyText(dataSource.value.region_name), span: 3 }
])

function getDetail() {
  loading.value = true
  getMtsWorkflowInfoDetailApi({ id: id.value })
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
    Message.error('缺少工作流id')
    return
  }
  getDetail()
})
</script>

<style lang="less" scoped>
:deep(.table-label) {
  min-width: 94px;
}
</style>
