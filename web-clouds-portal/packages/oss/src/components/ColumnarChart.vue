<template>
  <div class="flex grid grid-cols-2 gap-x-10 items-center">
    <div ref="chartRef" class="w-1/2 h-122px"></div>
    <div class="w-1/2 flex flex-col gap-y-1">
      <div
        v-for="(item, index) in yAxisData"
        :key="index"
        class="flex items-center grid grid-cols-2 gap-x-1"
      >
        <span class="flex items-center text-xs text-ct-1">
          <span
            class="w-6px h-6px mr-2"
            :style="{ backgroundColor: colorList[index] }"
          ></span>
          <span class="w-140px truncate">{{ xAxisData[index] }}</span>
        </span>
        <span class="text-left text-xs text-ct-1 font-medium">{{
          convertByte(item)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type EChartsOption } from 'echarts'
import { barStyleOptions, convertByte, useCharts } from 'vc-material'

const { el: chartRef, onUpdate } = useCharts()

interface IProps {
  staticData: any
}

const props = withDefaults(defineProps<IProps>(), {
  staticData: undefined
})

const colorList = ['#5775FF', '#8F83FF', '#31D9A4', '#F98B46', '#F7DB57']

/** option 用于将默认的options覆盖， 此数据会和barStyleOptions中的默认数据做合并操作 */
const mergeOptions: EChartsOption = {
  grid: {
    top: '10px',
    bottom: '10px',
    right: 0,
    left: '0%'
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#E5E6EB'
      }
    },
    axisLabel: {
      show: false
    }
  },
  //@ts-ignore
  yAxis: {
    axisLabel: {
      formatter: (v: number) => convertByte(v)
    }
  }
}

const xAxisData = ref<string[]>([])
const yAxisData = ref<number[]>([])

const updateChart = (data: any) => {
  const { xAxis, series } = data || { xAxis: [], series: [] }

  xAxisData.value = xAxis
  yAxisData.value = series
  const options = barStyleOptions(xAxis, series, mergeOptions)
  //@ts-ignore
  onUpdate(options)
}

watch(() => props.staticData, updateChart, { deep: true, immediate: true })
</script>
