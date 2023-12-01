<template>
  <div flex="~ col" w-full>
    <a-select
      v-model="bucketId"
      placeholder="请选择空间"
      allow-search
      :loading="bucketLoading"
      :options="bucketOpts"
      @search="e => spaceSearch({ name: e, ...defaultParams })"
    />
    <div flex="~ col" w-full mt-8px>
      <file-select
        v-for="(item, index) in paths"
        v-model="paths[index]"
        :bucketId="bucketId"
        :close-disabled="paths.length <= 1"
        @close="paths.splice(index, 1)"
        :key="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { spaceListApi } from '@vca/apis/oss'
import { useSelectRemote } from 'vc-material'
import type { WritableComputedRef } from 'vue'

import FileSelect from './FileSelect.vue'
const props = defineProps<{
  bucketId: string | undefined
  paths: string[] | undefined
  regionId: string
}>()

const emit = defineEmits<{
  close: []
  'update:bucketId': [string]
  'update:paths': [string]
}>()

const bucketId = useVModel(props, 'bucketId', emit)
const paths = useVModel(props, 'paths', emit) as WritableComputedRef<string[]>

const {
  loading: bucketLoading,
  opts: bucketOpts,
  remoteMethod: spaceSearch
} = useSelectRemote(spaceListApi, {
  labelKey: 'name',
  valueKey: 'id',
  queryKey: 'name',
  immediate: false
})
const defaultParams = { region_id: props.regionId, limit: 500 }
spaceSearch(defaultParams)
</script>
