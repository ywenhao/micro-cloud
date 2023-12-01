<script setup lang="ts">
import { IconQuestionCircleFill } from '@arco-design/web-vue/es/icon'
import {
  getManageStatisticKeepTrendApi,
  type StatisticKeepTrend
} from '@vca/apis/pedestal'
import dayjs from 'dayjs'
import {
  formatUnix,
  lineChartData,
  lineStyleOptions,
  TimeRange,
  timeRangeValue,
  useCharts,
  type VcFilterBarScheme
} from 'vc-material'

import { useRetainedDetailTable } from './useRetainedDetailTable'

const loading = ref(false)
const { columns, tableType } = useRetainedDetailTable()
const schemas: VcFilterBarScheme = {
  widgets: [{ widget: 'range', field: 'date' }]
}

const mergeOptions = {
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">
        ${formatUnix(params[0].name, 'YYYY-MM-DD')}
      </p>`
      params.forEach((_element, i) => {
        spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${params[i].color}"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${params[i].seriesName}：</span><span>${params[i].value} </span>
          </span>
        </p>`
      })
      return spans
    }
  },
  grid: {
    top: 24,
    left: 24,
    right: 24,
    bottom: 24
  },
  xAxis: {
    axisLabel: {
      formatter: (value: number) => dayjs(value * 1000).format('MM-DD')
    }
  }
}

const { el, onUpdate, instance } = useCharts()
const [st, et] = timeRangeValue(TimeRange.RECENT_15_DAYS)
const state = ref({
  start_tm: st,
  end_tm: et,
  _range: [st, et],
  range: TimeRange.RECENT_15_DAYS
})
const filterKeep = ref('keep1')
// 定义补全数据方法
const completeData = (data: StatisticKeepTrend[]) => {
  const result: StatisticKeepTrend[] = []
  const { xAxisData } = lineChartData(
    dataSource.value,
    state.value.start_tm,
    state.value.end_tm,
    'keep1',
    'tm'
  )
  xAxisData.forEach(item => {
    const record = data.find(d => String(d.tm) === String(item))
    result.push({
      tm: item,
      nuv: record?.nuv || 0,
      keep1: Number(record?.keep1 || 0),
      keep_rate1: record?.keep_rate1 || 0,
      keep3: Number(record?.keep3 || 0),
      keep_rate3: record?.keep_rate3 || 0,
      keep7: Number(record?.keep7 || 0),
      keep_rate7: record?.keep_rate7 || 0,
      keep15: Number(record?.keep15 || 0),
      keep_rate15: record?.keep_rate15 || 0
    })
  })
  return result
}

const keepTitleMap: Record<string, string> = {
  keep1: '次日留存',
  keep3: '3日留存',
  keep7: '7日留存'
}

const dataSource = ref<StatisticKeepTrend[]>([])
const updateChart = async () => {
  instance.value?.clear()
  // @ts-ignore
  const seriesData = dataSource.value.map(item => item[filterKeep.value])
  const xAxisData = dataSource.value.map(item => Number(item.tm))
  const options = lineStyleOptions(
    [keepTitleMap[filterKeep.value]],
    xAxisData,
    [seriesData],
    mergeOptions
  )
  onUpdate(options as any)
}

const getStatisticKeepTrend = () => {
  if (!state.value?.start_tm) {
    const [start, end] = timeRangeValue(TimeRange.RECENT_15_DAYS)
    state.value.start_tm = start
    state.value.end_tm = end
    state.value.range = TimeRange.RECENT_15_DAYS
  }
  loading.value = true
  getManageStatisticKeepTrendApi(state.value as any)
    .then(res => {
      dataSource.value = completeData((res?.list || []) as any)
      updateChart()
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
const onDateChange = (v: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(v))
  state.value.start_tm = start
  state.value.end_tm = end
  getStatisticKeepTrend()
}
onMounted(() => {
  getStatisticKeepTrend()
})
</script>

<template>
  <vc-container admin page-title="留存分析" header-bordered>
    <a-spin :loading="loading" class="w-full h-full">
      <vc-card class="-mt-2" :bordered="false" title="留存趋势">
        <template #description>
          <vc-filter-bar class="mt-3" :refresh="false" :schemas="schemas">
            <template #prefix>
              <a-radio-group
                :default-value="1"
                v-model="state.range"
                @change="onDateChange"
                type="button"
                :options="[
                  { label: '近15日', value: TimeRange.RECENT_15_DAYS },
                  { label: '近30日', value: TimeRange.RECENT_30_DAYS }
                ]"
              ></a-radio-group>
            </template>
            <template #suffix>
              <a-radio-group
                v-model="filterKeep"
                type="button"
                @change="updateChart"
                :options="[
                  { label: '次日留存', value: 'keep1' },
                  { label: '3日留存', value: 'keep3' },
                  { label: '7日留存', value: 'keep7' }
                ]"
              ></a-radio-group>
            </template>
          </vc-filter-bar>
        </template>
        <div ref="el" class="h-254px w-full"></div>
      </vc-card>
      <vc-card :bordered="false" title="留存趋势">
        <template #title>
          <span>留存详情</span>
          <a-popover position="bottom">
            <icon-question-circle-fill class="cursor-pointer text-ct-3! ml-1" />
            <template #content>
              <div class="whitespace-pre-line text-sm">
                {{ RETAINED_TIPS.detail }}
              </div>
            </template>
          </a-popover>
        </template>
        <template #extra>
          <a-radio-group
            v-model="tableType"
            type="button"
            :options="[
              { label: '留存数', value: 'keep' },
              { label: '留存率', value: 'keep_rate' }
            ]"
          ></a-radio-group>
        </template>
        <a-table
          :bordered="false"
          :data="dataSource"
          :pagination="{
            showTotal: true,
            total: dataSource.length,
            pageSize: 20,
            pageSizeOptions: [10, 20, 30, 40, 50],
            showPageSize: true
          }"
          :columns="columns"
          column-resizable
          :loading="loading"
          page-position="bl"
        >
        </a-table>
      </vc-card>
    </a-spin>
  </vc-container>
</template>

<style lang="less" scoped>
:deep(.vc-card) {
  .arco-card-header,
  .arco-card-body {
    @apply px-0!;
  }
  .arco-card-header {
    @apply pt-2!;
  }
}
.header-cards {
  @apply flex items-stretch mb-6 py-4 px-6;
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.3) 0%,
    rgba(232, 243, 255, 0.1) 100%
  );
  border: 1px solid var(--color-border-1, #f2f3f5);
  border-radius: 6px;
}
</style>
./useRetainedDetailTable
