<template>
  <vc-container header-bordered page-title="统计分析">
    <statistic-filter @update-filter="handleUpdateFilter" />
    <a-tabs v-model="tabsActive" class="mt-2" @tab-click="handleTabsClick">
      <a-tab-pane
        v-for="item in TabsList"
        :key="item.value"
        :title="item.title"
      >
      </a-tab-pane>
    </a-tabs>
    <storage-capacity
      v-if="tabsActive !== 'space_flow'"
      v-model:filter-data="queryState"
      :active-name="tabsActive"
    />
    <space-flow
      v-if="tabsActive === 'space_flow'"
      v-model:filter-data="queryState"
    />
  </vc-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

import { getUnixZero } from '@/utils'

import spaceFlow from './spaceFlow.vue'
import StatisticFilter, { type IQueryData } from './StatisticFilter.vue'
import StorageCapacity from './StorageCapacity.vue'

const tabsActive = ref<string>('static_storage')
const currentQueryData = ref()

const handleTabsClick = (val: string | number) => {
  tabsActive.value = val as string
}

const TabsList = reactive([
  { title: '存储', value: 'static_storage' },
  { title: '空间流量', value: 'space_flow' },
  { title: '文件请求', value: 'file_request' }
])

const queryState = ref<IQueryData>({
  start: getUnixZero(dayjs().subtract(1, 'days') as unknown as number),
  end: getUnixZero(dayjs().subtract(1, 'days') as unknown as number) + 86399
})

const handleUpdateFilter = (data: IQueryData) => {
  currentQueryData.value = cloneDeep({ ...queryState.value, ...data })
  queryState.value = { ...queryState.value, ...data }
}
</script>
