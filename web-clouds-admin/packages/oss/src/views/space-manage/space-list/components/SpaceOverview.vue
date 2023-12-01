<template>
  <a-spin :loading="loading" class="pt-[17px] vc-space-overview">
    <div class="rounded space-over-data">
      <div class="flex flex-col space-over-item">
        <span class="space-title">今日上传存储量</span>
        <span
          class="space-count num"
          v-trans-byte="[dayData?.cur_day_size, '.unit']"
        >
          <span class="unit pl-1 text-sm"></span>
        </span>
        <span class="space-sub-title"
          >昨日上传存储量
          <span class="pl-2" v-locale="Number(dayData?.last_day_size)"></span
        ></span>
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
            >{{ staCodeNumberFormat(monData?.last_mon_get_num || 0, 'string') }}
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
          class="space-count num"
          v-trans-byte="[monData?.cur_mon_get_size, '.unit']"
        >
          <span class="unit pl-1 text-sm"></span>
        </span>
        <span class="space-sub-title"
          >上月空间外网流出流量
          <span
            class="pl-2"
            v-locale="Number(monData?.last_mon_get_size || 0)"
          ></span
        ></span>
      </div>
      <div class="driver"></div>

      <div class="flex flex-col space-over-item">
        <span class="space-title">本月空间外网流入流量</span>
        <span
          class="space-count num"
          v-trans-byte="[monData?.cur_mon_put_size, '.unit']"
        >
          <span class="unit pl-1 text-sm"></span>
        </span>
        <span class="space-sub-title"
          >上月空间外网流入流量
          <span
            class="pl-2"
            v-locale="Number(monData?.last_mon_put_size || 0)"
          ></span
        ></span>
      </div>
    </div>
    <div class="w-full grid grid-cols-2 gap-x-10 gap-y-8 mt-8">
      <echarts-line
        :name="'空间流量'"
        isShowBtn
        isShowTime
        :legend="['流量']"
        :static-data="flowData"
        @upload-status="handleChangeStatus"
      >
      </echarts-line>
      <echarts-line
        :name="'文件请求（GET/PUT）'"
        :legend="['GET', 'PUT']"
        fileNumber
        isShowTime
        :static-data="fileRequest"
      >
      </echarts-line>
      <echarts-line
        :name="'存储量'"
        :legend="['存储']"
        isShowTime
        :static-data="storageData"
      >
      </echarts-line>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { type SpaceBasicModel, spaceViewApi } from '@vca/apis/oss'
import dayjs from 'dayjs'
import { lineChartData } from 'vc-material'

import EchartsLine, { type IEchartsData } from '@/components/EchartsLine.vue'
import type { ByteConverNode } from '@/types/node-manage'
import { formatNumber, getUnixZero, staCodeNumberFormat } from '@/utils'

const spaceDetail = defineModel<SpaceBasicModel>('spaceDetail', {
  required: true
})

const loading = ref<boolean>(false)
const dayData = ref<any>()
const monData = ref<any>()
const storageData = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'week'
})

const fileRequest = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'week'
})

const flowData = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'week'
})

const flow_data = ref()

const handleChangeStatus = (val: string) => {
  if (val === 'get_val') {
    flowData.value.series[0] = flow_data.value?.secondSeriesData
  } else {
    flowData.value.series[0] = flow_data.value?.seriesData
  }
}

const getSpaceView = () => {
  loading.value = true
  const start = getUnixZero(dayjs().subtract(6, 'days') as unknown as number)
  const end = getUnixZero() + 86399
  const { id, region_id, user_id } = spaceDetail.value
  spaceViewApi({
    bucket_id: id,
    region_id: region_id,
    user_id: user_id,
    start: String(start),
    end: String(end)
  })
    .then(res => {
      const {
        day_static,
        mon_static,
        storage_size_trend,
        file_req_trend,
        bucket_byte_trend
      } = res
      dayData.value = day_static
      monData.value = mon_static
      const { xAxisData, seriesData } = lineChartData(
        file_req_trend,
        start,
        end,
        'get_val',
        'metric'
      )
      const { seriesData: secondSeriesData } = lineChartData(
        file_req_trend,
        start,
        end,
        'put_val',
        'metric'
      )

      fileRequest.value.xAxis = xAxisData as string[]
      fileRequest.value.series[0] = seriesData
      fileRequest.value.series[1] = secondSeriesData
      const storage_data = lineChartData(
        storage_size_trend,
        start,
        end,
        'val',
        'metric'
      )
      storageData.value.xAxis = storage_data?.xAxisData as string[]
      storageData.value.series[0] = storage_data?.seriesData
      //put 流入流量，get 流出流量
      flow_data.value = lineChartData(
        bucket_byte_trend,
        start,
        end,
        'get_val',
        'metric'
      )
      const { seriesData: flowPutData } = lineChartData(
        bucket_byte_trend,
        start,
        end,
        'put_val',
        'metric'
      )
      flow_data.value.secondSeriesData = flowPutData
      flowData.value.xAxis = flow_data.value?.xAxisData
      flowData.value.series[0] = flow_data.value?.seriesData
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  if (spaceDetail.value?.id) {
    getSpaceView()
  }
})

watch(
  () => spaceDetail.value,
  v => {
    v && getSpaceView()
  }
)
</script>

<style scoped lang="less">
.vc-space-overview {
  @apply w-full;
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
      @apply text-xs;
      color: var(--color-text-1);
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
      @apply text-xs pt-2;
      color: var(--color-text-3);
    }
  }
}
</style>
<style lang="less">
.vc-tooltip-tigger {
  box-shadow: 0px 4px 10px rgba(29, 33, 41, 0.1);
}
</style>
