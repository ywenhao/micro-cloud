<template>
  <div class="h-full overscroll-y-auto">
    <div class="bg-white p-6 rounded-12px">
      <div class="grid grid-cols-2 gap-x-5">
        <div class="flex flex-col">
          <span class="text-base font-medium text-ct-1 mb-4">空间分布</span>
          <a-spin :loading="loading">
            <div class="memory-border p-6 rounded-6px">
              <pie-chart
                v-if="storageNumberData?.length"
                :pie-statistic="storageNumberData"
                :show-legend="storageNumberData?.length > 0"
              />
              <empty-view v-else />
            </div>
          </a-spin>
        </div>
        <div class="flex flex-col">
          <span class="text-base font-medium text-ct-1 mb-4"
            >空间存储量TOP3</span
          >
          <a-spin :loading="loading">
            <div class="memory-border p-6 rounded-6px">
              <columnar-chart
                v-if="storageThree.series?.length"
                :static-data="storageThree"
              />
              <empty-view v-else />
            </div>
          </a-spin>
        </div>
      </div>
      <a-spin :loading="loading" class="w-full">
        <div class="rounded-6px space-over-data mt-4">
          <div class="flex flex-col space-over-item">
            <span class="space-title">今日上传存储量</span>
            <span
              class="space-count"
              v-trans-byte="[dayData?.cur_day_size, '.unit']"
            >
              <span class="unit pl-1 text-sm"></span>
            </span>
            <span class="space-sub-title"
              >昨日上传存储量
              <span class="pl-2">{{
                convertByte(Number(dayData?.last_day_size))
              }}</span></span
            >
          </div>
          <div class="driver"></div>
          <div class="flex flex-col space-over-item">
            <span class="space-title">今日上传文件数</span>
            <span class="space-count"
              >{{ formatNumber(dayData?.cur_day_num || 0) }}
            </span>
            <span class="space-sub-title"
              >昨日上传文件数
              <span class="pl-2">{{
                formatNumber(dayData?.last_day_num || 0)
              }}</span></span
            >
          </div>
          <div class="driver"></div>
          <div class="flex flex-col space-over-item">
            <span class="space-title">本月文件请求次数（GET / PUT)</span>
            <span>
              <a-tooltip
                position="right"
                background-color="#fff"
                content-class="vc-tooltip-tigger"
              >
                <template #content>
                  <span class="text-ct-1">
                    {{ formatNumber(monData?.cur_mon_get_num || 0) }}/{{
                      formatNumber(monData?.cur_mon_put_num || 0)
                    }}
                  </span>
                </template>
                <span class="space-count"
                  >{{
                    (
                      staCodeNumberFormat(
                        monData?.cur_mon_get_num || 0
                      ) as ByteConverNode
                    )?.value
                  }}<span class="pl-1 text-sm"
                    >{{
                      (
                        staCodeNumberFormat(
                          monData?.cur_mon_get_num || 0
                        ) as ByteConverNode
                      )?.unit
                    }}
                  </span>
                  <span class="line-slash">/</span>
                  {{
                    (
                      staCodeNumberFormat(
                        monData?.cur_mon_put_num || 0
                      ) as ByteConverNode
                    )?.value
                  }}<span class="pl-1 text-sm">{{
                    (
                      staCodeNumberFormat(
                        monData?.cur_mon_put_num || 0
                      ) as ByteConverNode
                    )?.unit
                  }}</span>
                </span>
              </a-tooltip>
            </span>

            <span class="space-sub-title"
              >上月文件请求次数（GET / PUT)
              <span class="pl-2"
                >{{
                  staCodeNumberFormat(monData?.last_mon_get_num || 0, 'string')
                }}
                /
                {{
                  staCodeNumberFormat(monData?.last_mon_put_num || 0, 'string')
                }}</span
              ></span
            >
          </div>
          <div class="driver"></div>

          <div class="flex flex-col space-over-item">
            <span class="space-title">本月空间外网流出流量</span>
            <span
              class="space-count"
              v-trans-byte="[monData?.cur_mon_get_size, '.unit']"
            >
              <span class="unit pl-1 text-sm"></span>
            </span>
            <span class="space-sub-title"
              >上月空间外网流出流量
              <span class="pl-2">{{
                convertByte(Number(monData?.last_mon_get_size || 0))
              }}</span></span
            >
          </div>
          <div class="driver"></div>

          <div class="flex flex-col space-over-item">
            <span class="space-title">本月空间外网流入流量</span>
            <span
              class="space-count"
              v-trans-byte="[monData?.cur_mon_put_size, '.unit']"
            >
              <span class="unit pl-1 text-sm"></span>
            </span>
            <span class="space-sub-title"
              >上月空间外网流入流量
              <span class="pl-2">{{
                convertByte(Number(monData?.last_mon_put_size || 0))
              }}</span></span
            >
          </div>
        </div>
      </a-spin>
    </div>

    <div class="mt-4 bg-white rounded-12px p-6">
      <span class="text-base font-medium text-ct-1"> 存储趋势</span>
      <div class="mt-4 flex">
        <a-radio-group
          v-model="timeStatus"
          type="button"
          class="p-0!"
          @change="handleChange"
        >
          <a-radio :value="6">7天</a-radio>
          <a-radio :value="14">15天</a-radio>
        </a-radio-group>
        <a-range-picker
          v-model="rangeValue"
          @change="onChange"
          valueFormat="X"
          :disabled-date="disabledDate"
          class="w-[300px]! ml-2"
          :allow-clear="false"
        />
      </div>
      <echarts-line :legend="['存储总量']" :static-data="storageLineData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ossOverviewApi } from '@vcp/apis/oss'
