<template>
  <div class="h-full overscroll-y-auto">
    <div class="bg-white p-6 rounded-2px">
      <div class="grid grid-cols-2 gap-x-2">
        <div class="flex flex-col">
          <span class="text-base font-medium text-ct-1">存储空间</span>
          <a-spin :loading="storageLoading">
            <div class="memory-capacity px-6 py-4 mt-4 flex">
              <div class="flex flex-col pr-10">
                <span class="title">总存储空间</span>
                <span
                  class="data-number"
                  v-trans-byte="[
                    Number(nodeStorageData?.total_kb) * 1024,
                    '.unit'
                  ]"
                  ><span class="unit pl-1"></span
                ></span>
              </div>
              <div class="flex flex-col px-10">
                <span class="title">已使用空间</span>
                <span
                  class="data-number"
                  v-trans-byte="[
                    Number(nodeStorageData?.used_kb * 1024),
                    '.unit'
                  ]"
                  ><span class="unit pl-1"></span
                ></span>
              </div>
              <div class="flex flex-col pl-10">
                <span class="title">已使用占比</span>
                <span class="data-number">
                  <span
                    v-percentage:unsign="
                      Number(nodeStorageData?.total_kb)
                        ? (
                            Number(nodeStorageData?.used_kb) /
                            Number(nodeStorageData?.total_kb)
                          ).toFixed(2)
                        : 0
                    "
                  ></span>
                  <span class="unit pl-1">%</span>
                </span>
              </div>
            </div>
          </a-spin>
          <span class="text-base font-medium text-ct-1 mt-8 mb-4">
            各区域存储空间
          </span>
          <a-spin :loading="loading">
            <div class="memory-border p-6">
              <pie-chart
                v-if="storageUsedData?.length"
                :pie-statistic="storageUsedData"
                :show-legend="storageUsedData?.length > 0"
              />
              <empty-view v-else />
            </div>
          </a-spin>
          <span class="text-base font-medium text-ct-1 mt-8 mb-4">
            空间分布
          </span>
          <a-spin :loading="loading">
            <div class="memory-border p-6">
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
          <span class="text-base font-medium text-ct-1">节点情况</span>
          <a-spin :loading="storageLoading">
            <div class="memory-capacity px-6 py-4 mt-4 flex">
              <div class="flex flex-col pr-10">
                <span class="title">总节点数</span>
                <div class="inline">
                  <span
                    class="data-number"
                    v-locale="nodeStorageData?.total_num"
                  />
                  <span class="unit pl-1 color-primary">个</span>
                </div>
              </div>
            </div>
          </a-spin>
          <div class="mt-8 mb-4 flex items-center">
            <span class="text-base font-medium text-ct-1"
              >各节点已用空间TOP5
            </span>
            <div
              class="node-space-btn flex justify-between grid grid-cols-2 gap-x-1 ml-2 cursor-pointer"
            >
              <span
                class="w-[26px] text-center"
                :class="nodeStatus === 'show_echarts' ? 'bg-white rounded' : ''"
                @click="handleClickStatus('show_echarts')"
                ><vc-svg-icon prefix="oss" name="icon_horizontal"></vc-svg-icon
              ></span>
              <span
                class="w-[26px] text-center"
                :class="nodeStatus !== 'show_echarts' ? 'bg-white rounded' : ''"
                @click="handleClickStatus('show_list')"
              >
                <vc-svg-icon prefix="oss" name="icon_vertical"></vc-svg-icon
              ></span>
            </div>
          </div>

          <a-spin :loading="nodeLoading">
            <div v-if="nodeStatus === 'show_echarts'" class="memory-border p-6">
              <columnar-chart
                v-if="nodeFive.series?.length"
                :static-data="nodeFive"
              />
              <empty-view v-else />
            </div>
            <node-list v-else v-model:data="nodeFiveList" />
          </a-spin>
          <span class="text-base font-medium text-ct-1 mt-8 mb-4"
            >空间存储量TOP3</span
          >
          <a-spin :loading="loading">
            <div class="memory-border p-6">
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
        <div class="rounded space-over-data mt-4">
          <div class="flex flex-col space-over-item">
            <span class="space-title">今日上传存储量</span>
            <span class="space-count"
              >{{ bytesData(dayData?.cur_day_size || 0).value }}
              <span class="pl-1 text-sm">{{
                bytesData(dayData?.cur_day_size).symbols
              }}</span>
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
            <span class="space-count"
              >{{ bytesData(monData?.cur_mon_get_size || 0).value }}
              <span class="pl-1 text-sm">{{
                bytesData(monData?.cur_mon_get_size || 0).symbols
              }}</span>
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
            <span class="space-count"
              >{{ bytesData(monData?.cur_mon_put_size || 0).value }}
              <span class="pl-1 text-sm">{{
                bytesData(monData?.cur_mon_put_size || 0).symbols
              }}</span>
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
    <div class="mt-4 bg-white rounded-2px p-6">
      <span class="text-base font-medium text-ct-1">存储趋势</span>
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
      <a-spin :loading="loading" class="w-full">
        <echarts-line :legend="['存储总量']" :static-data="storageLineData" />
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nodeStatisticApi, nodeTrendApi, overViewApi } from '@vca/apis/oss'
import dayjs from 'dayjs'
import { convertByte, lineChartData } from 'vc-material'

