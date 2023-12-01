<template>
  <div>
    <div class="flex flex-row w-full" gap="8px">
      <rank-card
        title="截图次数排名"
        :title-array="['排名', '用户ID', '次数']"
        :data="taskData"
      />
      <div class="flex-1 border border-solid border-color-1">
        <div class="h-11 px-4 py-3 bg-fill-1">截图-总量</div>
        <div
          class="flex flex-col justify-center gap-y-1 items-center w-full h-238px"
        >
          <span class="text-xs text-ct-3">总量</span>
          <span class="text-[28px] text-primary"
            ><span class="big-num">{{
              (dataSource?.count ?? 0).toLocaleString()
            }}</span>
            <span class="text-sm font-medium">次</span>
          </span>
        </div>
      </div>
    </div>
    <div class="mt-2 border border-solid border-color-1">
      <div class="h-11 px-4 py-3 bg-fill-1">截图-用量</div>
      <div class="echarts-box w-full h-302px" ref="el"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMtsCollectDurationApi, type TransCodeModel } from '@vca/apis/mts'
import type { EChartsOption } from 'echarts'
import {
  formatChartsUnix,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  useCharts
} from 'vc-material'

import RankCard from './RankCard.vue'

interface IProps {
  filterData: Record<string, any>
}
const props = withDefaults(defineProps<IProps>(), {})
const xAxisUnit = ref('week')

const { el, onUpdate } = useCharts()
const dataSource = ref<TransCodeModel>()

const taskData = computed<[string, string | number][]>(() => {
  const taskList = dataSource.value?.collect_user_list ?? []
  return taskList.map(item => [item.user_id ?? '-', item.count ?? 0])
})
const mergeOptions = {
  legend: {
    show: false
  },
  grid: {
    top: 24,
    left: 24,
    right: 24,
    bottom: 24
  },
  xAxis: {
    axisLabel: {
      formatter: (v: number) => formatChartsUnix(v, xAxisUnit.value)
    }
  },
  yAxis: {
    axisLabel: {
      formatter: (v: number) => {
        return `${v} 次`
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">${formatUnix(
        params[0].name,
        'YYYY-MM-DD HH:mm:ss'
      )}</p>`
      params.forEach(element => {
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${
            element.color
          }"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${element.seriesName}：</span><span>${
          element.value ?? 0
        }次 </span>
          </span>
        </p>`
      })
      return spans
    }
  }
}
const updateChart = async (data: any[]) => {
  const { seriesData, xAxisData, unit } = lineChartData(
    data,
    Number(props.filterData.begin_time ?? 0),
    Number(props.filterData.end_time ?? 0),
    'count',
    'date'
  )
  const options = lineStyleOptions(
    ['视频截图'],
    xAxisData,
    [seriesData],
    mergeOptions
  )
  xAxisUnit.value = unit ?? 'week'

  onUpdate(options as EChartsOption)
}

//获取普通视频统计
const getNormalVideoData = () => {
  const data = {
    ...props.filterData,
    type: 3
  }
  //@ts-ignore
  getMtsCollectDurationApi(data).then(res => {
    dataSource.value = res

    updateChart(res.screenshot_dosage_list ?? [])
  })
}
watch(
  () => props.filterData,
  v => {
    if (v) {
      getNormalVideoData()
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
