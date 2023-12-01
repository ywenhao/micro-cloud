<template>
  <vca-card title="今日数据趋势">
    <a-radio-group
      v-model="type"
      :options="types"
      type="button"
      @change="(value:string|boolean|number)=>handleCommand(value as ICommand)"
    >
    </a-radio-group>
    <div ref="el" class="h-280px w-full mt-6"></div>
  </vca-card>
</template>

<script setup lang="ts">
import {
  getCdnOverviewBandwidthApi,
  getCdnOverviewIpAccessesApi,
  getCdnOverviewIpHitRateApi,
  getCdnOverviewRequestsApi,
  getCdnOverviewTrafficApi
} from '@vca/apis/cdn'
import {
  convertByte,
  formatChartsUnix,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  TimeRange,
  timeRangeValue,
  useCharts
} from 'vc-material'

const types = [
  { label: '流量', value: 'flow' },
  { label: '带宽', value: 'bandwidth' },
  { label: '请求数', value: 'requests' },
  { label: '独立IP访问数', value: 'IpAccesses' },
  { label: '命中率', value: 'hitRate' }
]
const type = ref('flow')

const { el, onUpdate, instance } = useCharts()

const [st, et] = timeRangeValue(TimeRange.TODAY)
const state = ref({
  start_time: st,
  end_time: et
})

const legend = ref(['命中流量', '回源流量'])
const trafficUnit = ref<boolean>(true)
const yAxisUnit = ref<string>('')

const mergeOptions = {
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
      params.forEach((element, i) => {
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${
            params[i].color
          }"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${params[i].seriesName}：</span><span>${
          trafficUnit.value
            ? convertByte(params[i].value)
            : `${params[i].value} ${yAxisUnit.value}`
        } </span>
          </span>
        </p>`
      })
      return spans
    }
  },
  grid: {
    top: 16,
    left: 0,
    right: 20
  },
  xAxis: {
    axisLabel: {
      formatter: (v: number) => formatChartsUnix(v, 'day')
    }
  },
  yAxis: {
    axisLabel: {
      formatter: (v: number) =>
        trafficUnit.value ? convertByte(v) : `${v} ${yAxisUnit.value}`
    }
  }
}

const updateChart = async (xAxisData: number[], data: any) => {
  const options = lineStyleOptions(legend.value, xAxisData, data, mergeOptions)

  onUpdate(options as any)
}

type ICommand = 'flow' | 'bandwidth' | 'requests' | 'IpAccesses' | 'hitRate'
const handleCommand = (command: ICommand) => {
  instance.value?.clear()
  const strategies: Strategies<() => void> = {
    flow: () => {
      legend.value = ['命中流量', '回源流量']
      trafficUnit.value = true
      getCdnOverviewTrafficApi(state.value as any).then(res => {
        const { seriesData: hitSeriesData, xAxisData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'hit_traffic',
          'time'
        )
        const { seriesData: returnSeriesData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'origin_traffic',
          'time'
        )
        const data = [hitSeriesData, returnSeriesData]
        updateChart(xAxisData, data)
      })
    },
    bandwidth: () => {
      legend.value = ['峰值带宽']
      trafficUnit.value = true
      getCdnOverviewBandwidthApi(state.value as any).then(res => {
        const { seriesData, xAxisData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'bandwidth',
          'time'
        )
        const data = [seriesData]
        updateChart(xAxisData, data)
      })
    },
    requests: () => {
      legend.value = ['请求数', '命中数']
      trafficUnit.value = false
      yAxisUnit.value = '个'
      getCdnOverviewRequestsApi(state.value as any).then(res => {
        const { seriesData: requestSeriesData, xAxisData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'request_total',
          'time'
        )
        const { seriesData: hitRequestSeriesData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'hit_request_total',
          'time'
        )
        const data = [requestSeriesData, hitRequestSeriesData]
        updateChart(xAxisData, data)
      })
    },
    IpAccesses: () => {
      legend.value = ['独立IP访问数']
      trafficUnit.value = false
      yAxisUnit.value = '次'
      getCdnOverviewIpAccessesApi(state.value as any).then(res => {
        const { seriesData, xAxisData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'ips',
          'time'
        )
        const data = [seriesData]
        updateChart(xAxisData, data)
      })
    },
    hitRate: () => {
      legend.value = ['请求命中率', '流量命中率']
      trafficUnit.value = false
      yAxisUnit.value = '%'
      getCdnOverviewIpHitRateApi(state.value as any).then(res => {
        const { seriesData: requestHitSeriesData, xAxisData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'request_hit',
          'time'
        )
        const { seriesData: trafficHitRequestSeriesData } = lineChartData(
          res?.list,
          state.value.start_time,
          state.value.end_time,
          'traffic_hit',
          'time'
        )
        const data = [requestHitSeriesData, trafficHitRequestSeriesData]
        updateChart(xAxisData, data)
      })
    }
  }
  strategies[command] && strategies[command]()
}

onMounted(() => {
  handleCommand('flow')
})
</script>
