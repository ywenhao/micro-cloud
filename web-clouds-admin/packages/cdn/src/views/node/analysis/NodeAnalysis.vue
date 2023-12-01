<template>
  <vc-container admin page-title="统计分析">
    <a-spin :loading="loading" class="w-full h-full">
      <a-tabs class="mt-2" v-model="activeName" @change="handleChange">
        <a-tab-pane key="broadband" title="宽带"> </a-tab-pane>
        <a-tab-pane key="cpu" title="CPU使用率"></a-tab-pane>
        <a-tab-pane key="memory" title="内存使用率"></a-tab-pane>
        <a-tab-pane key="cached" title="Cache使用率"></a-tab-pane>
        <a-tab-pane key="cache_io" title="Cache IO"></a-tab-pane>
        <a-tab-pane key="connection" title="连接数"></a-tab-pane>
      </a-tabs>
      <vc-filter-bar
        ref="filterBarRef"
        :loading="loading"
        v-model="filterData"
        :schemas="filterBarScheme"
        :refresh="false"
        class="mt-1"
      >
        <template #prefix>
          <a-space :size="8">
            <a-radio-group
              v-model="dateRadio"
              :options="radioOpts"
              type="button"
            />
            <a-range-picker
              v-model="datePicker"
              value-format="X"
              :disabled-date="disabledDate"
            />
          </a-space>
        </template>
      </vc-filter-bar>

      <div class="flex flex-col">
        <a-divider
          class="my-4!"
          :class="{ 'mb-6!': activeName !== 'broadband' }"
        ></a-divider>
        <vca-card
          v-if="activeName === 'broadband'"
          body-full
          class="h-[124px] mb-6"
          background
        >
          <div class="card-container">
            <div class="card-item">
              <span class="card-item__label">上行带宽最高</span>
              <div
                class="card-item__content"
                v-trans-ps="[dataSource?.up_max, '.unit']"
              >
                <span class="content-end unit"></span>
              </div>
            </div>
            <a-divider direction="vertical" />
            <div class="card-item">
              <span class="card-item__label">上行带宽平均</span>
              <div
                class="card-item__content"
                v-trans-ps="[dataSource?.up_aver, '.unit']"
              >
                <span class="content-end unit"></span>
              </div>
            </div>
            <a-divider direction="vertical" />
            <div class="card-item">
              <span class="card-item__label">上行带宽最低</span>
              <div
                class="card-item__content"
                v-trans-ps="[dataSource?.up_min, '.unit']"
              >
                <span class="content-end unit"></span>
              </div>
            </div>
            <a-divider direction="vertical" />
            <div class="card-item">
              <span class="card-item__label">下行带宽最高</span>
              <div
                class="card-item__content"
                v-trans-ps="[dataSource?.down_max, '.unit']"
              >
                <span class="content-end unit"></span>
              </div>
            </div>
            <a-divider direction="vertical" />
            <div class="card-item">
              <span class="card-item__label">下行带宽平均</span>
              <div
                class="card-item__content"
                v-trans-ps="[dataSource?.down_aver, '.unit']"
              >
                <span class="content-end unit"></span>
              </div>
            </div>
            <a-divider direction="vertical" />

            <div class="card-item">
              <span class="card-item__label">下行带宽最低</span>
              <div
                class="card-item__content"
                v-trans-ps="[dataSource?.down_min, '.unit']"
              >
                <span class="content-end unit"></span>
              </div>
            </div>
          </div>
        </vca-card>

        <div ref="el" class="echarts-box w-full h-280px"></div>
      </div>
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import {
  getCdnnodeNodesListApi,
  getCdnResolvRegionsListApi,
  getCdnStatisticNodeApi
} from '@vca/apis/src/cdn'
import type { EChartsOption } from 'echarts'
import {
  type DayOpts,
  formatChartsUnix,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  useCharts,
  useDatePicker
} from 'vc-material'
import type { ComboInputOptions } from 'vc-material/components/combo-input/props'

import { disabledDate } from '@/utils/utils'

import { filterBarScheme } from './components/scheme'
type ChartItem = {
  time?: string | number
  up?: string
  down?: string
  cpu?: string
  memory?: string
  cached?: string
  cache_read?: string
  cache_write?: string
  connection?: string
}
const { el, instance: chartRef, onUpdate } = useCharts()

const { datePicker, dateRadio, dateValue } = useDatePicker()

const radioOpts: DayOpts = [
  {
    label: '今日',
    value: 'today'
  },
  {
    label: '昨日',
    value: 'yesterday'
  },
  {
    label: '近7天',
    value: 'nearingSevenDay'
  },
  {
    label: '近30天',
    value: 'nearingThirtyDay'
  }
]
const filterData = reactive({})
const filterBarRef = ref()
const state = computed(() => {
  return {
    ...filterData,
    start_time: dateValue.value[0],
    end_time: dateValue.value[1]
  }
})
const activeName = ref('broadband')
const dataSource = ref()
const loading = ref(false)
const getData = () => {
  loading.value = true

  getCdnStatisticNodeApi(state.value)
    .then(res => {
      dataSource.value = res
      const list = res.list ?? []
      updateChart(list)
    })
    .finally(() => {
      loading.value = false
    })
}

const xAxisUnit = ref('week')

