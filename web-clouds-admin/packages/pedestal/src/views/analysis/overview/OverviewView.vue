<script setup lang="ts">
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'
import {
  getManageStatisticOverviewGeneralApi,
  getManageStatisticOverviewOnlineApi,
  getManageStatisticOverviewRegistrationTrendApi,
  type OverviewGeneral,
  type OverviewOnline
} from '@vca/apis/pedestal'
import dayjs from 'dayjs'
import {
  formatUnix,
  lineChartData,
  lineStyleOptions,
  TimeRange,
  timeRangeValue,
  useCharts,
  usePolling,
  type VcFilterBarScheme
} from 'vc-material'

const schemas: VcFilterBarScheme = {
  widgets: [
    {
      widget: 'range',
      field: '_range',
      startField: 'start_tm',
      endField: 'end_tm',
      attrs: {
        valueFormat: 'X'
      }
    }
  ]
}

const overviewOnline = reactive<OverviewOnline>({
  total: undefined,
  online_number: undefined,
  today_online_number_peak: undefined
})
const overviewGeneral = reactive<OverviewGeneral>({
  nuv: undefined,
  n_nate: undefined,
  pv: undefined,
  p_nate: undefined,
  uv: undefined,
  u_nate: undefined
})

const { el, onUpdate, instance } = useCharts()

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

const getOverviewOnline = () => {
  getManageStatisticOverviewOnlineApi().then(res => {
    Object.assign(overviewOnline, res)
  })
}

const getOverviewGeneral = () => {
  getManageStatisticOverviewGeneralApi().then(res => {
    Object.assign(overviewGeneral, res)
  })
}

// 写一个方法同时调用 getOverviewOnline() getOverviewGeneral() 两个方法
const getOverview = () => {
  getOverviewOnline()
  getOverviewGeneral()
}
// 每隔30秒 调用两个接口 getOverviewOnline() getOverviewGeneral()
usePolling(getOverview, {
  interval: 30 * 1000,
  // 立即执行
  immediate: true
})

const [st, et] = timeRangeValue(TimeRange.RECENT_15_DAYS)
const state = ref<Record<string, any>>({
  start_tm: st,
  end_tm: et,
  _range: [st, et],
  range: TimeRange.RECENT_15_DAYS
})
const onDateChange = (v: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(v))
  state.value.start_tm = start
  state.value.end_tm = end
  getRegistrationTrend()
}

type DateItem = { val: number; tm: number }
const updateChart = async (dataSource: DateItem[]) => {
  instance.value?.clear()
  const { seriesData, xAxisData } = lineChartData(
    dataSource,
    state.value.start_tm,
    state.value.end_tm,
    'val',
    'tm'
  )
  const options = lineStyleOptions(
    ['新增注册'],
    xAxisData,
    [seriesData as string[]],
    mergeOptions
  )
  onUpdate(options as any)
}
const getRegistrationTrend = () => {
  if (!state.value?.start_tm) {
    const [start, end] = timeRangeValue(TimeRange.RECENT_15_DAYS)
    state.value.start_tm = start
    state.value.end_tm = end
    state.value.range = TimeRange.RECENT_15_DAYS
  }
  state.value._range = undefined
  getManageStatisticOverviewRegistrationTrendApi(state.value as any).then(res =>
    updateChart((res?.list || []) as unknown as DateItem[])
  )
}

onMounted(() => {
  getRegistrationTrend()
})
</script>

