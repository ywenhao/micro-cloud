<script setup lang="ts">
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'
import {
  addManageStatisticNewRegistrationGeneralApi,
  addManageStatisticNewRegistrationRegionApi,
  addManageStatisticNewRegistrationTopBrowserApi,
  addManageStatisticNewRegistrationTrendApi,
  type NewRegistrationRegion,
  type RegistrationGeneral
} from '@vca/apis/pedestal'
import dayjs from 'dayjs'
import {
  formatUnix,
  lineChartData,
  lineStyleOptions,
  preStyleOptions,
  TimeRange,
  timeRangeValue,
  useCharts,
  type VcFilterBarScheme
} from 'vc-material'

import type { USER_CARD_KEY } from '@/config/analysis'

const schemas: VcFilterBarScheme = {
  widgets: [{ widget: 'range', field: 'date' }]
}
const displayMode = ref('map')

// 今日新增 昨日新增 本周新增 本月新增
const cardsOptions: {
  label: string
  tips: USER_CARD_KEY
  valueFiled: 'cur_day_nuv' | 'last_day_nuv' | 'week_nuv' | 'mon_nuv'
  rateFiled: 'cur_day_rate' | 'last_day_rate' | 'week_rate' | 'mon_rate'
}[] = [
  {
    label: '今日新增',
    tips: 'today',
    valueFiled: 'cur_day_nuv',
    rateFiled: 'cur_day_rate'
  },
  {
    label: '昨日新增',
    tips: 'yesterday',
    valueFiled: 'last_day_nuv',
    rateFiled: 'last_day_rate'
  },
  {
    label: '本周新增',
    tips: 'week',
    valueFiled: 'week_nuv',
    rateFiled: 'week_rate'
  },
  {
    label: '本月新增',
    tips: 'month',
    valueFiled: 'mon_nuv',
    rateFiled: 'mon_rate'
  }
]
const registrationGeneral = reactive<RegistrationGeneral>({
  cur_day_nuv: '0',
  cur_day_rate: 0,
  last_day_nuv: '0',
  last_day_rate: 0,
  week_nuv: '0',
  week_rate: 0,
  mon_nuv: '0',
  mon_rate: 0
})
const { el, onUpdate, instance } = useCharts()
const {
  el: topBrowserEl,
  onUpdate: onUpdateTopBrowser,
  instance: topBrowserInstance
} = useCharts()

const {
  el: mapEl
  // onUpdate: onUpdateMap
} = useCharts()

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
    bottom: 0
  },
  xAxis: {
    axisLabel: {
      formatter: (value: number) => dayjs(value * 1000).format('MM-DD')
    }
  }
}
const getRegistrationGeneral = () => {
  addManageStatisticNewRegistrationGeneralApi().then(res => {
    Object.assign(registrationGeneral, res)
  })
}

const [st, et] = timeRangeValue(TimeRange.RECENT_7_DAYS)
const state = ref({
  start_tm: st,
  end_tm: et,
  _range: [st, et],
  range: TimeRange.RECENT_7_DAYS
})
const handleSearch = () => {
  getNewRegistrationTrend()
  getNewRegistrationRegion()
  getTopBrowser()
}
const onDateChange = (v: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(v))
  state.value.start_tm = start
  state.value.end_tm = end
  handleSearch()
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
    ['新增注册用户量'],
    xAxisData,
    [seriesData as string[]],
    mergeOptions
  )
  onUpdate(options as any)
}
const getNewRegistrationTrend = () => {
  if (!state.value?.start_tm) {
    const [start, end] = timeRangeValue(TimeRange.RECENT_7_DAYS)
    state.value.start_tm = start
    state.value.end_tm = end
    state.value.range = TimeRange.RECENT_7_DAYS
  }
  addManageStatisticNewRegistrationTrendApi(state.value as any).then(res =>
    updateChart((res?.list || []) as unknown as DateItem[])
  )
}
const registrationRegion = ref<NewRegistrationRegion[]>()
const getNewRegistrationRegion = () => {
  addManageStatisticNewRegistrationRegionApi({
    start_tm: String(state.value.start_tm),
    end_tm: String(state.value.end_tm)
  }).then(res => {
    registrationRegion.value = res?.list || []
    registrationRegion.value = [
      { metric: '北京市', value: '100', total: '500' },
      { metric: '上海市', value: '200', total: '800' },
      { metric: '天津市', value: '50', total: '300' },
      { metric: '重庆市', value: '150', total: '600' },
      { metric: '河北省', value: '120', total: '700' },
      { metric: '山西省', value: '80', total: '400' },
      { metric: '辽宁省', value: '90', total: '450' },
      { metric: '吉林省', value: '70', total: '350' },
      { metric: '黑龙江省', value: '110', total: '550' },
      { metric: '江苏省', value: '180', total: '900' },
      { metric: '浙江省', value: '250', total: '1000' },
      { metric: '安徽省', value: '130', total: '650' },
      { metric: '福建省', value: '140', total: '700' },
      { metric: '江西省', value: '100', total: '500' },
      { metric: '山东省', value: '200', total: '800' },
      { metric: '河南省', value: '120', total: '600' },
      { metric: '湖北省', value: '90', total: '450' },
      { metric: '湖南省', value: '110', total: '550' },
      { metric: '广东省', value: '250', total: '1000' },
      { metric: '海南省', value: '80', total: '400' },
      { metric: '四川省', value: '150', total: '750' },
      { metric: '贵州省', value: '70', total: '350' },
      { metric: '云南省', value: '100', total: '500' },
      { metric: '陕西省', value: '130', total: '650' },
      { metric: '甘肃省', value: '50', total: '250' },
      { metric: '青海省', value: '30', total: '150' },
      { metric: '台湾省', value: '80', total: '400' },
      { metric: '内蒙古自治区', value: '120', total: '600' },
      { metric: '广西壮族自治区', value: '90', total: '450' },
      { metric: '西藏自治区', value: '10', total: '50' },
      { metric: '宁夏回族自治区', value: '40', total: '200' },
      { metric: '新疆维吾尔自治区', value: '70', total: '350' },
      { metric: '香港特别行政区', value: '60', total: '300' },
      { metric: '澳门特别行政区', value: '20', total: '100' },
      { metric: '美国', value: '500', total: '2000' },
      { metric: '英国', value: '300', total: '1500' },
      { metric: '德国', value: '200', total: '1000' },
      { metric: '法国', value: '400', total: '1800' },
      { metric: '日本', value: '250', total: '1200' }
    ]

    // onUpdateMap(
    //   worldChinaMapOptions(
    //     '新增注册用户',
    //     registrationRegion.value.map(item => item.value),
    //     () => {}
    //   ) as any
    // )
  })
}

