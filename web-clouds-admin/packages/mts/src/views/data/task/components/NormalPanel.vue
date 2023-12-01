<template>
  <div class="panel-box">
    <div class="flex" gap="8px">
      <rank-card
        title="转码时长排名"
        :title-array="['排名', '用户ID', '时长']"
        :data="rankData"
      />
      <turn-long-total :data="turnLongTotalData" />
    </div>
    <div class="mt-2">
      <div class="h-11 px-4 py-3 bg-fill-1 border border-solid border-color-1">
        转码时长-用量
      </div>
      <div class="echarts-box w-full h-352px" ref="el"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type DateItem,
  getMtsCollectDurationApi,
  type TransCodeModel
} from '@vca/apis/mts'
import type { EChartsOption } from 'echarts'
import {
  formatChartsUnix,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  useCharts
} from 'vc-material'
import { formatTime, formatTimeByValue } from 'vc-material'

import type { DataType } from '@/components/BlueCard.vue'

import RankCard from './RankCard.vue'
import TurnLongTotal from './TurnLongTotal.vue'

interface IProps {
  filterData: Record<string, any>
}
const props = withDefaults(defineProps<IProps>(), {})
const { el, onUpdate } = useCharts()
const xAxisUnit = ref('week')

const dataSource = ref<TransCodeModel>()
const rankData = computed<[string, string | number][]>(() => {
  const taskList = dataSource.value?.collect_user_list ?? []
  return taskList.map(item => [item.user_id!, formatTime(item.count || 0)])
})

const turnLongTotalData = reactive<DataType[]>([
  { label: '4K 高清', value: '', key: 6, unit: '' },
  { label: '2K 高清', value: '', key: 5, unit: '' },
  { label: '高清', value: '', key: 4, unit: '' },
  { label: '标清', value: '', key: 3, unit: '' },
  { label: '普清', value: '', key: 2, unit: '' },
  { label: '低清', value: '', key: 1, unit: '' }
])

const updateChart = async (data: DateItem[]) => {
  const dataSymbol = ['four_k', 'two_k', 'hd', 'sd', 'general', 'low']
  const seriesList: any = []
  let xAxisList: string[] | number[] = []
  dataSymbol.forEach(symbol => {
    const { seriesData, xAxisData, unit } = lineChartData(
      data,
      Number(props.filterData.begin_time ?? 0),
      Number(props.filterData.end_time ?? 0),
      symbol,
      'date'
    )
    seriesList.push(seriesData)
    xAxisList = xAxisData
    xAxisUnit.value = unit ?? 'week'
  })

  const options = lineStyleOptions(
    ['4K高清', '2K高清', '高清', '标清', '普清', '低清'],
    xAxisList,
    seriesList,
    mergeOptions
  )

  onUpdate(options as EChartsOption)
}
//获取普通视频统计
const getNormalVideoData = () => {
  const data = {
    ...props.filterData,
    type: 1
  }
  // @ts-ignore
  getMtsCollectDurationApi(data).then(res => {
    dataSource.value = res
    const resolutionList = res.video_resolution_list ?? []
    turnLongTotalData.forEach(v => {
      const item = resolutionList.find(item => item.resolution_type === v.key)!
      v.timeUnit = formatTimeByValue(item.duration || '0').map(v => [
        v.time,
        v.unit
      ])
    })

    updateChart(res.video_dosage_list ?? [])
  })
}

const mergeOptions = {
  legend: {
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 2,
    data: ['4K高清', '2K高清', '高清', '标清', '普清', '低清']
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
        const transReult = formatTimeByValue(v)
        return `${transReult[0].time} ${transReult[0].unit}`
      }
    }
  },
  color: ['#2253E6', '#04A93A', '#7A81E9', '#F98C46', '#FFD200', '#D6EB57'],
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">${formatUnix(
        params[0].name,
        'YYYY-MM-DD HH:mm:ss'
      )}</p>`
      params.forEach(element => {
        const transReult = formatTimeByValue(element.value)
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${element.color}"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${element.seriesName}：</span><span>${transReult[0].time} ${transReult[0].unit} </span>
          </span>
        </p>`
      })
      return spans
    }
  }
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
