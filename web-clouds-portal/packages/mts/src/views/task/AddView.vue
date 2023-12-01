<template>
  <vc-container header-bordered page-title="添加任务" :back="back">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <div class="text-base text-ct-1 font-500 my-4">基本信息</div>
      <a-form-item
        label="名称"
        field="name"
        class="mb-24px! w-400px!"
        asterisk-position="end"
        :help="
          nameRef?.isError
            ? undefined
            : '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
        "
      >
        <a-input v-model="formState.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item
        class="w-400px!"
        label="空间"
        field="bucket_id"
        asterisk-position="end"
      >
        <a-select
          placeholder="请选择空间"
          v-model="formState.bucket_id"
          allow-search
          @search="e => spaceSearch({ name: e, ...defaultParams })"
          :loading="spaceLoading"
          :options="spaceOptions"
        />
      </a-form-item>
      <a-form-item
        class="w-400px!"
        label="对象"
        field="file_name"
        asterisk-position="end"
      >
        <a-space direction="vertical" :size="4" class="w-full">
          <a-select
            allow-search
            @focus="handleObjectSearch('')"
            :loading="objectLoading"
            v-model="formState.file_name"
            placeholder="请输入对象名搜索"
            :options="objectOptions"
            @search="handleObjectSearch"
          />
          <div class="color-ct-3 leading-18px font-400 text-12px">
            <div>
              请提前在云存储OSS中上传待处理文件，<span
                @click="toUploadPage"
                class="color-primary hover:color-primary-5 cursor-pointer"
                >去上传</span
              >
            </div>
            <div>
              系统会自动过滤输入源，只处理含MP4，FLV等格式在内的视频文件
            </div>
          </div>
        </a-space>
      </a-form-item>
      <a-divider class="my-4!"></a-divider>
      <div class="text-base text-ct-1 font-500 my-4">任务定义</div>
      <a-form-item class="w-full!" hide-label hide-asterisk field="workflow_id">
        <div flex flex-col gap="8px" w-full relative>
          <a-radio-group
            v-model="workflowRadio"
            @change="handleWorkflowRadioChange"
          >
            <a-radio :value="1">选择工作流</a-radio>
            <a-radio :value="2">快速自定义工作流</a-radio>
          </a-radio-group>
          <a-select
            :disabled="!workflowOpts.length"
            v-if="workflowRadio === 1"
            :options="workflowOpts"
            :loading="workflowLoading"
            v-model="formState.workflow_id"
            placeholder="请选择工作流"
            @change="handleWorkflowChange"
            class="w-400px!"
          ></a-select>
          <x6-flow
            edit
            :key="`flow-${workflowRadio}`"
            :add-start="workflowRadio === 2"
            ref="flowRef"
            @add="onNodeAdd"
            @delete="onNodeDelete"
            @node-click="onNodeClick"
          />
          <div
            v-if="workflowRadio === 1 && !workflowOpts.length"
            class="workflow-empty"
          >
            暂无可选择的工作流，请先创建工作流
          </div>
        </div>
      </a-form-item>
      <a-divider class="my-8!"></a-divider>
      <a-form-item label="队列" class="w-400px!" hide-asterisk field="queue_id">
        <a-select
          :loading="queueLoading"
          placeholder="请选择队列"
          :options="queueOpts"
          :disabled="workflowRadio === 1"
          @update:model-value="(e) => (formState.queue_id = e as string)"
          :model-value="queueModelValue"
        />
      </a-form-item>
      <a-form-item class="mb-8px!">
        <a-checkbox v-model="autoSaveTemplate" :disabled="workflowRadio === 1"
          >自动保存为工作流模板</a-checkbox
        >
      </a-form-item>
      <a-form-item
        hide-asterisk
        hide-label
        class="w-400px!"
        v-if="autoSaveTemplate"
        field="workflow_name"
      >
        <a-input
          placeholder="请输入工作流名称"
          v-model="formState.workflow_name"
        />
      </a-form-item>
    </a-form>
    <a-divider class="mt-8px! mb-16px"></a-divider>
    <div class="footer">
      <a-button type="primary" :loading="loading" @click="handleSubmit"
        >确认</a-button
      >
      <a-button type="outline" :loading="loading" @click="back">取消</a-button>
    </div>
    <edit-drawer
      ref="drawerRef"
      :data="flowDataMap"
      :activeId="activeNodeId"
      v-model="drawerVisible"
      :data-loaded="dataLoaded"
    />
  </vc-container>
</template>

<script lang="ts" setup>
import {
  type FieldRule,
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  addMtsTaskApi,
  getMtsQueueApi,
  getMtsWorkflowApi,
  type WorkflowConfList
} from '@vcp/apis/mts'
import { fileListApi, type fileListModel, spaceListApi } from '@vcp/apis/oss'
import { nameReg, useRequest, useSelectRemote } from 'vc-material'

import X6Flow from '@/components/flow/X6Flow.vue'
import EditDrawer from '@/components/workflow/edit/EditDrawer.vue'
import { useWorkFlow } from '@/components/workflow/hooks'

const formState = reactive({
  name: '',
  file_name: '',
  region_id: '',
  bucket_id: '',
  queue_id: '',
  workflow_id: '',
  workflow_name: ''
})

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

const workflowRadio = ref(2)
const autoSaveTemplate = ref(false)

