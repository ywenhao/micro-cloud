<template>
  <statistic-analysis-layout ref="statisticAnalysisRef">
    <template #filter>
      <vc-filter-bar
        :refresh="false"
        v-model="filterState"
        :schemas="filterBarScheme"
        @search="handleSearch"
      >
        <template #prefix>
          <a-radio-group
            v-model="shortcut"
            :options="shortcuts"
            type="button"
            @change="handleShortcutChange"
          />
        </template>
        <template #suffix>
          <!-- <input-remote
            :field-names="{ label: 'domain', value: 'id' }"
            :remote-method="getSites"
          /> -->
        </template>
      </vc-filter-bar>
      <!-- <a-range-picker
          :disabled-date="disabledDate"
          v-model="date"
          @change="handleDateChange"
          value-format="X"
        />
        <a-input
          placeholder="请输入站点名称"
          v-model="state.site_name"
        ></a-input>
        <a-input placeholder="请输入用户ID" v-model="state.user_id"></a-input> -->
    </template>
  </statistic-analysis-layout>
</template>

<script setup lang="ts">
import { getCdnSiteListApi } from '@vca/apis/cdn'
import { cloneDeep } from 'lodash-es'
import { TimeRange, timeRangeValue, type VcFilterBarScheme } from 'vc-material'

// import { disabledDate } from '@/utils/utils'
import StatisticAnalysisLayout from './StatisticAnalysisLayout.vue'

const statisticAnalysisRef = ref<typeof StatisticAnalysisLayout>()
const shortcut = ref<number | undefined>(TimeRange.TODAY)
// const date = ref()
const getSites = (keyword: string) => {
  return getCdnSiteListApi({
    offset: 0,
    limit: 20,
    keyword
  })
}

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      widget: 'range',
      startField: 'start_time',
      endField: 'end_time',
      attrs: { valueFormat: 'X' }
    },
    {
      field: 'site_id',
      widget: 'input-remote',
      attrs: {
        placeholder: '请输入站点名称',
        fieldNames: { label: 'domain', value: 'id' },
        remoteMethod: getSites
      }
    },
    {
      field: 'user_id',
      widget: 'input-number',
      attrs: {
        placeholder: '请输入用户ID',
        precision: 0,
        step: 1,
        min: 1,
        max: 999999999,
        hideButton: true,
        parser(value: string) {
          return value.slice(0, 9)
        }
      }
    }
  ]
}

const shortcuts = [
  { label: '今日', value: TimeRange.TODAY },
  { label: '昨日', value: TimeRange.YESTERDAY },
  { label: '近7天', value: TimeRange.RECENT_7_DAYS },
  { label: '近30天', value: TimeRange.RECENT_30_DAYS }
]

export type StatisticState = {
  start_time: number
  end_time: number
  user_id: string
  site_name: string
}

const [st, et] = timeRangeValue(TimeRange.TODAY)
const filterState = ref<StatisticState>({
  start_time: st,
  end_time: et,
  user_id: '',
  site_name: ''
})

const state = ref<StatisticState>({
  start_time: st,
  end_time: et,
  user_id: '',
  site_name: ''
})

const handleShortcutChange = (value: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(value))
  state.value.start_time = start
  state.value.end_time = end
}

const handleSearch = () => {
  state.value = cloneDeep(filterState.value)
}

provide('statisticState', state)
</script>
