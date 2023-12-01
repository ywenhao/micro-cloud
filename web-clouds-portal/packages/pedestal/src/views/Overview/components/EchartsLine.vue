<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between">
      <span class="text-base font-medium text-ct-1">{{ name }}</span>
    </div>
    <div ref="chartRef" class="w-full h-290px"></div>
  </div>
</template>

<script setup lang="ts">
import 'echarts/lib/component/dataZoom'

import { type EChartsOption } from 'echarts'
import {
  convertByte,
  formatChartsUnix,
  formatUnix,
  lineStyleOptions,
  type SeriesData,
  useCharts
} from 'vc-material'

const { el: chartRef, onUpdate } = useCharts()

export interface IEchartsData {
  xAxis: string[]
  series: SeriesData
  unit: string
}
interface IProps {
  fileNumber?: boolean
  staticData: IEchartsData
}

const props = withDefaults(defineProps<IProps>(), {
  isShowBtn: false,
  fileNumber: false,
  staticData: undefined
})
const name = defineModel<string>('name')
const legend = defineModel<string[]>('legend', { required: true })

/** 列 */
let legends = legend.value
let unit = 'day'
/**
 * option 用于将默认的options覆盖， 此数据会和lineStyleOptions中的默认数据做合并操作
 */
const mergeOptions: EChartsOption = {
  // dataZoom: [{ show: true }],
  color: ['#2253E6', '#00B42A', '#7A81E9', '#F98C46', '#FFD200'],
  //@ts-ignore
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
            <span>${params[i].seriesName}：</span><span>${
          !props.fileNumber ? convertByte(params[i].value) : params[i].value
        } </span>
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

  //@ts-ignore
  yAxis: {
    axisLabel: {
      formatter: (v: number) => (!props.fileNumber ? convertByte(v) : v)
    }
  }
}
const updateChart = (data: IEchartsData) => {
  const { xAxis, series, unit: units } = data || { xAxis: [], series: [] }
  if (xAxis?.length) {
    unit = units
    // 上述的 xAxis, series, legends mergeOptions 需要处理成上面格式 再进行 onUpdate
    const options = lineStyleOptions(legends, xAxis, series, mergeOptions)
    // console.log(options)

    //@ts-ignore
    onUpdate(options)
  }
}

watch(() => props.staticData, updateChart, { deep: true, immediate: true })
watch(
  () => legend.value,
  v => {
    legends = v
    updateChart(props.staticData)
  }
)
</script>
