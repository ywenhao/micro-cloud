<script setup lang="ts">
import type { TableColumnData } from '@arco-design/web-vue'
import { getCdnStatisticCodeListApi, type StatisticCode } from '@vcp/apis/cdn'
import { preStyleOptions, useCharts } from 'vc-material'

const { el, onUpdate, instance } = useCharts()

const mergeOptions = {}
type DateItem = { value: number; name: string }
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
  getCdnStatisticCodeListApi(state.value)
    .then(res => {
      const data = res?.list || []
      dataSource.value = data as any
      const chatData = data.map(item => ({
        value: Number(item.count),
        name: String(item.code)
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
  { dataIndex: 'code', title: '错误码' },
  { dataIndex: 'count', title: '数量(次)' },
  { dataIndex: 'proportion', slotName: 'proportion', title: '占比(%)' }
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
            ((Number(record.count) / Number(record.total_count)) * 100).toFixed(
              2
            )
          }}%
        </template>
      </a-table>
    </div>
  </a-spin>
</template>
