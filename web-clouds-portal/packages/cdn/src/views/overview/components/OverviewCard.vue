<template>
  <div class="flex flex-col gap-y-4">
    <a-spin :loading="loading">
      <vc-card title="安全防护" class="rounded-12px px-2 pt-1">
        <div class="flex flex-col gap-y-4 pb-2 pt-3px">
          <div class="flex px-6 py-4 rounded-6px protection-number">
            <span class="flex items-center w-1/3">
              <vc-svg-icon
                :size="32"
                prefix="cdn"
                name="protection_number"
              ></vc-svg-icon>
              <span class="pl-4 text-sm text-ct-1 font-600">防护数</span>
            </span>
            <div class="flex flex-1 items-center">
              <div class="flex items-center w-1/2">
                <span class="text-xs text-ct-3 pr-1">今日</span>
                <div class="text-primary text-28px">
                  <span>{{ wafData?.now_prevents }}</span>
                  <span class="pl-1 text-sm"> 个 </span>
                </div>
              </div>
              <a-divider direction="vertical" class="mx-8! h-8!" />
              <div class="flex items-center w-1/2">
                <span class="text-xs text-ct-3 pr-1">昨日</span>
                <div class="text-ct-3 text-28px">
                  <span>{{ wafData?.last_prevents }}</span>
                  <span class="pl-1 text-sm"> 个 </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex px-6 py-4 rounded-6px threat-number">
            <span class="flex items-center w-1/3">
              <vc-svg-icon
                :size="32"
                prefix="cdn"
                name="threat_number"
              ></vc-svg-icon>
              <span class="pl-4 text-sm text-ct-1 font-600">威胁数</span>
            </span>
            <div class="flex flex-1 items-center">
              <div class="flex items-center w-1/2">
                <span class="text-xs text-ct-3 pr-1">今日</span>
                <div class="text-danger text-28px">
                  <span>{{ wafData?.now_menaces }}</span>
                  <span class="pl-1 text-sm"> 个 </span>
                </div>
              </div>
              <a-divider direction="vertical" class="mx-8! h-8!" />
              <div class="flex items-center w-1/2">
                <span class="text-xs text-ct-3 pr-1">昨日</span>
                <div class="text-ct-3 text-28px">
                  <span>{{ wafData?.last_menaces }}</span>
                  <span class="pl-1 text-sm"> 个 </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vc-card>
    </a-spin>
    <a-spin :loading="topLoading">
      <vc-card title="本月流量Top5占比" class="rounded-12px px-2 pt-2">
        <div
          v-if="isShowTopEcharts"
          ref="chartRef"
          class="w-full h-226px"
        ></div>
        <div v-else class="flex flex-col items-center justify-center h-226px">
          <vc-svg-icon :size="80" prefix="cdn" name="empty_data"></vc-svg-icon>
          <span class="text-sm text-ct-4">暂无数据</span>
        </div>
      </vc-card>
    </a-spin>
  </div>
</template>
<script setup lang="ts">
import { getCdnOverviewTopApi, getCdnOverviewWafApi } from '@vcp/apis/cdn'
import { type EChartsOption } from 'echarts'
import { convertByte, preStyleOptions, useCharts } from 'vc-material'

const wafData = ref()
const loading = ref<boolean>(false)
const topLoading = ref<boolean>(false)

const getWafData = () => {
  loading.value = true
  getCdnOverviewWafApi()
    .then(res => {
      wafData.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

const { el: chartRef, onUpdate } = useCharts({ pre: { listenerEvent: true } })
const mockData = ref()

const mergeOptions: EChartsOption = {
  tooltip: {
    trigger: 'item',
    show: true,
    formatter: (params: any) => {
      const show = `${params.percent}%`
      return `<div class="flex flex-col min-w-100px">
        <div class="flex items-center">
           <span class="inline-block mr-1 rounded w-6px h-6px"style='background:${params.color}'></span>
          <span class="text-xs mb-6px text-ct-2">${params.name}</span>
          </div>
        <div class="flex items-center">
           <span  class="text-ct-1 text-xs">流量</span>：<span class="text-ct-1 text-xs">${params.data.value}</span> 
           <span  class="text-ct-1 text-xs pl-2">占比</span>：<span class="text-ct-1 text-xs">${show}</span>
        </div>
      </div>`
    }
  },
  legend: {
    orient: 'vertical',
    top: '12%',
    show: true,
    right: 0,
    itemWidth: 6, //图例宽度
    itemHeight: 6, //图例高度
    formatter: function (name) {
      // 添加
      let target
      for (let i = 0; i < mockData.value?.length; i++) {
        if (mockData.value[i].name === name) {
          target = mockData.value[i]
        }
      }

      return '{a|' + target?.name || '-' + '}'
    },
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
  title: {
    left: '195px',
    top: '43%',
    textAlign: 'center'
  },
  series: [
    {
      radius: ['50%', '70%'],
      center: ['200px', '48%'],
      label: {
        //@ts-ignore
        emphasis: {
          show: true,
          formatter: ({ data }: any) => {
            //此处重点，其中定义的 b,c 是用于下面的 rich来单独设置样式，因为这里不支持 HTML标签
            return `{b| ${data.name}} \n {c|${
              data.rate ? convertByte(Number(data?.value || 0)) : data.value
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

const updatePieChart = (data: any = []) => {
  const subtextNumber = data?.length
  const options = preStyleOptions(
    data,
    {
      title: {
        text: 'Top5占比',
        subtext: subtextNumber
      }
    },
    mergeOptions
  )
  //@ts-ignore
  onUpdate(options)
}

const isShowTopEcharts = ref<boolean>(false)

const getTopData = () => {
  topLoading.value = true
  getCdnOverviewTopApi()
    .then(res => {
      const { list } = res
      isShowTopEcharts.value = (list as string[])?.length > 0
      if (list?.length) {
        const topListData = list?.map(({ site_name, bytes }) => ({
          name: site_name,
          value: bytes
        }))
        mockData.value = list
        updatePieChart(topListData)
      }
    })
    .finally(() => {
      topLoading.value = false
    })
}

onMounted(() => {
  getWafData()
  getTopData()
})
</script>

<style scoped lang="less">
.protection-number {
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.51) 0%,
    rgba(232, 248, 255, 0.34) 100%
  );
}

.threat-number {
  background: linear-gradient(
    180deg,
    rgba(255, 238, 232, 0.3) 0%,
    rgba(255, 236, 232, 0.17) 100%
  );
}
</style>
