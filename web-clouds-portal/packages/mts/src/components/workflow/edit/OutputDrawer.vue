<template>
  <a-drawer
    title="输出"
    :width="600"
    v-model:visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    @before-open="getFatherData"
  >
    <a-form
      v-if="format"
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="输出空间" field="bucket_id" asterisk-position="end">
        <a-select
          placeholder="请选择空间"
          v-model="formState.bucket_id"
          @change="handleBucketIdChange"
          allow-search
          @search="e => spaceSearch({ name: e, ...defaultParams })"
          :loading="spaceLoading"
          :options="spaceOptions"
        />
      </a-form-item>
      <a-form-item
        ref="nameRef"
        :help="
          !isHls
            ? !nameRef?.isError
              ? '在前缀处添加 /目录名/ ,可以将输入文件输出到该目录下，例如：添加 /图片/，则可以将输出文件输出在选择的空间下的图片目录下'
              : undefined
            : undefined
        "
        label="文件名"
        field="name"
        :class="isHls && 'mb-8px!'"
        asterisk-position="end"
      >
        <div flex items-center w="full">
          <a-input v-model="formState.name" placeholder="请输入前缀" />
          <div class="middle-input">
            <span>+</span>
            <span>原文件名</span>
            <span>+</span>
          </div>
          <a-input v-model="formState.name_suffix" placeholder="请输入后缀" />
          <div v-if="isManyScreenshot" class="middle-input pr-0!">
            <span>+</span>
            <span>{count}</span>
          </div>
          <div pl-8px color-ct-3>.{{ format }}</div>
        </div>
      </a-form-item>
      <a-form-item
        v-if="isHls"
        ref="hlsNameRef"
        :help="
          !hlsNameRef?.isError
            ? '在前缀处添加 /目录名/ ,可以将输入文件输出到该目录下，例如：添加 /图片/，则可以将输出文件输出在选择的空间下的图片目录下'
            : undefined
        "
        hide-label
        hide-asterisk
      >
        <div flex items-center w="full">
          <a-input v-model="formState.hls_name" placeholder="请输入前缀" />
          <div class="middle-input">
            <span>+</span>
            <span>原文件名</span>
            <span>+</span>
          </div>
          <a-input v-model="formState.hls_suffix" placeholder="请输入后缀" />
          <div class="middle-input pr-0!">
            <span>+</span>
            <span>{count}</span>
          </div>
          <div pl-8px color-ct-3>.{{ hlsSuffix }}</div>
        </div>
      </a-form-item>
    </a-form>
    <empty-output v-else />
  </a-drawer>
</template>

<script setup lang="ts">
import type { FormInstance, FormItemInstance } from '@arco-design/web-vue'
import type { WorkflowOutPutConf } from '@vcp/apis/mts'
import { spaceListApi } from '@vcp/apis/oss'
import { useSelectRemote } from 'vc-material'

import type { NodeTypeKeys } from '@/components/flow/types'
import { useSuffix } from '@/components/workflow/hooks'

import EmptyOutput from './EmptyOutput.vue'

const props = defineProps<{
  id: string
  type: NodeTypeKeys
  modelValue: boolean
  data: WorkflowOutPutConf
  dataLoaded: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = useVModel(props, 'modelValue', emit)

const formRef = ref<FormInstance>()
const nameRef = ref<FormItemInstance>()
const hlsNameRef = ref<FormItemInstance>()
const formState = computed(() => props.data)

const {
  isManyScreenshot,
  isHls,
  fileName,
  hlsName,
  hlsSuffix,
  format,
  getFatherData
} = useSuffix(
  toRef(() => props.id),
  formState
)

const rules: Rules = {
  bucket_id: [{ required: true, message: '请选择空间' }],
  name: [
    { required: true, message: '请输入文件名的前缀或后缀' },
    {
      validator(_value, callback) {
        if (!formState.value.name && !formState.value.name_suffix) {
          return callback('请输入文件名的前缀或后缀')
        }
        if (fileName.value.length > 256) {
          return callback('文件名过长')
        }
        return true
      }
    }
  ],
  hls_name: [
    { required: true, message: '请输入文件名的前缀或后缀' },
    {
      validator(_value, callback) {
        if (!formState.value.hls_name && !formState.value.hls_suffix) {
          return callback('请输入文件名的前缀或后缀')
        }
        if (hlsName.value.length > 256) {
          return callback('文件名过长')
        }
        return true
      }
    }
  ]
}

const regionId = inject('regionId') as Ref<string>
const defaultParams = { region_id: regionId.value, limit: 500 }

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

spaceSearch(defaultParams)

function handleBucketIdChange() {
  formState.value.bucket_name = spaceOptions.value.find(
    item => item.value === formState.value.bucket_id
  )?.label!
}

// function initData() {
//   if (!props.dataLoaded) return
//   formState.value = cloneDeep({ ...props.data })
// }

// watchEffect(() => {
//   initData()
// })

function getData() {
  const data = { ...formState.value }
  return { data, id: props.id, type: props.type }
}

async function validate() {
  getFatherData()
  await nextTick()
  return formRef.value?.validate()
}

defineExpose({ getData, validate })
</script>

<style lang="less" scoped>
.middle-input {
  @apply flex items-center gap-8px px-8px whitespace-nowrap color-ct-3;
}
</style>
