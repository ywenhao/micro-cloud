<template>
  <div ref="chartRef" class="w-full h-122px"></div>
</template>

<script setup lang="ts">
import { type EChartsOption } from 'echarts'
import { convertByte, preStyleOptions, useCharts } from 'vc-material'

interface IProps {
  pieStatistic: any
  showLegend: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  pieStatistic: undefined,
  showLegend: true
})

const { el: chartRef, onUpdate } = useCharts({ pre: { listenerEvent: true } })

const mockData = computed(() => (props.pieStatistic ? props.pieStatistic : []))

/** option 用于将默认的options覆盖， 此数据会和preStyleOptions中的默认数据做合并操作 */
const mergeOptions: EChartsOption = {
  tooltip: {
    trigger: 'item',
    show: true,
    formatter: (params: any) => {
      const show = `${params.percent}%`
      return `<div class="flex flex-col min-w-100px">
        <span class="text-xs mb-6px text-ct-2">${params.name}</span>
        <div class="flex items-center">
          <span class="inline-block mr-1 rounded w-6px h-6px"style='background:${
            params.color
          }'></span>
         ${
           params.data?.rate
             ? `<span  class="text-ct-1 text-xs">百分比</span>：<span class="text-ct-1 text-xs">${show}</span>`
             : `<span class="text-ct-1 text-xs">${params.data.value}</span>`
         }  
        </div>
      </div>`
    }
  },
  legend: {
    orient: 'vertical',
    top: '5%',
    show: true,
    left: '200px',
    itemWidth: 8, //图例宽度
    itemHeight: 8, //图例高度
    formatter: function (name) {
      // 添加
      let target
      for (let i = 0; i < mockData.value?.length; i++) {
        if (mockData.value[i].name === name) {
          target = mockData.value[i]
        }
      }

      return target?.rate
        ? '{a|' +
            name +
            '}  {b|' +
            convertByte(Number(target?.value || 0)) +
            '} {b|' +
            target?.rate +
            '%}'
        : '{a|' + target?.name + '} {b|' + target?.value + '}'
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
    left: '63px',
    top: '33%',
    textAlign: 'center'
  },
  series: [
    {
      radius: ['60%', '100%'],
      center: ['68px', '50%'],
      label: {
        //@ts-ignore
        emphasis: {
          show: true,
          formatter: ({ data }: any) => {
            //此处重点，其中定义的 b,c 是用于下面的 rich来单独设置样式，因为这里不支持 HTML标签
            return `{b| ${data.name ?? '-'}} \n {c|${
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
  if (!props.showLegend) {
    //@ts-ignore
    mergeOptions!.legend!.show = false
  }
  const options = preStyleOptions(
    data,
    {
      title: {
        text: '总空间',
        subtext: subtextNumber
      }
    },
    mergeOptions
  )
  //@ts-ignore
  onUpdate(options)
}

watch(
  () => props.pieStatistic,
  v => {
    if (v) {
      updatePieChart(v)
    }
  },
  { deep: true, immediate: true }
)
</script>
