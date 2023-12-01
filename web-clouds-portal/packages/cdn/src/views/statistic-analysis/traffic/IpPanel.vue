<script setup lang="ts">
import { getCdnStatisticIpsListApi } from '@vcp/apis/cdn'
import dayjs from 'dayjs'
import { lineChartData, lineStyleOptions, useCharts } from 'vc-material'

const { el, onUpdate, instance } = useCharts()

const mergeOptions = {
  legend: { show: false },
  grid: {
    top: 24,
    left: 24,
    right: 24,
    bottom: 0
  },
  xAxis: {
    axisLabel: {
      formatter: (value: number) => dayjs(value * 1000).format('MM-DD')
    }
  }
}
type DateItem = { val: number; tm: number }
const updateChart = async (
  dataSource: DateItem[],
  stateTime: number,
  endTime: number
) => {
  const { seriesData, xAxisData } = lineChartData(
    dataSource,
    stateTime,
    endTime,
    'ips',
    'time'
  )
  const options = lineStyleOptions(
    ['独立IP访问数'],
    xAxisData,
    [seriesData],
    mergeOptions
  )
  instance.value?.clear()
  onUpdate(options as any)
}
const state = inject('statisticState') as any
const loading = ref(false)
const getChartData = () => {
  loading.value = true
  getCdnStatisticIpsListApi(state.value)
    .then(res =>
      updateChart(
        (res?.list || []) as unknown as DateItem[],
        state.value?.start_time,
        state.value?.end_time
      )
    )
    .finally(() => {
      loading.value = false
    })
}

watch(state, getChartData, { immediate: true, deep: true })
</script>

<template>
  <a-spin :loading="loading" class="w-full">
    <div ref="el" class="h-70"></div>
  </a-spin>
</template>
