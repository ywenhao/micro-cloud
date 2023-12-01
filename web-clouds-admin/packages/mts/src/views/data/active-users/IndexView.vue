<template>
  <vc-container page-title="活跃用户统计" admin>
    <a-spin :loading="loading" class="w-full h-full">
      <div flex gap="8px" mt="16px">
        <a-radio-group
          type="button"
          v-model="dateRadio"
          :options="mtsDayOpts"
        />
        <a-range-picker
          v-model="datePicker"
          value-format="X"
          :disabled-date="disabledDate"
        />
        <i flex="1" />
        <vc-refresh-button :loading="loading" @click="getData" />
      </div>
      <div class="mt-8">
        <div
          class="h-11 px-4 py-3 bg-fill-1 border border-solid border-color-1"
        >
          创建任务用户数
        </div>
        <div class="echarts-box w-full h-302px" ref="createEl"></div>
      </div>
      <div class="mt-8">
        <div
          class="h-11 px-4 py-3 bg-fill-1 border border-solid border-color-1"
        >
          执行转码任务用户数
        </div>
        <div class="echarts-box w-full h-302px" ref="transcodeEl"></div>
      </div>
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import { type ActiveUserModel, getMtsCollectUserApi } from '@vca/apis/mts'
import type { EChartsOption } from 'echarts'
import {
  formatChartsUnix,
  formatUnix,
  lineChartData,
  lineStyleOptions,
  mtsDayOpts,
  useCharts,
  useDatePicker
} from 'vc-material'

const { dateRadio, datePicker, dateValue } = useDatePicker()

const filterData = reactive({
  begin_time: computed(() => dateValue.value[0]),
  end_time: computed(() => dateValue.value[1])
})
const { el: createEl, onUpdate: onCreateUpdate } = useCharts()
const { el: transcodeEl, onUpdate: onTransCodeUpdate } = useCharts()
const xAxisUnit = ref('week')

const loading = ref(false)
const dataSource = ref<ActiveUserModel[]>([])

const mergeOptions = {
  legend: {
    show: false
  },
  grid: {
    top: 24,
    left: 24,
    right: 24,
    bottom: 24
  },
  xAxis: {
    axisLabel: {
      formatter: (v: number) => formatChartsUnix(v, xAxisUnit.value)
    }
  },
  color: ['#2253E6', '#04A93A', '#7A81E9', '#F98C46', '#FFD200', '#D6EB57'],
  tooltip: {
    trigger: 'axis',
    formatter(params: any[]) {
      let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">${formatUnix(
        params[0].name,
        'YYYY-MM-DD HH:mm:ss'
      )}</p>`
      params.forEach(element => {
        const item = dataSource.value.find(
          item => item.date === element.axisValue
        )
        let percent = 0
        const total = Number(item?.user_total_count) ?? 0
        if (total > 0) {
          percent = Number(((element.value / total) * 100).toFixed(2))
        }

        spans += `
        <p class="flex flex-col items-center mb-0 px-[6px] mt-1">
          <div class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
            <span>${element.seriesName}：</span><span>${element.value} </span>
          </div>
          <div class="flex ml-2 items-center  text-ct-2 text-xs font-medium">
            <span>活跃度：</span><span>${percent}% </span>
          </div
        </p>`
      })
      return spans
    }
  }
}
const updateChart = async (data: ActiveUserModel[]) => {
  // 创建任务用户数
  const {
    seriesData: seriesDataC,
    xAxisData,
    unit
  } = lineChartData(
    data,
    Number(filterData.begin_time ?? 0),
    Number(filterData.end_time ?? 0),
    'create_task_user_count',
    'date'
  )
  // 执行转码任务用户数
  const { seriesData: seriesDataT } = lineChartData(
    data,
    Number(filterData.begin_time ?? 0),
    Number(filterData.end_time ?? 0),
    'exec_task_user_count',
    'date'
  )

  const optionsC = lineStyleOptions(
    ['活跃用户数'],
    xAxisData,
    [seriesDataC],
    mergeOptions
  )
  const optionsT = lineStyleOptions(['活跃用户数'], xAxisData, [seriesDataT], {
    ...mergeOptions,
    color: ['#04A93A']
  })
  xAxisUnit.value = unit ?? 'week'

  onCreateUpdate(optionsC as EChartsOption)
  onTransCodeUpdate(optionsT as EChartsOption)
}
// 获取任务数统计
async function getData() {
  loading.value = true
  getMtsCollectUserApi(filterData)
    .then(res => {
      dataSource.value = res.list ?? []
      updateChart(dataSource.value)
    })
    .finally(() => {
      loading.value = false
    })
}

watchEffect(() => {
  dateValue.value
  getData()
})
</script>
