<template>
  <div>
    <a-radio-group
      v-model="status"
      type="button"
      class="p-0!"
      @change="handleChange"
    >
      <a-radio value="put_file">外网流出</a-radio>
      <a-radio value="get_file">外网流入</a-radio>
    </a-radio-group>
    <div class="memory-capacity px-6 py-4 my-4 flex">
      <div class="pr-10 flex flex-col">
        <span class="title">访问总量</span>
        <span class="data-number"
          >{{
            status === 'put_file'
              ? bytesData(outFlowData?.total_byte).value
              : bytesData(InFlowData?.total_byte).value
          }}<span class="unit pl-1">{{
            status === 'put_file'
              ? bytesData(outFlowData?.total_byte).symbols
              : bytesData(InFlowData?.total_byte).symbols
          }}</span></span
        >
      </div>
      <div class="px-10 flex flex-col">
        <span class="title">平均流量</span>
        <span class="data-number"
          >{{
            status === 'put_file'
              ? bytesData(outFlowData?.avg_byte).value
              : bytesData(InFlowData?.avg_byte).value
          }}<span class="unit pl-1">{{
            status === 'put_file'
              ? bytesData(outFlowData?.avg_byte).symbols
              : bytesData(InFlowData?.avg_byte).symbols
          }}</span></span
        >
      </div>
      <div class="pl-10 flex flex-col">
        <span class="title"
          >流量最大空间:
          {{
            status === 'put_file'
              ? outFlowData?.max_bucket_name
              : InFlowData?.max_bucket_name
          }}</span
        >
        <span class="data-number"
          >{{
            status === 'put_file'
              ? bytesData(outFlowData?.max_byte).value
              : bytesData(InFlowData?.max_byte).value
          }}<span class="unit pl-1">{{
            status === 'put_file'
              ? bytesData(outFlowData?.max_byte).symbols
              : bytesData(InFlowData?.max_byte).symbols
          }}</span></span
        >
      </div>
    </div>
    <echarts-line
      v-model:legend="legend"
      v-model:static-data="statisticData"
      :key="getRandom()"
    />
  </div>
</template>

<script setup lang="ts">
import { getFlowApi, putFlowApi } from '@vcp/apis/oss'
import { convertByte, lineChartData } from 'vc-material'

import EchartsLine, { type IEchartsData } from '@/components/EchartsLine.vue'
import type { ByteConverNode } from '@/types/node-manage'

const status = ref<string>('put_file')

const filterData = defineModel<any>('filterData')

const legend = ref(['全部'])

const bytesData = (bytes: string) => {
  return convertByte(Number(bytes), 'B', false, false) as ByteConverNode
}

const getRandom = () => {
  return Math.random()
}

const statisticData = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'week'
})

const outFlowData = ref()
const InFlowData = ref()

/**获取流入流量 */
const getInFlow = () => {
  getFlowApi({
    ...filterData.value,
    bucket_id: filterData.value?.bucket_id || undefined,
    region_id: filterData.value?.region_id || undefined,
    //@ts-ignore
    rangeValue: undefined,
    label: undefined,
    timeDate: undefined
  }).then(res => {
    InFlowData.value = res
    const { trend } = res
    const titleLends: any[] = []
    if (!trend?.length) {
      const { seriesData, unit, xAxisData } = lineChartData(
        [],
        filterData.value?.start,
        filterData.value?.end,
        'val',
        'metric'
      )

      statisticData.value.series[0] = seriesData
      statisticData.value.unit = unit as string
      statisticData.value.xAxis = xAxisData as string[]
      legend.value = filterData.value?.label
        ? [filterData.value?.label]
        : ['全部']
      return
    }

    trend?.map((item: any, index: number) => {
      const { seriesData, unit, xAxisData } = lineChartData(
        item.list,
        filterData.value?.start,
        filterData.value?.end,
        'val',
        'metric'
      )

      if (item.bucket_name) {
        titleLends.push(item.bucket_name)
      }
      statisticData.value.series[index] = seriesData
      statisticData.value.unit = unit as string
      statisticData.value.xAxis = xAxisData as string[]
    })

    legend.value = titleLends
  })
}

/**获取流出流量 */
const getOutFlowData = () => {
  putFlowApi({
    ...filterData.value,
    bucket_id: filterData.value?.bucket_id || undefined,
    region_id: filterData.value?.region_id || undefined,
    //@ts-ignore
    rangeValue: undefined,
    label: undefined,
    timeDate: undefined
  }).then(res => {
    const { trend } = res
    outFlowData.value = res
    const titleLends: any[] = []
    if (!trend?.length) {
      const { seriesData, unit, xAxisData } = lineChartData(
        [],
        filterData.value?.start,
        filterData.value?.end,
        'val',
        'metric'
      )

      statisticData.value.series[0] = seriesData
      statisticData.value.unit = unit as string
      statisticData.value.xAxis = xAxisData as string[]
      legend.value = filterData.value?.label
        ? [filterData.value?.label]
        : ['全部']
      return
    }
    trend?.map((item: any, index: number) => {
      const { seriesData, unit, xAxisData } = lineChartData(
        item.list,
        filterData.value?.start,
        filterData.value?.end,
        'val',
        'metric'
      )
      if (item.bucket_name) {
        titleLends.push(item.bucket_name)
      }
      statisticData.value.series[index] = seriesData
      statisticData.value.unit = unit as string
      statisticData.value.xAxis = xAxisData as string[]
    })

    legend.value = titleLends
  })
}

const handleChange = (val: string | number | boolean) => {
  statisticData.value.series = []
  getRandom()
  if (val === 'put_file') {
    getOutFlowData()
  } else {
    getInFlow()
  }
}

onMounted(() => {
  if (status.value === 'put_file') {
    getOutFlowData()
  } else {
    getInFlow()
  }
})

watch(
  () => filterData.value,
  () => {
    statisticData.value.series = []
    getRandom()
    if (status.value === 'put_file') {
      getOutFlowData()
    } else {
      getInFlow()
    }
  }
)
</script>
