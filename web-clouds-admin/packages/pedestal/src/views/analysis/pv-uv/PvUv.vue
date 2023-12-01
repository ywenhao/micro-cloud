<script setup lang="ts">
import {
  IconQuestionCircle,
  IconQuestionCircleFill
} from '@arco-design/web-vue/es/icon'
import {
  getManageStatisticPuGeneralApi,
  getManageStatisticPuTrendApi
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

import type { PV_UV_KEY } from '@/config/analysis'

const schemas: VcFilterBarScheme = {
  widgets: [{ widget: 'range', field: 'date' }]
}

// 今日新增 昨日新增 本周新增 本月新增
const cardsOptions: { label: string; filed: PV_UV_KEY }[] = [
  { label: '今日新增', filed: 'today' },
  { label: '昨日新增', filed: 'yesterday' },
  { label: '本周新增', filed: 'week' },
  { label: '本月新增', filed: 'month' }
]
type FormSatateKey = 'value' | 'rise'
type FormState = Record<
  FormSatateKey,
  {
    [key in PV_UV_KEY]: {
      pv: number
      uv: number
    }
  }
>
const formState = reactive<FormState>({
  value: {
    today: {
      pv: 800,
      uv: 600
    },
    yesterday: {
      pv: 2300,
      uv: 1800
    },
    week: {
      pv: 3700,
      uv: 2800
    },
    month: {
      pv: 65000,
      uv: 50000
    }
  },
  //  涨跌
  rise: {
    today: {
      pv: 5.16,
      uv: 6.24
    },
    yesterday: {
      pv: -12.87,
      uv: -11.24
    },
    week: {
      pv: -9.15,
      uv: -8.24
    },
    month: {
      pv: 4.68,
      uv: 5.24
    }
  }
})

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

const getStatisticPuGeneral = () => {
  getManageStatisticPuGeneralApi().then(res => {
    // 今日
    formState.value.today.pv = Number(res?.cur_day_pv || 0)
    formState.value.today.uv = Number(res?.cur_day_uv || 0)
    formState.rise.today.pv = Number(res?.cur_day_pv_rate || 0)
    formState.value.today.uv = Number(res?.cur_day_uv_rate || 0)
    // 昨日
    formState.value.yesterday.pv = Number(res?.last_day_pv || 0)
    formState.value.yesterday.uv = Number(res?.last_day_uv || 0)
    formState.rise.yesterday.pv = Number(res?.last_day_pv_rate || 0)
    formState.value.yesterday.uv = Number(res?.last_day_uv_rate || 0)
    // 本周
    formState.value.yesterday.pv = Number(res?.week_pv || 0)
    formState.value.yesterday.uv = Number(res?.week_uv || 0)
    formState.rise.yesterday.pv = Number(res?.week_pv_rate || 0)
    formState.value.yesterday.uv = Number(res?.week_uv_rate || 0)
    // 本月
    formState.value.month.pv = Number(res?.mon_pv || 0)
    formState.value.month.uv = Number(res?.mon_uv || 0)
    formState.rise.month.pv = Number(res?.mon_pv_rate || 0)
    formState.value.month.uv = Number(res?.mon_uv_rate || 0)
  })
}

const { el, onUpdate, instance } = useCharts()
const [st, et] = timeRangeValue(TimeRange.RECENT_7_DAYS)
const state = ref({
  start_tm: st,
  end_tm: et,
  _range: [st, et],
  range: TimeRange.RECENT_7_DAYS
})
type DateItem = { val: number; tm: number }
const updateChart = async (dataSource: DateItem[]) => {
  instance.value?.clear()
  const { seriesData: pvSeriesData, xAxisData } = lineChartData(
    dataSource,
    state.value.start_tm,
    state.value.end_tm,
    'pv',
    'tm'
  )
  const { seriesData: uvSeriesData } = lineChartData(
    dataSource,
    state.value.start_tm,
    state.value.end_tm,
    'uv',
    'tm'
  )
  const options = lineStyleOptions(
    ['PV', 'UV'],
    xAxisData,
    [pvSeriesData, uvSeriesData],
    mergeOptions
  )
  onUpdate(options as any)
}

const getStatisticPuTrendApi = () => {
  if (!state.value?.start_tm) {
    const [start, end] = timeRangeValue(TimeRange.RECENT_7_DAYS)
    state.value.start_tm = start
    state.value.end_tm = end
    state.value.range = TimeRange.RECENT_7_DAYS
  }
  getManageStatisticPuTrendApi(state.value as any).then(res =>
    updateChart((res?.list || []) as unknown as DateItem[])
  )
}
const onDateChange = (v: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(v))
  state.value.start_tm = start
  state.value.end_tm = end
  getStatisticPuTrendApi()
}

onMounted(() => {
  getStatisticPuGeneral()
  getStatisticPuTrendApi()
})
</script>

<template>
  <vc-container admin page-title="访问分析" header-bordered>
    <div class="header-cards">
      <template v-for="(item, index) in cardsOptions" :key="item.filed">
        <div class="flex-1 flex flex-col justify-center items-start">
          <header class="text-ct-1 mb-4 flex items-center gap-1">
            <label>{{ item.label }}</label>
            <a-popover position="bottom">
              <icon-question-circle class="cursor-pointer" />
              <template #content>
                <div class="whitespace-pre-line text-sm">
                  {{ PV_UV_TIPS[item.filed] }}
                </div>
              </template>
            </a-popover>
          </header>
          <div class="grid grid-cols-2 gap-x-7">
            <div class="flex flex-col">
              <div class="secondary-text font-big-num mb-1">
                {{ formState.value[item.filed].pv }}
              </div>
              <analysis-tag :model-value="formState.rise[item.filed].pv" />
            </div>
            <div class="flex flex-col">
              <div class="secondary-text font-big-num mb-1">
                {{ formState.value[item.filed].uv }}
              </div>
              <analysis-tag :model-value="formState.rise[item.filed].uv" />
            </div>
          </div>
        </div>
        <a-divider
          v-if="index < cardsOptions.length - 1"
          direction="vertical"
          class="mx-6! h-auto!"
        />
      </template>
    </div>
    <vc-card :bordered="false" title="访问趋势">
      <template #title>
        <span>访问趋势</span>
        <a-popover position="bottom">
          <icon-question-circle-fill class="cursor-pointer text-ct-3! ml-1" />
          <template #content>
            <div class="whitespace-pre-line text-sm">
              {{ PV_UV_TIPS.trend }}
            </div>
          </template>
        </a-popover>
      </template>
      <template #description>
        <vc-filter-bar :refresh="false" class="mt-3" :schemas="schemas">
          <template #prefix>
            <a-radio-group
              :default-value="3"
              @change="onDateChange"
              type="button"
              :options="[
                { label: '今日', value: 2 },
                { label: '昨日', value: 1 },
                { label: '近7日', value: 3 },
                { label: '近30日', value: 4 }
              ]"
            ></a-radio-group>
          </template>
        </vc-filter-bar>
      </template>
      <div ref="el" class="h-254px w-full"></div>
    </vc-card>
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
