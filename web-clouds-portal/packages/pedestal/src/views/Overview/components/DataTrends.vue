<script setup lang="ts">
import { getCdnOverviewTrafficApi } from '@vcp/apis/cdn'
import { ossOverviewApi } from '@vcp/apis/oss'
import dayjs from 'dayjs'
import { lineChartData, lineStyleOptions, useCharts } from 'vc-material'

import { mergeOptions } from './cdnEcharts'
import EchartsLine, { type IEchartsData } from './EchartsLine.vue'

type DateRadio = -1 | 0 | 7
const ossRadio = ref<DateRadio>(0)
const cdnRadio = ref<DateRadio>(0)

const radioOpts = [
  { label: '今日', value: 0 },
  { label: '昨日', value: -1 },
  { label: '近7日', value: 7 }
]

const getUnix = (value: DateRadio) => {
  const time = dayjs().set('hour', 0).set('minute', 0).set('second', 0)
  const start = time.subtract(value, 'days').unix()
  return [start, start + 86399]
}

const ossState = reactive({
  loading: false,
  lineData: {
    xAxis: [],
    series: [],
    unit: 'week'
  } as IEchartsData
})

const cdnState = reactive({
  loading: false
})

/**获取概览数据 */
const getOssOverview = () => {
  ossState.loading = true
  const [start, end] = getUnix(ossRadio.value)
  ossOverviewApi({
    start: String(start),
    end: String(end)
  })
    .then(res => {
      const { trend } = res
      const storage = lineChartData(trend, start, end, 'val', 'metric')
      ossState.lineData.xAxis = storage.xAxisData as string[]
      ossState.lineData.series[0] = storage.seriesData
      ossState.lineData.unit = storage.unit as string
    })
    .finally(() => {
      ossState.loading = false
    })
}

const { el: cdnEl, onUpdate } = useCharts()

const updateCdnChart = (xAxisData: number[], data: any) => {
  const legend = ['命中流量', '回源流量']
  const options = lineStyleOptions(legend, xAxisData, data, mergeOptions)

  onUpdate(options as any)
}

const getCdnOverview = () => {
  cdnState.loading = true
  const [start, end] = getUnix(cdnRadio.value)

  getCdnOverviewTrafficApi({
    start_time: String(start),
    end_time: String(end)
  })
    .then(res => {
      const { seriesData: hitSeriesData, xAxisData } = lineChartData(
        res?.list || [],
        start,
        end,
        'hit_traffic',
        'time'
      )
      const { seriesData: returnSeriesData } = lineChartData(
        res?.list || [],
        start,
        end,
        'origin_traffic',
        'time'
      )
      const data = [hitSeriesData, returnSeriesData]
      updateCdnChart(xAxisData, data)
    })
    .finally(() => {
      cdnState.loading = false
    })
}

onMounted(() => {
  getOssOverview()
  getCdnOverview()
})
</script>
<template>
  <vc-card title="数据趋势">
    <div class="chart-header">
      <label>云存储 OSS</label>
      <a-radio-group
        size="small"
        :options="radioOpts"
        v-model="ossRadio"
        @change="getOssOverview"
        type="button"
      />
    </div>
    <a-spin class="inline w-full" :loading="ossState.loading">
      <echarts-line :legend="['存储总量']" :static-data="ossState.lineData" />
    </a-spin>
    <div class="chart-header mt-40px">
      <label>云分发 CDN</label>
      <a-radio-group
        :options="radioOpts"
        v-model="cdnRadio"
        size="small"
        type="button"
        @change="getCdnOverview"
      />
    </div>
    <a-spin class="inline w-full" :loading="cdnState.loading">
      <div ref="cdnEl" class="h-280px w-full mt-6"></div>
    </a-spin>
  </vc-card>
</template>

<style scoped lang="less">
.chart-header {
  @apply flex items-center justify-between text-sm font-medium text-ct-1;
  line-height: 20px;
}
</style>