const getTopBrowser = () => {
  addManageStatisticNewRegistrationTopBrowserApi({
    start_tm: String(state.value.start_tm),
    end_tm: String(state.value.end_tm)
  }).then(res => {
    const options = preStyleOptions(
      res?.list?.map(item => ({
        name: item.metric,
        value: item.value
      })) || []
    )
    topBrowserInstance.value?.clear()
    onUpdateTopBrowser(options)
  })
}
onMounted(() => {
  getRegistrationGeneral()
  handleSearch()
})
</script>

<template>
  <vc-container admin page-title="用户分析">
    <div class="header-cards mt-8">
      <template v-for="(item, index) in cardsOptions" :key="item.filed">
        <div class="flex-1 flex flex-col justify-center items-start">
          <header class="text-ct-1 mb-4 flex items-center gap-1">
            <label>{{ item.label }}</label>
            <a-popover position="bottom">
              <icon-question-circle class="cursor-pointer" />
              <template #content>
                <div class="whitespace-pre-line text-sm">
                  {{ NEW_USERS_TIPS[item.tips] }}
                </div>
              </template>
            </a-popover>
          </header>
          <div class="secondary-text mb-1">
            {{ registrationGeneral[item.valueFiled] }}
          </div>
          <analysis-tag :model-value="registrationGeneral[item.rateFiled]" />
        </div>
        <a-divider
          v-if="index < cardsOptions.length - 1"
          direction="vertical"
          class="mx-6! h-auto!"
        />
      </template>
    </div>
    <vc-card :bordered="false" title="新增趋势" class="my-8">
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
    <div class="grid grid-cols-2">
      <div>
        <vc-card :bordered="false">
          <template #title>
            <span>地域分布</span>
            <a-radio-group
              v-model="displayMode"
              class="display-mode ml-10px"
              size="mini"
              type="button"
            >
              <a-radio value="map">
                <vc-svg-icon name="map" :size="14" />
              </a-radio>
              <a-radio value="table">
                <vc-svg-icon name="table" :size="14" />
              </a-radio>
            </a-radio-group>
          </template>
          <div ref="mapEl" v-show="displayMode === 'map'"></div>
          <a-table
            v-show="displayMode === 'table'"
            class="vc-card"
            :pagination="{ pageSize: 5 }"
            :columns="[
              { dataIndex: 'metric', title: '国家/省份' },
              { dataIndex: 'value', title: '新增注册用户' },
              {
                dataIndex: 'rate',
                title: '占比',
                render: ({ record }) =>
                  `${((record.value / record.total) * 100).toFixed()}%`
              }
            ]"
            :data="registrationRegion"
            :bordered="false"
          ></a-table>
        </vc-card>
      </div>
      <div>
        <vc-card :bordered="false" title="Top浏览器分布">
          <div ref="topBrowserEl" style="width: 100%; height: 258px"></div>
        </vc-card>
      </div>
    </div>
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
.display-mode {
  border-radius: 4px;
  :deep(.arco-radio-button-content) {
    @apply flex items-center px-1.5;
  }
}
</style>