<template>
  <vc-container admin page-title="数据概览" header-bordered>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="overview-card progress-card">
        <div class="w-3/5">
          <div class="text-ct-1 mb-4">注册总用户数</div>
          <div
            class="primary-text font-big-num"
            v-locale="overviewOnline?.total"
          ></div>
        </div>
        <div class="flex flex-col justify-center gap-y-2 text-sm">
          <div class="flex items-center gap-x-2">
            <label class="text-ct-1">当前在线</label>
            <span
              class="font-medium font-big-num text-ct-2 text-base"
              v-locale="overviewOnline?.online_number"
            >
            </span>
            <a-popover position="bottom">
              <icon-question-circle class="cursor-pointer" />
              <template #content>
                <div class="whitespace-pre-line text-sm">
                  {{ OVERVIEW_TIPS.current }}
                </div>
              </template>
            </a-popover>
          </div>
          <div class="flex items-center gap-x-2">
            <label class="text-ct-1">今日峰值</label>
            <span
              class="font-medium font-big-num text-ct-2 text-base"
              v-locale="overviewOnline?.today_online_number_peak"
            >
            </span>
          </div>
        </div>
      </div>
      <div class="overview-card">
        <div class="flex-1 flex flex-col justify-center items-start">
          <header class="text-ct-1 mb-4">
            <label>今日新增注册用户</label>
            <a-popover position="bottom">
              <icon-question-circle class="cursor-pointer" />
              <template #content>
                <div class="whitespace-pre-line text-sm">
                  {{ OVERVIEW_TIPS.today }}
                </div>
              </template>
            </a-popover>
          </header>
          <div
            class="secondary-text font-big-num mb-1"
            v-locale="overviewGeneral?.nuv"
          ></div>
          <analysis-tag :model-value="overviewGeneral?.n_nate" />
        </div>
        <a-divider direction="vertical" class="h-full! mx-6!" />
        <div class="flex-1 flex flex-col justify-center items-start">
          <header class="text-ct-1 mb-4">
            <label>今日平台PV/UV</label>
            <a-popover position="bottom">
              <icon-question-circle class="cursor-pointer" />
              <template #content>
                <div class="whitespace-pre-line text-sm">
                  {{ OVERVIEW_TIPS.pv_uv }}
                </div>
              </template>
            </a-popover>
          </header>
          <div class="grid grid-cols-2 gap-x-14">
            <div class="flex flex-col">
              <div
                class="secondary-text font-big-num mb-1"
                v-locale="overviewGeneral?.pv"
              ></div>
              <analysis-tag :model-value="overviewGeneral?.p_nate" />
            </div>
            <div class="flex flex-col">
              <div
                class="secondary-text font-big-num mb-1"
                v-locale="overviewGeneral?.uv"
              ></div>
              <analysis-tag :model-value="overviewGeneral?.u_nate" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <vc-card :bordered="false" title="数据趋势">
      <template #description>
        <vc-filter-bar
          class="mt-3"
          :schemas="schemas"
          v-model="state"
          @search="getRegistrationTrend"
        >
          <template #prefix>
            <a-radio-group
              @change="onDateChange"
              v-model="state.range"
              type="button"
              :options="[
                { label: '近15日', value: TimeRange.RECENT_15_DAYS },
                { label: '近30日', value: TimeRange.RECENT_30_DAYS }
              ]"
            ></a-radio-group>
          </template>
        </vc-filter-bar>
      </template>
      <div ref="el" class="h-320px w-full"></div>
    </vc-card>
  </vc-container>
</template>

<style lang="less" scoped>
.overview-card {
  @apply flex items-top rounded-md p-6 border-color-1!;
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.3) 0%,
    rgba(232, 243, 255, 0.1) 100%
  );
  // h-34
  border: 1px solid;

  &.progress-card {
    @apply relative bg-cover bg-no-repeat;
    background-image: url('@/assets/images/progress-card-bg.png');
    &::after {
      content: '';
      @apply absolute rounded h-1 w-full left-0 top-0;
      background: rgba(0, 0, 0, 0.1);
    }
    &::before {
      content: '';
      @apply absolute rounded h-1 left-0 top-0 bg-success-3;
      width: 0;
      animation: timer 30s infinite linear;
    }
    @keyframes timer {
      0% {
        top: 2px;
        width: 0;
        height: 0px;
        opacity: 0;
      }
      0.2% {
        top: 0px;
        width: 0.2%;
        height: 4px;
      }
      3% {
        opacity: 1;
      }
      99% {
        height: 4px;
        opacity: 1;
      }
      100% {
        width: 100%;
        height: 0px;
        opacity: 0;
      }
    }
  }
}
</style>
