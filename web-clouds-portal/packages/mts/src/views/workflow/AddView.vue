<template>
  <vc-container
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="back"
  >
    <a-spin :loading="loading" class="w-full h-full">
      <a-form ref="formRef" :rules="rules" :model="formState" layout="vertical">
        <a-form-item
          field="name"
          label="名称"
          ref="nameRef"
          asterisk-position="end"
          class="mb-24px! w-400px!"
          :help="
            nameRef?.isError
              ? undefined
              : '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
          "
        >
          <a-input
            v-model="formState.name"
            placeholder="请输入名称"
            :max-length="32"
          />
        </a-form-item>
        <a-divider class="mt-8px! mb-32px!" />
        <a-form-item label="工作流">
          <x6-flow
            edit
            :add-start="!isEdit && !isCopy"
            ref="flowRef"
            @add="onNodeAdd"
            @delete="onNodeDelete"
            @node-click="onNodeClick"
          />
        </a-form-item>
        <a-divider class="mt-8px! mb-32px!" />
        <a-form-item
          label="队列"
          class="w-400px!"
          hide-asterisk
          field="queue_id"
        >
          <a-select
            :loading="queueLoading"
            placeholder="请选择队列"
            :options="queueOpts"
            @update:model-value="(e) => (formState.queue_id = e as string)"
            :model-value="queueModelValue"
          />
        </a-form-item>
      </a-form>
      <div class="footer">
        <a-button :loading="loading" type="primary" @click="handleSubmit"
          >保存
        </a-button>
        <a-button :loading="loading" type="outline" @click="back"
          >取消</a-button
        >
      </div>
      <edit-drawer
        ref="drawerRef"
        :data="flowDataMap"
        :activeId="activeNodeId"
        v-model="drawerVisible"
        :data-loaded="dataLoaded"
      />
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  addMtsWorkflowApi,
  getMtsQueueApi,
  getMtsWorkflowInfoDetailApi,
  updateMtsWorkflowApi,
  type WorkflowConfList,
  type WorkflowModel
} from '@vcp/apis/mts'
import { isEmpty, merge } from 'lodash-es'
import { nameReg, useSelectRemote } from 'vc-material'

import X6Flow from '@/components/flow/X6Flow.vue'
import EditDrawer from '@/components/workflow/edit/EditDrawer.vue'
import { useWorkFlow } from '@/components/workflow/hooks'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const regionId = computed(() => route.params.regionId as string)
const isEdit = computed(() =>
  (route.name as string).toLowerCase().includes('edit')
)
const formRef = ref<FormInstance>()
const nameRef = ref<FormItemInstance>()

const {
  flowRef,
  drawerRef,
  activeNodeId,
  flowDataMap,
  drawerVisible,
  check,
  onNodeAdd,
  onNodeDelete,
  onNodeClick,
  getSubmitData,
  setFlowData
} = useWorkFlow(true)

const rules: Rules = {
  name: [
    { required: true, message: '请输入名称' },
    {
      match: nameReg,
      message: '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
    }
  ],
  queue_id: [{ required: true, message: '请选择队列' }]
}

const formState = ref<WorkflowModel>({})

const loading = ref(false)
const dataLoaded = ref(false)
const isCopy = ref(true)

async function getDetail() {
  loading.value = true
  try {
    const res = await getMtsWorkflowInfoDetailApi({
      id: id.value
    })
    merge(formState.value, res)
    isCopy.value = false
    setFlowData(res.workflow_conf_list! as WorkflowConfList)
  } finally {
    loading.value = false
    dataLoaded.value = true
  }
}

function back() {
  router.push({ name: 'Workflow' })
}

const {
  loading: queueLoading,
  opts: queueOpts,
  remoteMethod: queueRun
} = useSelectRemote(getMtsQueueApi, {
  labelKey: 'name',
  valueKey: 'id',
  immediate: false
})

// 如果队列被删除了，则显示-
const queueModelValue = computed(() => {
  const queue_id = formState.value.queue_id
  if (!queue_id) return queue_id
  const item = queueOpts.value.find(v => v.value === queue_id)
  return item ? item.value : '-'
})

const state = useSessionStorage('addWorkflowState', {} as WorkflowModel)

function getData() {
  if (!regionId.value) return Message.error('缺少区域id')
  if (isEdit.value) {
    if (!id.value) return Message.error('缺少工作流id')
    getDetail()
    queueRun()
  } else {
    if (!isEmpty(state.value)) {
      queueRun()
      merge(formState.value, state.value)
      isCopy.value = true
      setFlowData(state.value.workflow_conf_list! as WorkflowConfList)
    } else {
      isCopy.value = false
      queueRun().then(() => {
        if (!queueOpts.value.length) return
        formState.value.queue_id = queueOpts.value[0]?.value as string
      })
    }
    state.value = null
    dataLoaded.value = true
  }
}

async function handleSubmit() {
  // 验证表单
  if (await formRef.value?.validate()) return false
  if (!(await check())) return
  const flowFormData = getSubmitData()
  const data = { ...formState.value, workflow_conf_list: flowFormData }
  loading.value = true
  const apiFn = isEdit.value ? updateMtsWorkflowApi : addMtsWorkflowApi
  const msg = isEdit.value ? '修改成功' : '添加成功'
  try {
    // @ts-ignore
    await apiFn({ ...data, region_id: regionId.value })
    Message.success(msg)
    back()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getData()
})

provide('regionId', regionId)
</script>