const updateChart = async (data: ChartItem[]) => {
  const map: Record<string, () => void> = {
    broadband: () => {
      const {
        seriesData: upData,
        xAxisData,
        unit
      } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'up',
        'time'
      )
      const { seriesData: downData } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'down',
        'time'
      )
      xAxisUnit.value = unit ?? 'week'
      const options = lineStyleOptions(
        ['上行带宽', '下行带宽'],
        xAxisData,
        [upData, downData],
        mergeOptions.value
      )

      onUpdate(options as EChartsOption)
    },
    cpu: () => {
      const { seriesData, xAxisData, unit } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'cpu',
        'time'
      )

      xAxisUnit.value = unit ?? 'week'
      const options = lineStyleOptions(
        ['CPU使用率'],
        xAxisData,
        [seriesData],
        mergeOptions.value
      )
      onUpdate(options as EChartsOption)
    },
    memory: () => {
      const { seriesData, xAxisData, unit } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'memory',
        'time'
      )

      xAxisUnit.value = unit ?? 'week'
      const options = lineStyleOptions(
        ['内存使用率'],
        xAxisData,
        [seriesData],
        mergeOptions.value
      )
      onUpdate(options as EChartsOption)
    },
    cached: () => {
      const { seriesData, xAxisData, unit } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'cached',
        'time'
      )

      xAxisUnit.value = unit ?? 'week'
      const options = lineStyleOptions(
        ['缓存使用率'],
        xAxisData,
        [seriesData],
        mergeOptions.value
      )

      onUpdate(options as EChartsOption)
    },
    cache_io: () => {
      const {
        seriesData: readData,
        xAxisData,
        unit
      } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'cache_read',
        'time'
      )
      const { seriesData: writeData } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'cache_write',
        'time'
      )
      xAxisUnit.value = unit ?? 'week'
      const options = lineStyleOptions(
        ['缓存写入使用率', '缓存读取使用率'],
        xAxisData,
        [readData, writeData],
        mergeOptions.value
      )

      onUpdate(options as EChartsOption)
    },
    connection: () => {
      const { seriesData, xAxisData, unit } = lineChartData(
        data,
        Number(dateValue.value[0]),
        Number(dateValue.value[1]),
        'connection',
        'time'
      )
      xAxisUnit.value = unit ?? 'week'
      const options = lineStyleOptions(
        ['连接数'],
        xAxisData,
        [seriesData],
        mergeOptions.value
      )

      onUpdate(options as EChartsOption)
    }
  }
  map[activeName.value]()
}

// 获取区域列表
const getRegion = () => {
  const areaList: ComboInputOptions[] = []
  getCdnResolvRegionsListApi({}).then(res => {
    const list = res.list ?? []
    for (let i = 0; i < list.length; i++) {
      const obj = {
        label: list[i].name ?? '',
        value: list[i].id ?? ''
      }
      areaList.push(obj)
    }

    filterBarRef.value?.setFieldSchema('region_id', {
      attrs: {
        options: [{ label: '全部区域', value: '0' }].concat(...areaList)
      }
    })
  })
}
// 获取节点列表
const getNode = () => {
  let nodeList: ComboInputOptions[] = []
  getCdnnodeNodesListApi({}).then(res => {
    const list = res.list ?? []
    for (let i = 0; i < list.length; i++) {
      const obj = {
        label: list[i].name ?? '',
        value: list[i].id ?? ''
      }
      nodeList.push(obj)
    }
    filterBarRef.value?.setFieldSchema('nodes', {
      attrs: {
        options: [{ label: '全部节点', value: '0' }].concat(...nodeList)
      }
    })
  })
}
const handleChange = (v: any) => {
  chartRef.value?.clear()
  activeName.value = v
  getData()
}

const hasPercent = computed(
  () => !['broadband', 'connection'].includes(activeName.value)
)
const mergeOptions = computed(() => {
  return {
    legend: {
      icon: 'rect',
      itemWidth: 8,
      itemHeight: 2,
      data: legends()
    },
    grid: {
      left: 0,
      right: 48,
      top: 16
    },
    xAxis: {
      axisLabel: {
        formatter: (v: number) => {
          return formatChartsUnix(v, xAxisUnit.value)
        }
      }
    },
    yAxis: {
      axisLabel: {
        formatter: (v: number) => {
          if (activeName.value === 'broadband') {
            return `${v} bps`
          }
          if (activeName.value === 'connection') {
            return `${v} 个`
          }
          return `${v ? (v / 100).toFixed(2) : 0} %`
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
          const percent = element.value ? (element.value / 100).toFixed(2) : 0
          spans += `
        <p class="flex items-center mb-0 px-[6px] mt-1">
          <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${
            element.color
          }"></span>
          <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${element.seriesName}：</span><span>${
            hasPercent.value ? percent : element.value ?? 0
          }${hasPercent.value ? '%' : ''} </span>
          </span>
        </p>`
        })
        return spans
      }
    },
    color: hasPercent.value ? ['#2253E6'] : ['#2253E6', '#00B42A']
  }
})

const legends = () => {
  const map: Record<string, string[]> = {
    broadband: ['上行带宽', '下行带宽'],
    cpu: ['CPU使用率'],
    memory: ['内存使用率'],
    cached: ['缓存使用率'],
    cache_io: ['缓存写入使用率', '缓存读取使用率'],

    connection: ['连接数']
  }
  return map[activeName.value]
}
watch(
  () => state.value,
  () => {
    getData()
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  getData()
  getRegion()
  getNode()
})
</script>

<style lang="less" scoped>
:deep(.arco-card-body) {
  @apply py-8! px-14!;
  border: 1px solid var(--unnamed, #f2f3f5);
  border-radius: 6px;
}
.card-container {
  @apply w-full h-full flex  items-center justify-between;
  .arco-divider {
    margin: 0 48px !important;
    height: 100%;
  }
  .card-item {
    @apply flex flex-col flex-1 gap-y-2 place-content-start place-items-start;
    &__label {
      @apply text-xs text-ct-1;
    }
    &__content {
      @apply text-28px font-500 font-big-num text-primary;
      .content-end {
        @apply text-sm pl-2px;
      }
    }
  }
}
</style>
