<template>
  <vc-container
    admin
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="() => $router.push({ name: 'TaskManage' })"
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
import { Button, Message } from '@arco-design/web-vue'
import {
  getMtsTaskInfoDetailApi,
  type TaskModel,
  updateMtsTaskApi,
  updateMtsTaskRetryApi,
  type WorkflowConfList
} from '@vca/apis/mts'
import { formatUnix, VcModal, VcTextEll } from 'vc-material'

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
const router = useRouter()

const id = computed(() => route.params.id as string)

const loading = ref(false)
const dataSource = ref<TaskModel>({})

const baseData = computed<TableCardItem[]>(() => {
  const status = dataSource.value.status as unknown as keyof typeof statusMap
  const btnStatus = status === 5 ? 'normal' : 'danger'
  const btnText = status === 5 ? '重试' : '终止'
  const command = status === 5 ? 'retry' : 'stop'

  const sourceValue = +dataSource.value.trigger_id!
    ? `任务触发器 ${dataSource.value.trigger_name} ${dataSource.value.trigger_id}`
    : '自建任务'

  return [
    { label: '任务ID', value: dataSource.value.id ?? '-' },
    { label: '任务名称', value: dataSource.value.name ?? '-' },
    {
      label: '任务状态',
      value: status ? (
        <div class="flex items-center">
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
          {status !== 4 ? (
            <Button
              type="primary"
              status={btnStatus}
              class="mini-btn"
              onClick={() => handleDo(command)}
            >
              {btnText}
            </Button>
          ) : (
            ''
          )}
        </div>
      ) : (
        '-'
      )
    },
    { label: '所属用户', value: dataSource.value.user_id || '-' },
    { label: '所属队列', value: dataSource.value.queue_name || '-' },
    {
      label: '处理时长',
      value: getStrBySecond(+dataSource.value.consuming_time!)
    },
    {
      label: '提交时间',
      value: formatUnix(+dataSource.value.submit_time!)
    },
    { label: '任务来源', value: <VcTextEll content={sourceValue} />, span: 2 }
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
      //@ts-ignore
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

function handleDo(command: 'retry' | 'stop') {
  if (command === 'retry') {
    const data = {
      id: dataSource.value.id!,
      node_id: undefined
    }
    updateMtsTaskRetryApi(data).then(res => {
      router
        .replace({
          name: route.name as string,
          params: { ...route.params, id: res.id as string }
        })
        .then(() => getDetail())
    })
  } else {
    const data = {
      id: dataSource.value.id!,
      status: 5
    }
    const request = () =>
      updateMtsTaskApi(data).then(() => {
        Message.success('操作成功')
        getDetail()
      })
    VcModal.confirm(
      {
        title: '终止任务',
        content: '确定终止任务吗？'
      },
      request
    )
  }
}

onMounted(() => {
  getDetail()
})
</script>
