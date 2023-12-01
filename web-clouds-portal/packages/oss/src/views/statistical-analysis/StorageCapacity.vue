<template>
  <div>
    <a-radio-group
      v-model="status"
      type="button"
      class="p-0!"
      @change="handleChange"
      v-if="activeName === 'static_storage'"
    >
      <a-radio value="storage">存储量</a-radio>
      <a-radio value="upload_file">上传文件</a-radio>
    </a-radio-group>
    <div
      v-if="activeName === 'static_storage'"
      class="memory-capacity px-6 py-4 my-4 flex"
    >
      <div v-if="status === 'storage'" class="pr-10 flex flex-col">
        <span class="title">当前存储量</span>
        <span class="data-number"
          >{{ bytesData(storageData?.total_size).value
          }}<span class="unit pl-1">{{
            bytesData(storageData?.total_size).symbols
          }}</span></span
        >
        <span class="sub-title pt-1"
          >平均存储量 {{ convertByte(Number(storageData?.avg_size)) }}</span
        >
      </div>
      <div v-if="status === 'storage'" class="flex flex-col pl-10">
        <span class="title">当前文件</span>
        <span class="data-number">{{ storageData?.total_num }}</span>
        <span class="sub-title pt-1"
          >平均文件数 {{ storageData?.avg_num }}
        </span>
      </div>
      <div v-if="status === 'upload_file'" class="flex flex-col pr-10">
        <span class="title">当日上传文件数</span>
        <span class="data-number">{{ uploadFileData?.day_num }}</span>
        <span class="sub-title pt-1"
          >平均文件数 {{ uploadFileData?.avg_num }}
        </span>
      </div>
    </div>
    <div v-else class="memory-capacity px-6 py-4 my-4 flex">
      <div class="flex flex-col pr-10">
        <span class="title">GET 请求总次数</span>
        <span class="data-number">{{ requestFileData?.total_get_num }}</span>
      </div>
      <div class="flex flex-col pr-10">
        <span class="title">GET 请求总平均次数</span>
        <span class="data-number">{{ requestFileData?.avg_get_num }}</span>
      </div>
      <div class="flex flex-col pr-10">
        <span class="title">PUT 请求总次数</span>
        <span class="data-number">{{ requestFileData?.total_put_num }}</span>
      </div>
      <div class="flex flex-col pl-10">
        <span class="title">PUT 请求总平均次数</span>
        <span class="data-number">{{ requestFileData?.avg_put_num }}</span>
      </div>
    </div>
    <echarts-line
      :legend="activeName === 'static_storage' ? legend : fileLegend"
      :fileNumber="status !== 'storage' || activeName !== 'static_storage'"
      v-model:static-data="statisticData"
      :key="getRandom()"
    />
  </div>
</template>

<script setup lang="ts">
import { requestFileApi, storageApi, uploadFileApi } from '@vcp/apis/oss'
import { convertByte, lineChartData } from 'vc-material'

import EchartsLine, { type IEchartsData } from '@/components/EchartsLine.vue'
import type { ByteConverNode } from '@/types/node-manage'

interface IProps {
  activeName: string
}

const props = withDefaults(defineProps<IProps>(), {
  activeName: 'storage'
})

const status = ref<string>('storage')

const filterData = defineModel<any>('filterData')

const legend = computed(() =>
  filterData.value?.label ? [filterData.value?.label] : ['全部']
)

const fileLegend = ['GET', 'PUT']

const bytesData = (bytes: string) => {
  return convertByte(Number(bytes), 'B', false, false) as ByteConverNode
}

const getRandom = () => {
  return Math.random()
}

const storageData = ref()
const uploadFileData = ref()

const requestFileData = ref()

const statisticData = ref<IEchartsData>({
  xAxis: [],
  series: [],
  unit: 'day'
})

/**获取存储量 */
const getStorageData = () => {
  storageApi({
    ...filterData.value,
    bucket_id: filterData.value?.bucket_id || undefined,
    region_id: filterData.value?.region_id || undefined,
    //@ts-ignore
    rangeValue: undefined,
    label: undefined,
    timeDate: undefined
  }).then(res => {
    const { trend } = res
    storageData.value = res
    const { seriesData, xAxisData, unit } = lineChartData(
      trend,
      filterData.value?.start,
      filterData.value?.end,
      'val',
      'metric'
    )
    statisticData.value.xAxis = xAxisData as string[]
    statisticData.value.series[0] = seriesData
    statisticData.value.unit = unit as string
  })
}

/**获取上传文件 */
const getUploadFile = () => {
  uploadFileApi({
    ...filterData.value,
    bucket_id: filterData.value?.bucket_id || undefined,
    region_id: filterData.value?.region_id || undefined,
    //@ts-ignore
    rangeValue: undefined,
    label: undefined,
    timeDate: undefined
  }).then(res => {
    uploadFileData.value = res
    const { trend } = res
    const { seriesData, xAxisData, unit } = lineChartData(
      trend,
      filterData.value?.start,
      filterData.value?.end,
      'val',
      'metric'
    )

    statisticData.value.xAxis = xAxisData as string[]
    statisticData.value.series[0] = seriesData
    statisticData.value.unit = unit as string
  })
}

const handleChange = (val: string | number | boolean) => {
  statisticData.value.series = []
  getRandom()
  if (val === 'storage') {
    getStorageData()
  } else {
    getUploadFile()
  }
}

/** 获取文件请求 */
const getRequestData = () => {
  requestFileApi({
    ...filterData.value,
    bucket_id: filterData.value?.bucket_id || undefined,
    region_id: filterData.value?.region_id || undefined,
    //@ts-ignore
    rangeValue: undefined,
    label: undefined,
    timeDate: undefined
  }).then(res => {
    const { trend } = res
    requestFileData.value = res
    const { seriesData, xAxisData, unit } = lineChartData(
      trend,
      filterData.value?.start,
      filterData.value?.end,
      'get_val',
      'metric'
    )
    statisticData.value.series[0] = seriesData

    const { seriesData: secondSeriesData } = lineChartData(
      trend,
      filterData.value?.start,
      filterData.value?.end,
      'put_val',
      'metric'
    )

    statisticData.value.xAxis = xAxisData as string[]
    statisticData.value.series[1] = secondSeriesData
    statisticData.value.unit = unit as string
  })
}

onMounted(() => {
  if (props.activeName === 'static_storage') {
    if (status.value === 'storage') {
      getStorageData()
    } else {
      getUploadFile()
    }
  } else {
    getRequestData()
  }
})

watch(
  () => filterData.value,
  () => {
    statisticData.value.series = []
    getRandom()
    if (props.activeName === 'static_storage') {
      if (status.value === 'storage') {
        getStorageData()
      } else {
        getUploadFile()
      }
    } else {
      getRequestData()
    }
  }
)

watch(
  () => props.activeName,
  v => {
    statisticData.value.series = []
    getRandom()
    if (v === 'static_storage') {
      if (status.value === 'storage') {
        getStorageData()
      } else {
        getUploadFile()
      }
    } else {
      getRequestData()
    }
  }
)
</script>
