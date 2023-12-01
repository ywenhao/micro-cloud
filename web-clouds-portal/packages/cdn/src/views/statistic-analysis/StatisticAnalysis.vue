<template>
  <statistic-analysis-layout ref="statisticAnalysisRef">
    <template #filter>
      <a-space :size="8" class="my-4">
        <a-radio-group
          v-model="shortcut"
          :options="shortcuts"
          type="button"
          @change="handleShortcutChange"
        />
        <a-range-picker v-model="date" format="X" />
      </a-space>
    </template>
  </statistic-analysis-layout>
</template>

<script setup lang="ts">
import { TimeRange, timeRangeValue } from 'vc-material'

import StatisticAnalysisLayout from './StatisticAnalysisLayout.vue'

const statisticAnalysisRef = ref<typeof StatisticAnalysisLayout>()
const shortcut = ref(TimeRange.TODAY)
const date = ref()
const shortcuts = [
  { label: '今日', value: TimeRange.TODAY },
  { label: '昨日', value: TimeRange.YESTERDAY },
  { label: '近7天', value: TimeRange.RECENT_7_DAYS },
  { label: '近30天', value: TimeRange.RECENT_30_DAYS }
]
export type StatisticState = {
  start_time: number
  end_time: number
  user_id: number
  site_id: number
}

const [st, et] = timeRangeValue(TimeRange.TODAY)
const state = ref<StatisticState>({
  start_time: st,
  end_time: et,
  user_id: 0,
  site_id: 0
})

const handleShortcutChange = (value: string | number | boolean) => {
  const [start, end] = timeRangeValue(Number(value))
  state.value.start_time = start
  state.value.end_time = end
}

provide('statisticState', state)
</script>
