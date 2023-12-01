<template>
  <div class="flex items-center w-full">
    <a-select
      class="max-w-1/2!"
      v-model="space"
      :loading="spaceLoading"
      placeholder="请选择空间"
      :options="spaceOptions"
      allow-search
      @change="object = undefined"
      @search="e => spaceSearch({ name: e, ...defaultParams })"
    />
    <a-select
      class="ml-16px max-w-1/2!"
      allow-search
      @focus="handleObjectSearch('')"
      :loading="objectLoading"
      v-model="object"
      @change="(e) => handleObjectChange(e as string)"
      placeholder="请输入对象名搜索"
      :options="objectOptions"
      @search="handleObjectSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { fileListApi, type fileListModel, spaceListApi } from '@vcp/apis/oss'
import { useSelectRemote } from 'vc-material'

const props = defineProps<{
  space: string | undefined
  object: string | undefined
  defaultParams: Record<string, any>
  checkObject?: (value: fileListModel) => boolean
}>()

const emit = defineEmits<{
  'update:space': [value: string | undefined]
  'update:object': [value: string | undefined]
}>()

const space = useVModel(props, 'space', emit)
const object = useVModel(props, 'object', emit)

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
spaceSearch(props.defaultParams)

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
  const bucketId = space.value
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
    marker: '',
    delimiter: '',
    ...props.defaultParams,
    bucket_id: space.value
  })
}

function handleObjectChange(value: string) {
  const item = objectResList.value.find(item => item.key === value)!
  props.checkObject && !props.checkObject?.(item)
}
</script>