import ColumnarChart from '@/components/ColumnarChart.vue'
import EchartsLine, { type IEchartsData } from '@/components/EchartsLine.vue'
import EmptyView from '@/components/EmptyView.vue'
import PieChart from '@/components/PieChart.vue'
import { REGION_LIST_DATA } from '@/components/SelectData'
import type { ByteConverNode } from '@/types/node-manage'
import {
  disabledDate,
  formatNumber,
  getUnixZero,
  staCodeNumberFormat
} from '@/utils'

import NodeList from './NodeList.vue'

const storageUsedData = ref()
const storageNumberData = ref()
const storageThree = ref<IEchartsData>({
  series: [],
  xAxis: [],
  unit: ''
})
const nodeStorageData = ref()
const loading = ref<boolean>(false)
const storageLoading = ref<boolean>(false)
const nodeLoading = ref<boolean>(false)

const storageLineData = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'week'
})
const bytesData = (bytes: string | number) => {
  return convertByte(Number(bytes), 'B', false, false) as ByteConverNode
}

const nodeStatus = ref<string>('show_echarts')

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

const handleClickStatus = (type: string) => {
  nodeStatus.value = type
}

/**获取概览数据 */
const getOverview = () => {
  loading.value = true
  overViewApi({
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

const getRegionName = (id: string) => {
  return REGION_LIST_DATA.value.find((item: any) => item?.value === id)?.label
}

/**节点统计信息 */
const getNodeStatistics = () => {
  storageLoading.value = true
  nodeStatisticApi()
    .then(res => {
      nodeStorageData.value = res
    })
    .finally(() => {
      storageLoading.value = false
    })
}

const nodeFive = ref<IEchartsData>({
  series: [],
  xAxis: [],
  ipList: [],
  unit: ''
})

const nodeFiveList = ref<any[]>([])

/**获取节点趋势数据 */
const getNodeTrend = () => {
  nodeLoading.value = true
  nodeTrendApi({ limit: 5 })
    .then(res => {
      //@ts-ignore
      nodeFiveList.value = res.list?.map((item: any) => ({
        ...item,
        region_name: getRegionName(item.region_id)
      }))
      //@ts-ignore
      nodeFive.value.series = res.list?.map(
        (item: any) => Number(item.used_kb) * 1024
      )
      //@ts-ignore
      nodeFive.value.xAxis = res.list?.map((item: any) =>
        getRegionName(item.region_id)
      )
      //@ts-ignore
      nodeFive.value.ipList = res.list?.map((item: any) => item.ip)
    })
    .finally(() => {
      nodeLoading.value = false
    })
}

onMounted(() => {
  getNodeStatistics()
  getNodeTrend()
})

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
  height: 72px;
  background: #f2f3f5;
}
.space-over-item {
  .space-title {
    @apply text-xs text-ct-1;
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
    @apply text-xs pt-2 text-ct-3;
  }
}
</style>
