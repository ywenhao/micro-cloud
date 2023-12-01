<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 grid gap-x-3 gap-y-3">
      <a-select
        class="w-[136px]!"
        v-model="queryData.region_id"
        placeholder="请选择"
        :options="REGION_LIST_DATA"
        @change="handleRegion"
      ></a-select>
      <a-select
        class="w-[136px]!"
        :loading="spaceLoading"
        v-model="queryData.bucket_id"
        placeholder="请选择"
        :options="spaceListOption"
        @dropdown-reach-bottom="handleReachBottom"
      ></a-select>
      <a-radio-group
        v-model="queryData.timeDate"
        type="button"
        class="p-0!"
        @change="handleChangeBtn"
      >
        <a-radio
          v-for="item in dateRangeOptions"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-radio
        >
      </a-radio-group>
      <a-range-picker
        v-model="queryData.rangeValue"
        @change="onChange"
        value-format="X"
        class="w-[280px]!"
        :disabled-date="disabledDate"
      />
      <a-select
        class="w-[136px]!"
        v-model="queryData.region_id"
        placeholder="请选择"
        :options="REGION_LIST_DATA"
        @change="handleRegion"
      ></a-select>
      <a-select
        class="w-[136px]!"
        v-model="queryData.bucket_id"
        placeholder="请选择"
        :options="spaceListOption"
        @dropdown-reach-bottom="handleReachBottom"
      ></a-select>
    </div>
    <!-- <vc-filter-bar class="w-10!"> </vc-filter-bar> -->
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

import {
  GET_SPACE_LIST_DATA_LIST,
  REGION_LIST_DATA
} from '@/components/SelectData'
import { getUnixZero } from '@/utils'

export interface IQueryData {
  region_id?: string
  bucket_id?: string
  timeDate?: string
  rangeValue?: string[] | number[]
  user_id?: string
  label?: string
  start?: string | number
  end?: string | number
}

const emit = defineEmits<{
  (event: 'update-filter', data: IQueryData): void
}>()

const queryData = ref<IQueryData>({
  region_id: '',
  bucket_id: '',
  timeDate: 'yesterday',
  rangeValue: [],
  user_id: '',
  label: ''
})

const spaceListOption = ref([
  {
    value: '',
    label: '全部空间',
    user_id: ''
  }
])

const space_data = computed(() =>
  spaceListOption.value.find(
    (item: any) => item.value === queryData.value.bucket_id
  )
)

const dateRangeOptions = [
  { label: '昨天', value: 'yesterday' },
  { label: '今天', value: 'today' },
  { label: '7天', value: 'last7Days' },
  { label: '本月', value: 'currentMonths' },
  { label: '上月', value: 'lastMonths' }
]

const startTime = ref<string | number>('')
const endTime = ref<string | number>('')

const spacePage = ref<number>(0)
const spaceLoading = ref<boolean>(false)

/** 时间变化 */
const handleChangeBtn = (val: string | number | boolean) => {
  const unixZero = getUnixZero()
  const now = new Date()
  const nowYear = now.getFullYear() //当前年
  const nowMonth = now.getMonth() //当前月
  const day = new Date(nowYear, nowMonth, 0).getDate()

  const valueMap = {
    today: {
      startTime: unixZero,
      endTime: unixZero + 86399
    },
    yesterday: {
      startTime: getUnixZero(dayjs().subtract(1, 'days') as unknown as number),
      endTime:
        getUnixZero(dayjs().subtract(1, 'days') as unknown as number) + 86399
    },
    last7Days: {
      startTime: getUnixZero(dayjs().subtract(6, 'days') as unknown as number),
      endTime: getUnixZero() + 86399
    },
    currentMonths: {
      startTime: new Date(nowYear, nowMonth, 1).getTime() / 1000,
      endTime: new Date(nowYear, nowMonth + 1, 0).getTime() / 1000
    },
    lastMonths: {
      startTime: new Date(nowYear, nowMonth - 1, 1).getTime() / 1000,
      endTime: new Date(nowYear, nowMonth - 1, day).getTime() / 1000
    }
  }
  // @ts-ignore
  const { startTime, endTime } = valueMap[val]
  // @ts-ignore
  queryData.value.rangeValue = [startTime * 1000, endTime * 1000]
  queryData.value.start = startTime
  queryData.value.end = endTime
}

const getSpaceList = (data: any) => {
  spaceLoading.value = true
  GET_SPACE_LIST_DATA_LIST({ ...data }).then(list_data => {
    //@ts-ignore
    spaceListOption.value = spaceListOption.value.concat(list_data)
    spaceLoading.value = false
  })
}

const handleRegion = () => {
  spaceListOption.value = [
    {
      value: '',
      label: '全部空间',
      user_id: ''
    }
  ]
  getSpaceList({
    limit: 20,
    offset: 0,
    region_id: queryData.value?.region_id as string
  })
}

const onChange = (dateString: any) => {
  queryData.value.start = dateString[0]
  queryData.value.end = dateString[1]
  queryData.value.timeDate = ''
}

/** 滚动条滚动 */
const handleReachBottom = () => {
  const offset = (spacePage.value + 1) * 20
  getSpaceList({ limit: 20, offset })
}

onMounted(() => {
  getSpaceList({ limit: 20, offset: 0 })
  startTime.value =
    getUnixZero(dayjs().subtract(1, 'days') as unknown as number) * 1000
  endTime.value =
    (getUnixZero(dayjs().subtract(1, 'days') as unknown as number) + 86399) *
    1000
  // @ts-ignore
  queryData.value.rangeValue = [startTime.value, endTime.value]
})

watch(
  () => space_data.value,
  v => {
    queryData.value.user_id = v?.user_id as string
    queryData.value.label = v?.label as string
  }
)

watch(
  () => queryData.value,
  v => {
    emit('update-filter', v)
  },
  { deep: true, immediate: true }
)
</script>
