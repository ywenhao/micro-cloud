<script setup lang="ts">
import { getCdnStatisticHitrateListApi } from '@vca/apis/cdn'
import {
  formatChartsUnix,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  useCharts
} from 'vc-material'

const { el, onUpdate, instance } = useCharts()
const mergeOptions = computed(() => {
  const unit =
    state.value?.end_time - state.value?.start_time > 86400 ? 'week' : 'day'
  return {
    legend: {
      icon: 'rich',
      itemWidth: 20,
      itemHeight: 4
    },
    tooltip: {
      trigger: 'axis',
      formatter(params: any[]) {
        let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">
        ${formatUnix(params[0].name, 'YYYY-MM-DD HH:mm:ss')}
      </p>`
        params.forEach((_, i) => {
          spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${params[i].color}"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${params[i].seriesName}：</span>
            <span>${params[i].value}%</span>
          </span>
        </p>`
        })
        return spans
      }
    },
    xAxis: {
      axisLabel: {
        formatter: (v: number) => formatChartsUnix(v, unit)
      }
    },
    yAxis: {
      axisLabel: {
        formatter: (v: number) => `${v}%`
      }
    },
    grid: {
      top: 24,
      left: 24,
      right: 24,
      bottom: 24
    }
  }
})

type DateItem = { val: number; tm: number }
const updateChart = async (
  dataSource: DateItem[],
  stateTime: number,
  endTime: number
) => {
  const { seriesData: requestSeriesData, xAxisData } = lineChartData(
    dataSource,
    stateTime,
    endTime,
    'request_hit',
    'time'
  )
  const { seriesData: trafficSeriesData } = lineChartData(
    dataSource,
    stateTime,
    endTime,
    'traffic_hit',
    'time'
  )
  const options = lineStyleOptions(
    ['请求命中率', '流量命中率'],
    xAxisData,
    [requestSeriesData, trafficSeriesData],
    mergeOptions.value
  )
  instance.value?.clear()
  onUpdate(options as any)
}
const state = inject('statisticState') as any
const loading = ref(false)
const getChartData = () => {
  loading.value = true
  getCdnStatisticHitrateListApi(state.value)
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
