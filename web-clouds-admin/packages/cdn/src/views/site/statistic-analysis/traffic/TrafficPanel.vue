<script setup lang="ts">
import { getCdnStatisticTrafficListApi } from '@vca/apis/cdn'
import {
  convertByte,
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
        let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">${formatUnix(
          params[0].name,
          'YYYY-MM-DD HH:mm:ss'
        )}</p>`
        params.forEach((_, i) => {
          spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${
            params[i].color
          }"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${params[i].seriesName}：</span>
            <span>${convertByte(params[i].value)}</span>
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
        formatter: (v: number) => convertByte(v)
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
  const { seriesData: hitTrafficSeriesData, xAxisData } = lineChartData(
    dataSource,
    stateTime,
    endTime,
    'hit_traffic',
    'time'
  )
  const { seriesData: originTrafficSeriesData } = lineChartData(
    dataSource,
    stateTime,
    endTime,
    'origin_traffic',
    'time'
  )
  const options = lineStyleOptions(
    ['命中流量', '回流流量'],
    xAxisData,
    [hitTrafficSeriesData, originTrafficSeriesData],
    mergeOptions.value
  )
  instance.value?.clear()
  onUpdate(options as any)
}
const state = inject('statisticState') as any
const loading = ref(false)
const getChartData = () => {
  loading.value = true
  getCdnStatisticTrafficListApi(state.value)
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
