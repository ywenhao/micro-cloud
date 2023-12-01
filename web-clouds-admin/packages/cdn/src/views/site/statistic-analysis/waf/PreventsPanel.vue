<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'
import {
  getCdnStatisticPreventsListApi,
  type StatisticCode
} from '@vca/apis/cdn'
import { preStyleOptions, useCharts } from 'vc-material'

const { el, onUpdate, instance } = useCharts()

const mergeOptions = {}
type DateItem = { value: Number; name: string }
const updateChart = async (source: DateItem[]) => {
  const options = preStyleOptions(source, {}, mergeOptions)
  instance.value?.clear()
  onUpdate(options)
}
const state = inject('statisticState') as any
const loading = ref(false)
const dataSource = ref<StatisticCode[]>([])
const getChartData = () => {
  loading.value = true
  getCdnStatisticPreventsListApi(state.value)
    .then(res => {
      const data = res?.list || []
      dataSource.value = data as any
      const chatData = data.map(item => ({
        value: Number(item.prevents),
        name: String(item.location)
      }))
      updateChart(chatData)
    })
    .finally(() => {
      loading.value = false
    })
}

watch(state, getChartData, { immediate: true, deep: true })
// 错误码 数量(次) 占比(%)
const columns: TableColumnData[] = [
  { dataIndex: 'location', title: '国家/地区' },
  { dataIndex: 'prevents', title: '防护数(次)' },
  { dataIndex: 'proportion', slotName: 'proportion', title: '防护数占比(%)' }
]
</script>

<template>
  <a-spin :loading="loading" class="w-full">
    <div class="grid grid-cols-2 gap-4">
      <div ref="el" class="h-311px"></div>
      <a-table
        :data="dataSource"
        :pagination="{ pageSize: 5 }"
        :columns="columns"
      >
        <template #proportion="{ record }">
          {{
            (
              (Number(record.prevents) / Number(record.total_prevents)) *
              100
            ).toFixed(2)
          }}%
        </template>
      </a-table>
    </div>
  </a-spin>
</template>
