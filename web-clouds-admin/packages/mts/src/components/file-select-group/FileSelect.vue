<template>
  <div w-full class="file-select">
    <a-select
      v-model="path"
      placeholder="请输入文件名搜索"
      :loading="loading"
      :options="opts"
      allow-search
      @focus="handleObjectSearch('')"
      @search="handleObjectSearch"
    />
    <div class="ml-4px">
      <a-button
        :disabled="closeDisabled"
        type="outline"
        class="close-btn"
        @click="emit('close')"
      >
        <template #icon>
          <icon-close size="16" />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import type { fileListModel } from '@vca/apis/oss'
import { fileListApi } from '@vca/apis/oss'
import { useSelectRemote } from 'vc-material'

const props = defineProps<{
  bucketId: string | undefined
  modelValue: string
  closeDisabled?: boolean
}>()

const emit = defineEmits<{
  close: []
  'update:modelValue': [string]
}>()

const path = useVModel(props, 'modelValue', emit)

const objectResList = ref<fileListModel[]>([])
const objectApiFn = async (...args: any[]) => {
  // @ts-ignore
  const res = await fileListApi(...args)
  objectResList.value = [...(res.list || [])]
  return res
}

const {
  loading,
  opts,
  remoteMethod: objectSearch
} = useSelectRemote(objectApiFn, {
  labelKey: 'key',
  valueKey: 'key',
  queryKey: 'prefix',
  immediate: false
})

const checkBucketId = () => {
  if (!props.bucketId) {
    Message.error('请先选择空间')
    return false
  }
  return true
}

function handleObjectSearch(query: string) {
  if (!checkBucketId()) return []

  return objectSearch({
    prefix: query,
    limit: 500,
    delimiter: '',
    bucket_id: props.bucketId
  })
}
</script>

<style lang="less" scoped>
.file-select {
  display: flex;
  align-items: center;
  & + .file-select {
    margin-top: 8px;
  }
}
</style>
