<template>
  <vc-container
    admin
    header-bordered
    class="rounded-sm! node-manage"
    page-title="节点管理"
  >
    <div class="w-full">
      <div class="py-4 node-statistics mb-4">
        <div
          v-for="item in statisticsList"
          :key="item.title"
          class="flex flex-col"
        >
          <span class="text-[var(--color-text-1)] text-xs">
            {{ item.name }}
          </span>
          <span class="inline">
            <span class="text-[rgb(var(--primary-6))] data-number">
              {{
              (convertByte(Number(item.value) * 1024, 'B', false, false) as ByteConverNode)
                ?.value
              }}
            </span>
            <span class="text-[rgb(var(--primary-6))] pl-2 number-unit">
              {{
               item.unit || (convertByte(Number(item.value) * 1024, 'B', false, false) as ByteConverNode)
                  ?.symbols
              }}
            </span>
            <span
              v-if="
                ['used_kb', 'remaining'].includes(item.title) && item.percent
              "
              class="px-2 py-[2px] ml-2 text-xs rounded"
              :class="item.title === 'remaining' ? 'total-remaining' : ''"
              :style="{background:dynamicColor(item.percent as number)[0],color:dynamicColor(item.percent as number)[1]}"
            >
              {{ item?.percent }}%
            </span>
          </span>
        </div>
      </div>
      <vc-filter-bar
        v-model:page="pagination.page"
        v-model="state"
        :schemas="filterBarScheme"
        @search="handleSearch"
      >
      </vc-filter-bar>
    </div>
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      class="mt-4"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @sorter-change="handleSorterChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #region_id="{ record }">
        {{ regionName(record.region_id) }}
      </template>
      <template #total_kb="{ record }">
        {{ convertByte(Number(record.total_kb) * 1024) }}
      </template>
      <template #used_kb="{ record }">
        {{ convertByte(Number(record.used_kb) * 1024) }}
        <span class="text-[var(--color-text-4)] px-1">—</span>
        <span
          :class="
            Number(percent(record)) < 21
              ? 'text-success'
              : Number(percent(record)) < 51
              ? 'text-waring'
              : 'text-danger'
          "
          >{{ Number(record.total_kb) ? percent(record) : 0 }}%</span
        >
      </template>
      <template #remaining_kb="{ record }">
        {{
          convertByte((Number(record.total_kb) - Number(record.used_kb)) * 1024)
        }}
        <span class="text-[var(--color-text-4)] px-1">—</span>
        <span
          :class="
            Number(percent(record, 'remaining')) < 21
              ? 'text-danger'
              : Number(percent(record, 'remaining')) < 51
              ? 'text-waring'
              : 'text-success'
          "
          >{{
            Number(record.total_kb) ? percent(record, 'remaining') : 0
          }}%</span
        >
      </template>
      <template #time="{ record }">
        {{ timeInterval(Number(record.used_sec)) }}
      </template>
    </a-table>
  </vc-container>
</template>

<script setup lang="tsx">
import { nodeListApi, nodeStatistic } from '@vca/apis/oss'
import {
  convertByte,
  useListRequest,
  type VcFilterBarScheme
} from 'vc-material'

import { REGION_LIST_DATA } from '@/components/SelectData'
import type {
  ByteConverNode,
  DataSource,
  NodeStatistic,
  StatisticData
} from '@/types/node-manage'
import { timeInterval } from '@/utils'

import columns from './columns'

const statisticsData = ref<StatisticData>()

const statisticsList = ref<NodeStatistic[]>([
  {
    name: '总数',
    title: 'total_num',
    unit: '个',
    value: computed(() => statisticsData.value?.total_num) as unknown as string
  },
  {
    name: '总存储空间',
    title: 'total_kb',
    value: computed(() => statisticsData.value?.total_kb) as unknown as string
  },
  {
    name: '总用量',
    title: 'used_kb',
    value: computed(() => statisticsData.value?.used_kb) as unknown as string,
    percent: computed(() =>
      Number(statisticsData.value?.total_kb)
        ? (
            (Number(statisticsData.value?.used_kb) /
              Number(statisticsData.value?.total_kb)) *
            100
          ).toFixed(2)
        : 0
    ) as unknown as number
  },
  {
    name: '总剩余',
    title: 'remaining',
    value: computed(
      () =>
        Number(statisticsData.value?.total_kb) -
        Number(statisticsData.value?.used_kb)
    ) as unknown as string,
    percent: computed(() =>
      Number(statisticsData.value?.total_kb)
        ? (
            ((Number(statisticsData.value?.total_kb) -
              Number(statisticsData.value?.used_kb)) /
              Number(statisticsData.value?.total_kb)) *
            100
          ).toFixed(2)
        : 0
    ) as unknown as number
  }
])

const dynamicColor = computed(() => (precent: number) => {
  if (precent <= 60) return ['#E8FFEA', '#00B42A']
  if (precent <= 80) return ['#FFF7E8', '#FF7D00']
  if (precent <= 90) return ['#FFECE8', '#F53F3F']
  return ['#FDCDC5', '#CB272D']
})

const percent = computed(
  () => (v: DataSource, type?: string) =>
    type
      ? (
          ((Number(v.total_kb) - Number(v.used_kb)) / Number(v.total_kb)) *
          100
        ).toFixed(2)
      : ((Number(v.used_kb) / Number(v.total_kb)) * 100).toFixed(2)
)

const state = ref({})

const {
  pagination,
  arcoPagination,
  loading,
  data: dataSource,
  run: getTableList
} = useListRequest(nodeListApi, state, {
  showPageSize: true,
  showTotal: true
})

const filterBarScheme = computed<VcFilterBarScheme>(() => {
  return {
    widgets: [
      {
        field: 'region_id',
        widget: 'select',
        defaultValue: '',
        attrs: {
          placeholder: '请选择',
          width: 136,
          options: computed(() => REGION_LIST_DATA.value)
        }
      },
      {
        field: 'ip',
        widget: 'input-icon',
        attrs: {
          placeholder: '请输入IP',
          maxLength: 128
        }
      }
    ]
  } as VcFilterBarScheme
})

const regionName = computed(() => (id: string) => {
  let name = '-'
  REGION_LIST_DATA.value.some(({ value, label }) => {
    value === id ? (name = label) : ''
  })
  return name
})

const handleSearch = () => {
  getTableList()
}

const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
  getTableList()
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  state.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  state.value.sort = direction ? dataIndex : undefined
  getTableList()
}

const getStatistics = () => {
  nodeStatistic().then(res => {
    statisticsData.value = res
  })
}

onMounted(() => {
  getStatistics()
  getTableList()
})
</script>

<style scoped lang="less">
.node-manage {
  .node-statistics {
    background: linear-gradient(
      180deg,
      rgba(232, 243, 255, 0.3) 0%,
      rgba(232, 243, 255, 0.1) 100%
    );
    border: 1px solid #f2f3f5;
    @apply grid grid-cols-4 rounded;
    .total-remaining {
      @apply bg-white! text-[var(--color-text-2)]!;
      border: 1px solid #e5e6eb;
    }
    > div {
      @apply pl-6;
      border-left: 1px solid #f2f3f5;
      &:first-child {
        @apply border-none;
      }
    }
  }
}
</style>