const router = useRouter()
const route = useRoute()
const regionId = computed(() => route.params.regionId as string)
const formRef = ref<FormInstance>()
const nameRef = ref<FormItemInstance>()
const dataLoaded = ref(false)

const loading = ref(false)

const rules = computed(
  () =>
    ({
      name: [
        { required: true, message: '请输入名称' },
        {
          match: nameReg,
          message:
            '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
        }
      ],
      region_id: [{ required: true, message: '请选择所属区域' }],
      bucket_id: [{ required: true, message: '请选择空间' }],
      queue_id:
        workflowRadio.value === 2
          ? [{ required: true, message: '请选择队列' }]
          : [],
      workflow_id:
        workflowRadio.value === 1
          ? [{ required: true, message: '请选择工作流' }]
          : [],
      file_name: [{ required: true, message: '请选择对象' }],
      workflow_name: [
        { required: true, message: '请输入工作流名称' },
        {
          match: nameReg,
          message:
            '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
        }
      ]
    } as Record<string, FieldRule[]>)
)

const back = () => router.push({ name: 'Task' })
const toUploadPage = () =>
  window.open(`${location.origin}/product/oss/space-manage`)

const {
  loading: queueLoading,
  opts: queueOpts,
  remoteMethod: queueRun
} = useSelectRemote(getMtsQueueApi, {
  labelKey: 'name',
  valueKey: 'id',
  immediate: false
})
queueRun().then(() => {
  if (!queueOpts.value.length) return
  formState.queue_id = queueOpts.value[0]?.value as string
})

const {
  loading: workflowLoading,
  data: workflowRes,
  run
} = useRequest(getMtsWorkflowApi)
run({ region_id: regionId.value })

const workflowOpts = computed(() => {
  return (workflowRes.value?.list || []).map(item => ({
    label: item.name,
    value: item.id
  }))
})

watch(
  [workflowRadio, () => formState.workflow_id],
  async ([radio, id]) => {
    dataLoaded.value = false
    flowDataMap.length = 0
    if (radio === 1 && id) {
      const list = workflowRes.value.list || []
      const item = list.find(v => v.id === id)!
      const data = item.workflow_conf_list || []
      await nextTick()
      setFlowData(data as WorkflowConfList)
    }
    dataLoaded.value = true
  },
  { immediate: true }
)

// 如果队列被删除了，则显示-
const queueModelValue = computed(() => {
  let queue_id = formState.queue_id
  if (workflowRadio.value === 1) {
    const list = workflowRes.value?.list || []
    queue_id = formState.workflow_id
      ? list.find(v => v.id === formState.workflow_id)?.queue_id!
      : '-'
  }
  return queue_id
})

const handleWorkflowRadioChange = async () => {
  autoSaveTemplate.value = false
  formState.queue_id = ''
  formState.workflow_id = ''
  await nextTick()
  formRef.value?.clearValidate(['queue_id', 'workflow_id'])
}

const handleWorkflowChange = () => {
  const list = workflowRes.value?.list!
  formState.queue_id = list.find(v => v.id === formState.workflow_id)?.queue_id!
}

const {
  loading: spaceLoading,
  opts: spaceOptions,
  remoteMethod: spaceSearch
} = useSelectRemote(spaceListApi, {
  labelKey: 'name',
  valueKey: 'id',
  queryKey: 'name',
  immediate: false
})

const objectResList = ref<fileListModel[]>([])
const objectApiFn = async (...args: any[]) => {
  // @ts-ignore
  const res = await fileListApi(...args)
  objectResList.value = [...(res.list || [])]
  return res
}

const {
  loading: objectLoading,
  opts: objectOptions,
  remoteMethod: objectSearch
} = useSelectRemote(objectApiFn, {
  labelKey: 'key',
  valueKey: 'key',
  queryKey: 'prefix',
  immediate: false
})

const checkBucketId = () => {
  const bucketId = formState.bucket_id
  if (!bucketId) {
    Message.error('请先选择空间')
    return false
  }
  return true
}

function handleObjectSearch(query: string) {
  if (!checkBucketId()) return []

  return objectSearch({
    prefix: query,
    ...defaultParams,
    delimiter: '',
    bucket_id: formState.bucket_id
  })
}

const defaultParams = { region_id: regionId.value, limit: 500 }
spaceSearch(defaultParams)

async function handleSubmit() {
  // 验证表单
  if (await formRef.value?.validate()) return false
  if (!(await check())) return
  const flowFormData = getSubmitData() as any
  const workflow_id =
    workflowRadio.value === 1 ? formState.workflow_id : undefined
  const workflow_name = autoSaveTemplate.value
    ? formState.workflow_name
    : undefined
  loading.value = true
  try {
    await addMtsTaskApi({
      ...formState,
      workflow_id,
      workflow_name,
      region_id: regionId.value,
      workflow_conf_list: flowFormData
    })
    Message.success('添加成功')
    back()
  } finally {
    loading.value = false
  }
}
provide('regionId', regionId)
</script>

<style lang="less" scoped>
.arco-form {
  :deep(.arco-form-item) {
    margin-bottom: 16px;
  }
  :deep(.arco-form-item-content),
  :deep(.arco-form-item-wrapper-col) {
    min-height: 20px;
  }
}

.workflow-empty {
  position: absolute;
  bottom: calc(120px / 2);
  left: 50%;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--color-text-3);
  background-color: var(--color-fill-1);
  font-weight: 400;
  line-height: 20px;
  border-radius: 20px;
  transform: translate(-50%, 50%);
}
</style>
