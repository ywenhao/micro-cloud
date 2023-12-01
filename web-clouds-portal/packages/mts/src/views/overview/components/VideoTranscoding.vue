<template>
  <a-spin class="block!" :loading="loading">
    <div>
      <div class="sub-title">转码时长-总量</div>
      <blue-card class="h-92px!" :data="dataSource" />
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
import { type DateItem, getMtsCollectDosageApi } from '@vcp/apis/mts'
import { disabledDate } from '@vcp/shared'
import type { EChartsOption } from 'echarts'
import { formatTimeByValue } from 'vc-material'
import {
  formatChartsUnix,
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

const dataSource: DataType[] = reactive([
  { label: '4K 高清', value: null, unit: '', key: 6 },
  { label: '2K 高清', value: null, unit: '', key: 5 },
  { label: '高清', value: null, unit: '', key: 4 },
  { label: '标清', value: null, unit: '', key: 3 },
  { label: '普清', value: null, unit: '', key: 2 },
  { label: '低清', value: null, unit: '', key: 1 }
])

const { datePicker, dateRadio, dateValue } = useDatePicker()

const xAxisUnit = ref('week')
const filterData = reactive({
  type: 1,
  begin_time: computed(() => dateValue.value[0]),
  end_time: computed(() => dateValue.value[1])
})
const { el, onUpdate } = useCharts()

const updateChart = (data: DateItem[]) => {
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

  onUpdate(options as EChartsOption)
}
const {
  loading,
  data: resData,
  run: getData
} = useRequest(getMtsCollectDosageApi, filterData)

watch(dateValue, () => {
  getData()
})

onMounted(getData)

// watchEffect(() => {
//   console.log(formatDate.value)
// })

watch(resData, resData => {
  // 转码时长-总量
  const video_resolution_list = resData?.video_resolution_list || []
  dataSource.forEach(v => {
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
  const list = resData?.video_dosage_list || []
  updateChart(list)
})
const mergeOptions = {
  legend: {
    icon: 'rect',
    itemWidth: 8,
    itemHeight: 2,
    data: ['4K高清', '2K高清', '高清', '标清', '普清', '低清']
  },
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
</script>

<style lang="less" scoped>
.sub-title {
  font-weight: 500;
  margin-bottom: 12px;
}

:deep(.value) {
  .unit {
    margin-left: 0;
  }
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