import { disabledDate } from '@vcp/shared'
import dayjs from 'dayjs'
import { convertByte, lineChartData } from 'vc-material'

import ColumnarChart from '@/components/ColumnarChart.vue'
import EchartsLine, { type IEchartsData } from '@/components/EchartsLine.vue'
import EmptyView from '@/components/EmptyView.vue'
import PieChart from '@/components/PieChart.vue'
import { REGION_LIST_DATA } from '@/components/SelectData'
import type { ByteConverNode } from '@/types/node-manage'
import { formatNumber, getUnixZero, staCodeNumberFormat } from '@/utils'

const storageUsedData = ref()
const storageNumberData = ref()
const storageThree = ref<IEchartsData>({
  series: [],
  xAxis: [],
  unit: ''
})
const loading = ref<boolean>(false)

const storageLineData = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'week'
})

const timeStatus = ref<number | undefined>(6)
const rangeValue = ref<string[] | number[]>([])

const dayData = ref<any>()
const monData = ref<any>()

const queryData = ref({
  start: getUnixZero(dayjs().subtract(6, 'days') as unknown as number),
  end: getUnixZero() + 86399
})

const getTimeData = (v: number) => {
  return {
    start: getUnixZero(dayjs().subtract(v, 'days') as unknown as number),
    end: getUnixZero() + 86399
  }
}

const onChange = (dateString: any) => {
  queryData.value.start = dateString[0]
  queryData.value.end = Number(dateString[1]) + 86399
  timeStatus.value = undefined
}

const handleChange = (val: number | string | boolean) => {
  const { start, end } = getTimeData(val as number)
  queryData.value.start = start
  queryData.value.end = end
}

const getRegionName = (id: string) => {
  return REGION_LIST_DATA.value.find((item: any) => item?.value === id)?.label
}

/**获取概览数据 */
const getOverview = () => {
  loading.value = true
  ossOverviewApi
  ossOverviewApi({
    start: String(queryData.value?.start),
    end: String(queryData.value?.end)
  })
    .then(res => {
      const {
        day_static,
        mon_static,
        region_use_size_list,
        bucket_num_list,
        bucket_top_list,
        trend
      } = res
      dayData.value = day_static
      monData.value = mon_static
      const storageUseList = region_use_size_list?.map((item: any) => ({
        name: getRegionName(item.region_id),
        value: Number(item.val),
        rate: item.rate
      }))
      storageUsedData.value = storageUseList
      const storageNumberList = bucket_num_list?.map((item: any) => ({
        name: getRegionName(item.region_id),
        value: Number(item.val)
      }))
      storageNumberData.value = storageNumberList
      //@ts-ignore
      storageThree.value.series = bucket_top_list?.map((item: any) =>
        Number(item.val)
      )
      //@ts-ignore
      storageThree.value.xAxis = bucket_top_list?.map(
        (item: any) => item.bucket_name
      )
      const { seriesData, xAxisData, unit } = lineChartData(
        trend,
        queryData.value?.start,
        queryData.value?.end,
        'val',
        'metric'
      )
      storageLineData.value.xAxis = xAxisData as string[]
      storageLineData.value.series[0] = seriesData
      storageLineData.value.unit = unit as string
    })
    .finally(() => {
      loading.value = false
    })
}

watch(
  () => queryData.value,
  () => {
    const { start, end } = queryData.value
    rangeValue.value = [start * 1000, end * 1000]
    getOverview()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="less">
.memory-border {
  border: 1px solid #f2f3f5;
}
.node-space-btn {
  padding: 2px;
  width: 56px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
  > span {
    &:hover {
      @apply bg-white rounded;
    }
  }
}
.space-over-data {
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.3) 0%,
    rgba(232, 243, 255, 0.1) 100%
  );
  @apply px-6 py-4 flex justify-between;
  border: 1px solid #f2f3f5;
}
.driver {
  width: 1px;
  height: 94px;
  background: #f2f3f5;
}
.space-over-item {
  .space-title {
    @apply text-xs text-ct-1 mb-3;
  }
  .space-count {
    line-height: normal;
    font-size: 28px;
    font-family: big-num, sans-serif;
    color: rgb(var(--primary-6));
    .unit {
      font-weight: 500;
      font-family: pingfangsc, sans-serif;
    }
  }
  .line-slash {
    position: relative;
    bottom: 2px;
    font-size: 22px;
  }
  .space-sub-title {
    @apply text-xs pt-4 text-ct-3;
  }
}
</style>
