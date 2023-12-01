<script setup lang="ts">
import {
  getCdnStatisticProperContentListApi,
  getCdnStatisticSummaryProperApi
} from '@vca/apis/cdn'
import { preStyleOptions, useCharts } from 'vc-material'

const state = inject('statisticState') as any

const summary = reactive({
  total_bytes: 0,
  hit_bytes: 0
})

const summaryLoading = ref(false)
const getSummary = () => {
  summaryLoading.value = true
  getCdnStatisticSummaryProperApi(state.value)
    .then(res => {
      Object.assign(summary, res)
      const hitSource = [
        { value: Number(res?.hit_bytes || 0), name: '1' },
        {
          value: Number(res?.total_bytes || 0) - Number(res?.hit_bytes || 0),
          name: '2'
        }
      ]
      if (Number(res?.total_bytes || 0) === 0) {
        hitSource.splice(0, 1)
      }
      onUpdateHit(preStyleOptions(hitSource, {}, mergeOptions(true)))
      instance.value?.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0
      })
    })
    .finally(() => {
      summaryLoading.value = false
    })
}

const loading = ref(false)

const { el, onUpdate } = useCharts()
const { el: hitEl, onUpdate: onUpdateHit, instance } = useCharts()
type DateItem = { value: number; name: string }

const percentage = computed(() => {
  if (Number(summary?.total_bytes || 0) === 0) return '0'
  const res =
    (Number(summary?.hit_bytes || 0) / Number(summary?.total_bytes || 0)) * 100
  // 使用toFixed方法保留两位小数，并将结果转换为浮点数
  return parseFloat(res.toFixed(2))
})

const mergeOptions = (isHit = false) => {
  const res: any = {
    tooltip: {
      trigger: 'item',
      show: !isHit,
      formatter: (params: any) => {
        const show = `${params.percent}%`
        return `<div class="flex flex-col min-w-100px">
              <div class="flex items-center">
                <span
                    class="inline-block mr-1 rounded w-6px h-6px"
                    style='background:${params.color}'>
                </span>
                <span class="text-xs mb-6px text-ct-2">${params.name}</span>
              </div>
              <div class="flex items-center">
                <span class="text-ct-1 text-xs">流量</span>：
                <span class="text-ct-1 text-xs">${params.data.value}</span>
                <span  class="text-ct-1 text-xs pl-2">占比</span>：
                <span class="text-ct-1 text-xs">${show}</span>
              </div>
            </div>`
      }
    },
    grid: {
      width: '178',
      height: '178'
    },
    legend: {
      show: !isHit,
      left: 'center',
      bottom: '5%',
      right: 0,
      itemWidth: 6, // 图例宽度
      itemHeight: 6, // 图例高度
      textStyle: {
        rich: {
          a: {
            fontSize: 12,
            lineHeight: 20,
            verticalAlign: 'middle',
            color: '#1D2129',
            padding: [0, 16, 2, 0]
          },
          b: {
            fontSize: 12,
            lineHeight: 20,
            color: '#1D2129',
            fontWeight: 500
          }
        }
      }
    },
    series: [
      {
        radius: ['50%', '70%'],
        label: {
          //@ts-ignore
          emphasis: {
            show: !isHit,
            formatter: ({ data }: any) => {
              return `{b| ${data.name}} \n {c|${
                data.rate ? Number(data?.value || 0) : data.value
              }}`
            },
            rich: {
              b: {
                //设置主标题的 样式
                textAlign: 'center',
                color: '#1D2129',
                fontSize: 14,
                padding: 0,
                itemGap: 0,
                lineHeight: 20,
                fontWeight: 500
              },
              c: {
                //设置主标题的 样式
                textAlign: 'center',
                color: '#86909C',
                fontSize: 12,
                lineHeight: 18,
                fontWeight: 400
              }
            }
          }
        },
        labelLine: {
          show: false
        }
      }
    ]
  }
  if (isHit) {
    res.color =
      Number(summary?.total_bytes || 0) === 0
        ? ['#F7F8FA']
        : ['#2253E6', '#F7F8FA']
  }
  return res
}

const updateChart = async (source: DateItem[]) => {
  onUpdate(preStyleOptions(source, {}, mergeOptions()))
}

const getChartData = () => {
  loading.value = true
  getCdnStatisticProperContentListApi(state.value)
    .then(res => {
      res.list = [
        {
          content: 'html',
          count: '14580',
          total_count: '43714'
        },
        {
          content: 'png',
          count: '14570',
          total_count: '43714'
        },
        {
          content: 'jpeg',
          count: '14564',
          total_count: '43714'
        }
      ]
      const data = res?.list || []
      const chatData = data.map(({ count, content }) => ({
        value: Number(count),
        name: String(content)
      }))

      updateChart(chatData)
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  state,
  () => {
    getSummary()
    getChartData()
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <vca-card body-full class="h-[124px]" background>
    <a-spin class="w-full h-full" :loading="summaryLoading">
      <div class="summary-panel">
        <div class="summary-item">
          <span class="summary-item__title">总流量</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value num"
              v-trans-byte="[summary?.total_bytes, '.summary-item__body-unit']"
            >
              <span class="summary-item__body-unit"></span>
            </span>
          </div>
        </div>
        <div class="summary-item">
          <span class="summary-item__title">节省流量</span>
          <div class="summary-item__body">
            <span
              class="summary-item__body-value num"
              v-trans-byte="[summary?.hit_bytes, '.summary-item__body-unit']"
            >
              <span class="summary-item__body-unit"></span>
            </span>
          </div>
        </div>
      </div>
    </a-spin>
  </vca-card>
  <div class="grid grid-cols-2 gap-4">
    <vc-card title="节省流量">
      <div
        class="text-primary num text-7 flex items-end absolute top-1/2 left-1/2 -translate-1/2"
      >
        {{ percentage }}
        <small class="text-sm!">%</small>
      </div>
      <div ref="hitEl" class="w-full h-full"></div>
    </vc-card>
    <vc-card title="内容占比">
      <div ref="el" class="w-full h-full"></div>
    </vc-card>
  </div>
</template>

<style lang="less" scoped>
:deep(.vc-card) {
  @apply flex flex-col mt-0!;
  height: 344px;
  .arco-card-body {
    @apply flex justify-center items-center flex-1 relative;
  }
}
</style>
