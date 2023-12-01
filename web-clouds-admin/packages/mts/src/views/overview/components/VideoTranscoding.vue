<template>
  <a-spin class="block!" :loading="loading">
    <div>
      <div class="sub-title">转码时长-总量</div>
      <blue-card class="h-92px!" :data="data" />
    </div>
    <div class="mt-32px">
      <div class="sub-title">转码时长-用量</div>
      <div flex gap="8px" items-center w-full>
        <a-radio-group
          v-model="dateRadio"
          :options="mtsDayOpts"
          type="button"
        />
        <a-range-picker
          v-model="datePicker"
          value-format="X"
          :disabled-date="disabledDate"
        />
        <i flex-1 />
        <vc-refresh-button :loading="loading" @click="getData" />
      </div>
      <div class="echarts-box w-full h-352px" ref="el"></div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { type DateItem, getMtsCollectDosageApi } from '@vca/apis/mts'
import type { EChartsOption } from 'echarts'
import {
  formatChartsUnix,
  formatTimeByValue,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  mtsDayOpts,
  useCharts,
  useDatePicker,
  useRequest
} from 'vc-material'

import type { DataType } from '@/components/BlueCard.vue'
import BlueCard from '@/components/BlueCard.vue'
import { disabledDate } from '@/utils/date'

// import EchartsTranscodingUse from './EchartsTranscodingUse.vue'

const data: DataType[] = reactive([
  { label: '4K 高清', value: null, unit: '', key: 6 },
  { label: '2K 高清', value: null, unit: '', key: 5 },
  { label: '高清', value: null, unit: '', key: 4 },
  { label: '标清', value: null, unit: '', key: 3 },
  { label: '普清', value: null, unit: '', key: 2 },
  { label: '低清', value: null, unit: '', key: 1 }
])

const { datePicker, dateRadio, dateValue } = useDatePicker()

const filterData = reactive({
  type: 1,
  begin_time: computed(() => dateValue.value[0]),
  end_time: computed(() => dateValue.value[1])
})
const xAxisUnit = ref('week')
const { el, onUpdate } = useCharts()
const echartsData = ref<Record<string, string>[]>()

const {
  loading,
  data: resData,
  run: getData
} = useRequest(getMtsCollectDosageApi, filterData)

const updateChart = async (data: DateItem[]) => {
  const dataSymbol = ['four_k', 'two_k', 'hd', 'sd', 'general', 'low']
  const seriesList: any = []
  let xAxisList: string[] | number[] = []
  dataSymbol.forEach(symbol => {
    const { seriesData, xAxisData, unit } = lineChartData(
      data,
      Number(dateValue.value[0]),
      Number(dateValue.value[1]),
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

  onUpdate(options)
}

const mergeOptions: EChartsOption = {
  legend: {
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 2,
    data: ['4K高清', '2K高清', '高清', '标清', '普清', '低清']
  },
  color: ['#2253E6', '#04A93A', '#7A81E9', '#F98C46', '#FFD200', '#D6EB57'],
  grid: {
    top: 16,
    left: 0,
    right: 20
  },
  xAxis: {
    axisLabel: {
      formatter: (v: number) => formatChartsUnix(v, xAxisUnit.value)
    }
  },
  yAxis: {
    axisLabel: {
      formatter: (v: number) => {
        const transResult = formatTimeByValue(v)
        return `${transResult[0].time} ${transResult[0].unit}`
      }
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter(params: any) {
      const isDay = xAxisUnit.value === 'day'
      const template = !isDay ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">${formatUnix(
        params[0].name,
        template
      )}</p>`
      params.forEach((element: any) => {
        const transResult = formatTimeByValue(element.value)
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${element.color}"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
           <span>${element.seriesName}：</span><span>${transResult[0].time} ${transResult[0].unit} </span>
          </span>
        </p>`
      })
      return spans
    }
  }
}

watch(dateValue, () => getData())

watch(resData, resData => {
  // 转码时长-总量
  const video_resolution_list = resData?.video_resolution_list || []
  data.forEach(v => {
    const item = video_resolution_list.find(
      item => item.resolution_type === v.key
    )!
    if (!item) return
    v.timeUnit = formatTimeByValue(item.duration || '0').map(v => [
      v.time,
      v.unit
    ])
  })
  // 转码时长-用量
  echartsData.value = resData?.video_dosage_list || []
  updateChart(echartsData.value)
})

onMounted(getData)
</script>

<style lang="less" scoped>
.sub-title {
  font-weight: 500;
  margin-bottom: 12px;
}

:deep(.vca-card) {
  .arco-card-body {
    padding: 0;
  }
}

.echarts-box {
  height: 352px;
}
</style>
