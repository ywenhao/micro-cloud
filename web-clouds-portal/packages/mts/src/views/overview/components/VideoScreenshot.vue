<template>
  <a-spin class="block!" :loading="loading">
    <div>
      <div class="sub-title">截图-总量</div>
      <blue-card class="h-92px!" :data="data" />
    </div>
    <div class="mt-32px">
      <div class="sub-title">截图-用量</div>
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
      <div class="echarts-box w-full" ref="el"></div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { getMtsCollectDosageApi } from '@vcp/apis/mts'
import { disabledDate } from '@vcp/shared'
import type { EChartsOption } from 'echarts'
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

type DateItem = {
  date?: string
  count?: string
}
const data: DataType[] = reactive([{ label: '总量', value: null, unit: '次' }])

const { datePicker, dateRadio, dateValue } = useDatePicker()
const xAxisUnit = ref('week')

const filterData = reactive({
  type: 3,
  begin_time: computed(() => dateValue.value[0]),
  end_time: computed(() => dateValue.value[1])
})

const { el, onUpdate } = useCharts()
const mergeOptions = {
  legend: {
    show: false
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
const updateChart = async (data: DateItem[]) => {
  const { seriesData, xAxisData, unit } = lineChartData(
    data,
    Number(dateValue.value[0]),
    Number(dateValue.value[1]),
    'count',
    'date'
  )
  xAxisUnit.value = unit ?? 'week'
  const options = lineStyleOptions(
    ['视频截图'],
    xAxisData,
    [seriesData],
    mergeOptions
  )

  onUpdate(options as EChartsOption)
}
const {
  loading,
  data: resData,
  run: getData
} = useRequest(getMtsCollectDosageApi, filterData)

getData()
watch(dateValue, () => getData())

watch(resData, resData => {
  // 截图-总量
  data[0].value = resData.count || 0
  // 截图-用量
  const list = resData?.screenshot_dosage_list || []
  updateChart(list)
})
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
