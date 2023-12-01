<script setup lang="ts">
import { getManageStatisticOverviewRegistrationTrendApi } from '@vca/apis/pedestal'
import dayjs from 'dayjs'
import {
  formatUnix,
  lineChartData,
  lineStyleOptions,
  TimeRange,
  timeRangeValue,
  useCharts
} from 'vc-material'

const [st, et] = timeRangeValue(TimeRange.RECENT_7_DAYS)
const state = ref({
  start_tm: st,
  end_tm: et
})

type DateItem = { val: number; tm: number }
const updateChart = async (dataSource: DateItem[]) => {
  const { seriesData, xAxisData } = lineChartData(
    dataSource,
    state.value.start_tm,
    state.value.end_tm,
    'val',
    'tm'
  )
  const options = lineStyleOptions(
    ['新增注册'],
    xAxisData,
    [seriesData as string[]],
    mergeOptions
  )
  onUpdate(options as any)
}
const getRegistrationTrend = () => {
  if (!state.value?.start_tm) {
    const [start, end] = timeRangeValue(TimeRange.RECENT_15_DAYS)
    state.value.start_tm = start
    state.value.end_tm = end
  }
  getManageStatisticOverviewRegistrationTrendApi(state.value as any).then(res =>
    updateChart((res?.list || []) as unknown as DateItem[])
  )
}

const { el, onUpdate } = useCharts()

const mergeOptions = {
  legend: {
    icon: 'rich',
    itemWidth: 20,
    itemHeight: 4
  },
  grid: {
    top: 16,
    left: 0,
    right: 20
  },
  xAxis: {
    axisLabel: {
      formatter: (value: number) => dayjs(value * 1000).format('MM-DD')
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">
        ${formatUnix(params[0].name, 'YYYY-MM-DD')}
      </p>`
      params.forEach((_element, i) => {
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${params[i].color}"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${params[i].seriesName}：</span><span>${params[i].value} </span>
          </span>
        </p>`
      })
      return spans
    }
  }
}

onMounted(() => {
  getRegistrationTrend()
})
</script>
<template>
  <vc-card title="数据趋势">
    <div ref="el" class="h-280px w-full"></div>
  </vc-card>
</template>
